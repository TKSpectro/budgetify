import chai from 'chai';
import { GraphQLError } from 'graphql';
import supertest from 'supertest';
import { getData, prisma } from './helper';
const expect = chai.expect;

const url = `http://localhost:3000/api/graphql`;
const request = supertest(url);

describe('Authentication Tests', function () {
  it('Returns null if not logged in', (done) => {
    request
      .post('')
      .send({
        query: `
          query me {
            me {
              id
            }
          }
        `,
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        const data = getData(res);
        expect(data.me).equal(null);

        done();
      });
  });

  it('Returns null if logged in with wrong authToken', (done) => {
    request
      .post('')
      .set('Cookie', ['authToken=wrongAuthToken'])
      .send({
        query: `
          query me {
            me {
              id
            }
          }
        `,
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        const data = getData(res);
        expect(data.me).equal(null);

        done();
      });
  });

  it('Login with wrong data', (done) => {
    request
      .post('')
      .send({
        query: `
          mutation {
            login(email: "tom@budgetify.xyz", password: "1234") {
              token
            }
          }
        `,
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        res.body.errors.forEach((error: GraphQLError) => {
          expect(error.message).to.equal('errorEmailOrPasswordWrong');
        });

        done();
      });
  });

  it('Login with missing data', (done) => {
    request
      .post('')
      .send({
        query: `
          mutation {
            login {
              token
            }
          }
        `,
      })
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);

        res.body.errors.forEach((error: GraphQLError) => {
          expect(error.extensions?.code).to.equal('GRAPHQL_VALIDATION_FAILED');
        });

        done();
      });
  });

  it('Signup', (done) => {
    request
      .post('')
      .send({
        query: `
          mutation {
            signup(
              email: "tom@budgetify.xyz"
              password: "12345678"
              firstname: "test"
              lastname: "budgetify"
            ) {
              token
            }
          }`,
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        const data = getData(res);
        expect(data.signup).to.have.property('token');

        done();
      });
  });

  it('Login', (done) => {
    request
      .post('')
      .send({
        query: `
          mutation {
            signup(
              email: "tom@budgetify.xyz"
              password: "12345678"
              firstname: "test"
              lastname: "budgetify"
            ) {
              token
            }
          }`,
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        request
          .post('')
          .send({
            query: `
          mutation {
            login(email: "tom@budgetify.xyz", password: "12345678") {
              token
            }
          }
        `,
          })
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);

            const data = getData(res);
            expect(data.login, 'Response does not contain token').to.have.property('token');
            expect(res.headers, 'Response does not contain set-cookie header').to.have.property(
              'set-cookie',
            );

            done();
          });
      });
  });

  it('Returns me object with the users id if logged in', (done) => {
    request
      .post('')
      .send({
        query: `
          mutation {
            signup(
              email: "tom@budgetify.xyz"
              password: "12345678"
              firstname: "test"
              lastname: "budgetify"
            ) {
              token
            }
          }`,
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        request
          .post('')
          .send({
            query: `
          mutation {
            login(email: "tom@budgetify.xyz", password: "12345678") {
              token
            }
          }
        `,
          })
          .end((err, res) => {
            if (err) return done(err);

            const token = res.body.data.login.token;

            request
              .post('')
              .set('Cookie', [`authToken=${token}`])
              .send({
                query: `
          query me {
            me {
              id
            }
          }
        `,
              })
              .expect(200)
              .end((err, res) => {
                if (err) return done(err);

                const data = getData(res);
                expect(data.me).to.have.property('id');

                done();
              });
          });
      });
  });

  it('OTP requesting', async function () {
    const user = await prisma.user.create({
      data: {
        email: 'test@budgetify.xyz',
        firstname: 'test',
        lastname: 'test',
        hashedPassword: 'test',
      },
    });

    const requestResetRes = await request.post('').send({
      query: `
          mutation {
            requestPasswordReset(
              email: "${user.email}"
            )
          }`,
    });

    expect(getData(requestResetRes)).to.have.property('requestPasswordReset');

    const resetUser = await prisma.user.findFirst({ where: { email: user.email } });

    expect(resetUser?.otp).to.be.string;

    const loginWithOtpRes = await request.post('').send({
      query: `
          mutation {
            login(
              email: "${user.email}"
              password: "${resetUser?.otp}"
              isOTP: true
            ){
              token
            }
          }`,
    });

    expect(getData(loginWithOtpRes).login.token).to.be.string;
  });
});
