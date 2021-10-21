import chai from 'chai';
import supertest from 'supertest';
import { cleanDatabase, getData } from './helper';
const expect = chai.expect;

const url = `http://localhost:3000/api/graphql`;
const request = supertest(url);

describe('Other Tests', () => {
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
        console.log(res.body);

        const data = getData(res);
        expect(data.signup).to.have.property('token');

        done();
      });
  });

  before('Cleanup', function (done) {
    cleanDatabase();
    done();
  });
});
