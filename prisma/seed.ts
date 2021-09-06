import { PrismaClient } from '@prisma/client';
import { hashSync } from 'bcrypt';
import { addDays, subDays } from 'date-fns';
import faker from 'faker';

const prisma = new PrismaClient();

async function main() {
  // create 2 users
  let users = [];
  for (let i = 0; i < 2; i++) {
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

  let testUser = await prisma.user.create({
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

  const hou1 = await prisma.household.create({
    data: {
      name: 'hou1',
      ownerId: testUser.id,
    },
  });

  testUser = await prisma.user.update({
    where: { id: testUser.id },
    data: {
      households: {
        connect: { id: hou1.id },
      },
    },
  });

  const hou2 = await prisma.household.create({
    data: {
      name: 'hou2',
      ownerId: users[1].id,
    },
  });

  const usr0new = await prisma.user.update({
    where: { id: users[0].id },
    data: {
      households: {
        connect: { id: hou1.id },
      },
    },
  });

  const usr1new = await prisma.user.update({
    where: { id: users[1].id },
    data: {
      households: {
        connect: { id: hou2.id },
      },
    },
  });

  const payments = await prisma.payment.createMany({
    data: [
      {
        name: 'pay1',
        value: 20.01,
        categoryId: cat1.id,
        userId: users[0].id,
        householdId: hou1.id,
      },
      {
        name: 'pay2',
        value: 40.02,
        categoryId: cat1.id,
        userId: users[0].id,
        householdId: hou1.id,
      },
      {
        name: 'pay3',
        value: 60.03,
        categoryId: cat1.id,
        userId: users[0].id,
        householdId: hou1.id,
      },
    ],
  });

  const recurringPayments = await prisma.recurringPayment.createMany({
    data: [
      {
        name: 'recPay1',
        value: 25.0,
        interval: 'WEEKLY',
        categoryId: cat1.id,
        householdId: hou1.id,
        startDate: new Date(subDays(new Date(), 9)),
      },
      {
        name: 'recPay2',
        value: 25.0,
        description: 'This recurring payment has a description',
        interval: 'MONTHLY',
        categoryId: cat1.id,
        householdId: hou1.id,
        startDate: new Date(subDays(new Date(), 9)),
        endDate: new Date(addDays(new Date(), 90)),
      },
      {
        name: 'recPay3',
        value: 25.0,
        interval: 'DAILY',
        categoryId: cat1.id,
        householdId: hou1.id,
        startDate: new Date(subDays(new Date(), 9)),
      },
    ],
  });

  const inv1 = await prisma.invite.create({
    data: {
      invitedEmail: 'test@mail.com',
      wasUsed: false,
      senderId: testUser.id,
      householdId: hou1.id,
      validUntil: addDays(new Date(), 14),
    },
  });

  const group1 = await prisma.group.create({
    data: {
      name: 'My Group 1',
      value: 40,
      members: { connect: { id: testUser.id } },
      transactions: {
        connectOrCreate: {
          create: { name: 'Transaction 1', value: 40, userId: testUser.id },
          where: { id: '' },
        },
      },
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
