import chai from 'chai';
import { GraphQLError } from 'graphql';
import supertest from 'supertest';
const expect = chai.expect;

const url = `http://localhost:3000/api/graphql`;
const request = supertest(url);

describe('Authentication Tests', () => {
  // Helper variable for storing the authToken from login/signup
  let token: string;

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

        const data = res.body.data;
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

        const data = res.body.data;
        expect(data.me).equal(null);

        done();
      });
  });

  it('Login', (done) => {
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

        expect(res.body.data.login, 'Response does not contain token').to.have.property('token');
        expect(res.headers, 'Response does not contain set-cookie header').to.have.property(
          'set-cookie',
        );

        token = res.body.data.login.token;

        done();
      });
  });

  it('Returns me object with the users id if logged in', (done) => {
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

        const data = res.body.data;
        expect(data.me).to.have.property('id');

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
          expect(error.message).to.equal('100');
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
              email: "test@budgetify.xyz"
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

        expect(res.body.data.signup).to.have.property('token');

        token = res.body.data.signup.token;

        done();
      });
  });

  after('Cleanup', function (done) {
    request
      .post('')
      .set('Cookie', [`authToken=${token}`])
      .send({
        query: `
          mutation {
            deleteUser {
              id
            }
          }
        `,
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        done();
      });
  });
});
