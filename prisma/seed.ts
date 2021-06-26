import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
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

  const usr1 = await prisma.user.create({
    data: {
      firstname: 'John',
      lastname: 'Doe',
      email: 'john.doe@mail.com',
      hashedPassword: 'password',
    },
  });

  const usr2 = await prisma.user.create({
    data: {
      firstname: 'Steve',
      lastname: 'Smith',
      email: 'steve.smith@mail.com',
      hashedPassword: 'password',
    },
  });

  const hou1 = await prisma.household.create({
    data: {
      name: 'hou1',
      ownerId: usr1.id,
    },
  });

  const hou2 = await prisma.household.create({
    data: {
      name: 'hou2',
      ownerId: usr2.id,
    },
  });

  const usr1new = await prisma.user.update({
    where: { id: usr1.id },
    data: {
      households: {
        connect: { id: hou1.id },
      },
    },
  });

  const usr1new2 = await prisma.user.update({
    where: { id: usr1.id },
    data: {
      households: {
        connect: { id: hou2.id },
      },
    },
  });

  const pay1 = await prisma.payment.create({
    data: {
      name: 'pay1',
      value: 20.02,
      categoryId: cat1.id,
      userId: usr1.id,
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
