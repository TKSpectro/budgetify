import { PrismaClient } from '@prisma/client';
import { hashSync } from 'bcrypt';
import faker from 'faker';

const prisma = new PrismaClient();

async function main() {
  // create 50 users
  let users = [];
  for (let i = 0; i < 50; i++) {
    // create the name before so we can use it for the email faking
    let firstname = faker.name.firstName();
    let lastname = faker.name.lastName();

    users[i] = await prisma.user.create({
      data: {
        firstname,
        lastname,
        email: faker.internet.email(firstname, lastname, 'budgetifyTest.prisma'),
        hashedPassword: faker.internet.password(16),
      },
    });
  }

  const testUser = await prisma.user.create({
    data: {
      firstname: 'tom',
      lastname: 'test',
      email: 'tom@mail.com',
      hashedPassword: hashSync('12345678', 10),
    },
  });

  const cat1 = await prisma.category.create({
    data: {
      name: 'cat1',
    },
  });
  const cat2 = await prisma.category.create({
    data: {
      name: 'cat2',
    },
  });
  const cat3 = await prisma.category.create({
    data: {
      name: 'cat3',
    },
  });

  const hou1 = await prisma.household.create({
    data: {
      name: 'hou1',
      ownerId: testUser.id,
    },
  });

  const hou2 = await prisma.household.create({
    data: {
      name: 'hou2',
      ownerId: users[1].id,
    },
  });

  const testUsernew = await prisma.user.update({
    where: { id: testUser.id },
    data: {
      households: {
        connect: { id: hou1.id },
      },
    },
  });

  const usr1new = await prisma.user.update({
    where: { id: users[0].id },
    data: {
      households: {
        connect: { id: hou1.id },
      },
    },
  });

  const usr1new2 = await prisma.user.update({
    where: { id: users[1].id },
    data: {
      households: {
        connect: { id: hou2.id },
      },
    },
  });

  const pay1 = await prisma.payment.create({
    data: {
      name: 'pay1',
      value: 20.01,
      categoryId: cat1.id,
      userId: users[0].id,
      householdId: hou1.id,
    },
  });

  const pay2 = await prisma.payment.create({
    data: {
      name: 'pay2',
      value: 40.02,
      categoryId: cat1.id,
      userId: users[0].id,
      householdId: hou1.id,
    },
  });

  const pay3 = await prisma.payment.create({
    data: {
      name: 'pay3',
      value: 60.03,
      categoryId: cat1.id,
      userId: users[0].id,
      householdId: hou1.id,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
