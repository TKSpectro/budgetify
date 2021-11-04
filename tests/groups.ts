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

    // Create some test users
    // We need to statically define the ids here so we get a predictable result if two
    // users are equally rich while calculating their balances. In production this wont
    // be a problem as it then will be basically -1cent randomly placed onto one of the richest
    // persons
    const userA = await prisma.user.create({
      data: { id: '0', firstname: 'A', lastname: 'A', email: 'a@budgetify.xyz', hashedPassword },
    });

    const userB = await prisma.user.create({
      data: { id: '1', firstname: 'B', lastname: 'B', email: 'b@budgetify.xyz', hashedPassword },
    });

    const userC = await prisma.user.create({
      data: { id: '2', firstname: 'C', lastname: 'C', email: 'c@budgetify.xyz', hashedPassword },
    });

    const userD = await prisma.user.create({
      data: { id: '3', firstname: 'D', lastname: 'D', email: 'd@budgetify.xyz', hashedPassword },
    });

    const userE = await prisma.user.create({
      data: { id: '4', firstname: 'E', lastname: 'E', email: 'e@budgetify.xyz', hashedPassword },
    });

    // This array contains all Users and can be used for the prisma -> connect attribute
    const allUserIds = [
      { id: userA.id },
      { id: userB.id },
      { id: userC.id },
      { id: userD.id },
      { id: userE.id },
    ];

    // Create the group with the specified transactions and connections the specific users
    await prisma.group.create({
      data: {
        name: 'group1',
        value: 40,
        members: {
          connect: allUserIds,
        },
        owners: { connect: { id: userA.id } },
        transactions: {
          create: [
            {
              name: 'transaction1',
              value: -10,
              type: 'BUY',
              user: { connect: { id: userA.id } },
              participants: { connect: allUserIds },
            },
            {
              name: 'transaction2',
              value: 20,
              type: 'TOP_UP',
              user: { connect: { id: userA.id } },
              participants: { connect: { id: userA.id } },
            },
            {
              name: 'transaction3',
              value: 20,
              type: 'TOP_UP',
              user: { connect: { id: userC.id } },
              participants: { connect: { id: userC.id } },
            },
            {
              name: 'transaction4',
              value: 10,
              type: 'TOP_UP',
              user: { connect: { id: userD.id } },
              participants: { connect: { id: userD.id } },
            },
            {
              name: 'transaction5',
              value: -10,
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
    // Login for authorization purposes
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

        // Get the predefined group from the database
        const group = await prisma.group.findFirst({ include: { transactions: true } });
        expect(group, 'Group was not found in the database').to.have.property('id');

        // Request the memberBalances calculation against the just found group
        // and authenticated by the before happened login
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

            // These expected values are precalculated to the data written to the database
            // in the beforeEach for this testSuite.
            expect(balances.find((x: any) => x.name == 'A A').value, 'Balance 0 is wrong').to.equal(
              0.14,
            );
            expect(balances.find((x: any) => x.name == 'B B').value, 'Balance 1 is wrong').to.equal(
              -0.05,
            );
            expect(balances.find((x: any) => x.name == 'C C').value, 'Balance 2 is wrong').to.equal(
              0.15,
            );
            expect(balances.find((x: any) => x.name == 'D D').value, 'Balance 3 is wrong').to.equal(
              0.08,
            );
            expect(balances.find((x: any) => x.name == 'E E').value, 'Balance 4 is wrong').to.equal(
              -0.02,
            );

            done();
          });
      });
  });
});
