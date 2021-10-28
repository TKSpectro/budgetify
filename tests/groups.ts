import { hashSync } from 'bcrypt';
import chai from 'chai';
import supertest from 'supertest';
import { getData, prisma } from './helper';
const expect = chai.expect;
const url = `http://localhost:3000/api/graphql`;
const request = supertest(url);

describe('Group Tests', () => {
  let token = '';

  beforeEach(async function () {
    const hashedPassword = hashSync('12345678', 10);
    const userA = await prisma.user.create({
      data: { firstname: 'A', lastname: '', email: 'a@budgetify.xyz', hashedPassword },
    });

    const userB = await prisma.user.create({
      data: { firstname: 'B', lastname: '', email: 'b@budgetify.xyz', hashedPassword },
    });

    const userC = await prisma.user.create({
      data: { firstname: 'C', lastname: '', email: 'c@budgetify.xyz', hashedPassword },
    });

    const userD = await prisma.user.create({
      data: { firstname: 'D', lastname: '', email: 'd@budgetify.xyz', hashedPassword },
    });

    const userE = await prisma.user.create({
      data: { firstname: 'E', lastname: '', email: 'e@budgetify.xyz', hashedPassword },
    });

    const allUserIds = [
      { id: userA.id },
      { id: userB.id },
      { id: userC.id },
      { id: userD.id },
      { id: userE.id },
    ];

    await prisma.group.create({
      data: {
        name: 'group1',
        value: 4000,
        members: {
          connect: allUserIds,
        },
        owners: { connect: { id: userA.id } },
        transactions: {
          create: [
            {
              name: 'transaction1',
              value: -1000,
              type: 'BUY',
              user: { connect: { id: userA.id } },
              participants: { connect: allUserIds },
            },
            {
              name: 'transaction2',
              value: 2000,
              type: 'TOP_UP',
              user: { connect: { id: userA.id } },
              participants: { connect: { id: userA.id } },
            },
            {
              name: 'transaction3',
              value: 2000,
              type: 'TOP_UP',
              user: { connect: { id: userC.id } },
              participants: { connect: { id: userC.id } },
            },
            {
              name: 'transaction4',
              value: 2000,
              type: 'TOP_UP',
              user: { connect: { id: userD.id } },
              participants: { connect: { id: userD.id } },
            },
            {
              name: 'transaction5',
              value: -1000,
              type: 'BUY',
              user: { connect: { id: userA.id } },
              participants: { connect: [{ id: userA.id }, { id: userB.id }, { id: userC.id }] },
            },
          ],
        },
      },
    });
  });

  it('Money Calculation', (done) => {
    // Login for authorization
    request
      .post('')
      .send({
        query: `
          mutation {
            login(email: "a@budgetify.xyz", password: "12345678") {
              token
            }
          }
        `,
      })
      .expect(200)
      .end(async (err, res) => {
        if (err) return done(err);

        const data = getData(res);
        expect(data.login, 'Response does not contain token').to.have.property('token');
        expect(res.headers, 'Response does not contain set-cookie header').to.have.property(
          'set-cookie',
        );

        token = data.login.token;

        const group = await prisma.group.findFirst({ include: { transactions: true } });

        expect(group, 'Group was not found in the database').to.have.property('id');

        request
          .post('')
          .set('Cookie', [`authToken=${token}`])
          .send({
            query: `
              query groupQuery {
                calculateMemberBalances(id: "${group?.id}") {
                  name
                  userId
                  value
                }
              }
            `,
          })
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);

            const data = getData(res);
            expect(data).to.have.property('calculateMemberBalances');
            const balances = data?.calculateMemberBalances;

            done();
          });
      });
  });
});