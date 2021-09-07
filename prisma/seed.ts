import { PrismaClient } from '@prisma/client';
import { hashSync } from 'bcrypt';
import { addDays, subDays } from 'date-fns';
import faker from 'faker';

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
        value: 2001,
        categoryId: cat1.id,
        userId: users[0].id,
        householdId: hou1.id,
      },
      {
        name: 'pay2',
        value: 4002,
        categoryId: cat1.id,
        userId: users[0].id,
        householdId: hou1.id,
      },
      {
        name: 'pay3',
        value: 6003,
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
        value: 2500,
        interval: 'WEEKLY',
        categoryId: cat1.id,
        householdId: hou1.id,
        startDate: new Date(subDays(new Date(), 9)),
      },
      {
        name: 'recPay2',
        value: 2500,
        description: 'This recurring payment has a description',
        interval: 'MONTHLY',
        categoryId: cat1.id,
        householdId: hou1.id,
        startDate: new Date(subDays(new Date(), 9)),
        endDate: new Date(addDays(new Date(), 90)),
      },
      {
        name: 'recPay3',
        value: 2500,
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
      value: 4000,
      members: { connect: [{ id: testUser.id }, { id: usr0new.id }, { id: usr1new.id }] },
      transactions: {
        create: [
          { name: 'Top up account.', value: 4000, userId: testUser.id },
          {
            name: 'Buy some stuff for salad',
            value: -1500,
            userId: testUser.id,
          },
        ],
      },
    },
    include: { transactions: true },
  });

  await prisma.groupTransaction.update({
    where: { id: group1.transactions[1].id },
    data: {
      participants: {
        connect: [{ id: testUser.id }, { id: usr0new.id }, { id: usr1new.id }],
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
