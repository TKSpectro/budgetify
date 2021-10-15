import chai from 'chai';
import { GraphQLError } from 'graphql';
import supertest from 'supertest';
const expect = chai.expect;

const url = `http://localhost:3000/api/graphql`;
const request = supertest(url);

describe('Authentication Tests', () => {
  it('Returns me object with the users id', (done) => {
    request
      .post('')
      .set('Cookie', [
        'authToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImUzZjgwZGU4LWRmYjctNDliMi05ZmRiLTc0NjU4M2MyZThkMCIsImlhdCI6MTYzNDEzMzU2MywiZXhwIjoxNjM2NzI1NTYzfQ.xlv5x4O4e4Z2iInnxNSXSbNCizZhyCpTLnlgwTNDJeI',
      ])
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

  it('Returns UNAUTHENTICATED if not logged in', (done) => {
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

        res.body.errors.forEach((error: GraphQLError) => {
          expect(error.message).to.equal('80');
        });

        done();
      });
  });

  it('Returns UNAUTHENTICATED if logged in with wrong authToken', (done) => {
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

        res.body.errors.forEach((error: GraphQLError) => {
          expect(error.message).to.equal('80');
        });

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
});
