import { PrismaClient } from '@prisma/client';
import { hashSync } from 'bcrypt';
import { addDays, subDays, subMinutes } from 'date-fns';
import faker from 'faker';
import { TransactionType } from '../src/graphql/__generated__/types';

const prisma = new PrismaClient();

/*
! When defining values for payemnts/transactions you need to write 40.00€ as 4000 because of a custom
! Money Type implementation
 */

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
        email: faker.internet.email(firstname, lastname, process.env.DOMAIN || 'budgetify.xyz'),
        hashedPassword: faker.internet.password(16),
      },
    });
  }

  let testUser = await prisma.user.create({
    data: {
      firstname: 'Tom',
      lastname: 'Budgetify',
      email: 'tom@' + process.env.DOMAIN,
      hashedPassword: hashSync('12345678', 10),
    },
  });

  let userB = await prisma.user.create({
    data: {
      firstname: 'Berta',
      lastname: faker.name.lastName(),
      email: 'tomb@' + process.env.DOMAIN,
      hashedPassword: hashSync('12345678', 10),
    },
  });
  let userC = await prisma.user.create({
    data: {
      firstname: 'Claus',
      lastname: faker.name.lastName(),
      email: 'tomc@' + process.env.DOMAIN,
      hashedPassword: hashSync('12345678', 10),
    },
  });
  let userD = await prisma.user.create({
    data: {
      firstname: 'Dobby',
      lastname: faker.name.lastName(),
      email: 'tomd@' + process.env.DOMAIN,
      hashedPassword: hashSync('12345678', 10),
    },
  });
  let userE = await prisma.user.create({
    data: {
      firstname: 'Erna',
      lastname: faker.name.lastName(),
      email: 'tome@' + process.env.DOMAIN,
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
  const cat4 = await prisma.category.create({
    data: {
      name: 'cat4',
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
  const categories = [cat1, cat2, cat3, cat4];
  // Create a bunch of payments in the range of -100..100 euros
  for (let i = 0; i < 50; i++) {
    const randomCat = categories[faker.datatype.number({ min: 0, max: 3 })];
    await prisma.payment.create({
      data: {
        name: faker.lorem.words(2),
        value: faker.datatype.number({ min: -10000, max: 10000, precision: 1 }),
        categoryId: randomCat.id,
        userId: users[0].id,
        householdId: hou1.id,
        createdAt: faker.date.past(0.3),
      },
    });
  }

  const payments = await prisma.payment.createMany({
    data: [
      {
        name: 'pay1',
        value: 20001,
        categoryId: cat1.id,
        userId: users[0].id,
        householdId: hou1.id,
        createdAt: faker.date.past(1),
      },
      {
        name: 'pay2',
        value: 40002,
        categoryId: cat1.id,
        userId: users[0].id,
        householdId: hou1.id,
        createdAt: faker.date.past(1),
      },
      {
        name: 'pay3',
        value: 60003,
        categoryId: cat1.id,
        userId: users[0].id,
        householdId: hou1.id,
        createdAt: faker.date.past(1),
      },
    ],
  });

  const recurringPayments = await prisma.recurringPayment.createMany({
    data: [
      {
        name: 'recPay1',
        value: 2500,
        interval: 'WEEKLY',
        categoryId: cat1.id,
        householdId: hou1.id,
        userId: testUser.id,
        startDate: new Date(subDays(new Date(), 9)),
      },
      {
        name: 'recPay2',
        value: 2500,
        description: 'This recurring payment has a description',
        interval: 'MONTHLY',
        categoryId: cat1.id,
        householdId: hou1.id,
        userId: testUser.id,
        startDate: new Date(subDays(new Date(), 9)),
        endDate: new Date(addDays(new Date(), 90)),
      },
      {
        name: 'recPay3',
        value: 2500,
        interval: 'DAILY',
        categoryId: cat1.id,
        householdId: hou1.id,
        userId: testUser.id,
        startDate: new Date(subDays(new Date(), 9)),
      },
    ],
  });

  const inv1 = await prisma.invite.create({
    data: {
      invitedEmail: 'test@' + process.env.DOMAIN,
      wasUsed: false,
      senderId: testUser.id,
      householdId: hou1.id,
      validUntil: addDays(new Date(), 14),
    },
  });

  const group1 = await prisma.group.create({
    data: {
      name: 'My Group 1',
      value: 3000,
      members: {
        connect: [
          { id: testUser.id },
          { id: userB.id },
          { id: userC.id },
          { id: userD.id },
          { id: userE.id },
        ],
      },
      owners: {
        connect: { id: testUser.id },
      },
      transactions: {
        create: [
          {
            id: '0',
            name: 'ALL go shopping',
            value: -1000,
            type: TransactionType.Buy,
            userId: testUser.id,
          },

          {
            id: '1',
            name: 'A top up',
            value: 2000,
            type: TransactionType.TopUp,
            userId: testUser.id,
          },
          {
            id: '2',
            name: 'C top up',
            value: 2000,
            type: TransactionType.TopUp,
            userId: userC.id,
          },
          {
            id: '3',
            name: 'D top up',
            value: 1000,
            type: TransactionType.TopUp,
            userId: userD.id,
          },
          {
            id: '4',
            name: 'A B C go shopping',
            value: -1000,
            type: TransactionType.Buy,
            userId: testUser.id,
          },
        ],
      },
      thresholds: {
        create: [
          { name: 'Threshold Goal', value: 10000, type: 'GOAL' },
          { name: 'Threshold Max', value: 100, type: 'MAX' },
          { name: 'Threshold Min', value: 0, type: 'MIN' },
        ],
      },
    },
    include: { transactions: true },
  });

  await prisma.groupTransaction.update({
    where: { id: '0' },
    data: {
      participants: {
        connect: [
          { id: testUser.id },
          { id: userB.id },
          { id: userC.id },
          { id: userD.id },
          { id: userE.id },
        ],
      },
    },
  });

  await prisma.groupTransaction.update({
    where: { id: '1' },
    data: {
      participants: {
        connect: { id: testUser.id },
      },
    },
  });

  await prisma.groupTransaction.update({
    where: { id: '2' },
    data: {
      participants: {
        connect: { id: userC.id },
      },
    },
  });

  await prisma.groupTransaction.update({
    where: { id: '3' },
    data: {
      participants: {
        connect: { id: userD.id },
      },
    },
  });

  await prisma.groupTransaction.update({
    where: { id: '4' },
    data: {
      participants: {
        connect: [{ id: testUser.id }, { id: userB.id }, { id: userC.id }],
      },
    },
  });

  for (let i = 0; i < 15; i++) {
    const test = await prisma.groupTransaction.create({
      data: {
        name: faker.lorem.words(2),
        value: faker.datatype.number({ min: 1, max: 5000, precision: 1 }),
        type: TransactionType.TopUp,
        userId: testUser.id,
        groupId: group1.id,
        createdAt: subMinutes(new Date(), 1),
        updatedAt: subMinutes(new Date(), 1),
      },
    });

    await prisma.groupTransaction.update({
      where: { id: test.id },
      data: { participants: { connect: { id: testUser.id } } },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
