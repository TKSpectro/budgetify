const chai = require('chai');
const should = chai.should();

const url = `http://localhost:3000/api/graphql`;
const request = require('supertest')(url);

describe('GraphQL', () => {
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

        data.me.should.have.property('id');
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
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);

        res.body.errors.forEach((error) => {
          error.extensions.code.should.equal('UNAUTHENTICATED');
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
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);

        res.body.errors.forEach((error) => {
          error.extensions.code.should.equal('UNAUTHENTICATED');
        });

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
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);

        res.body.errors.forEach((error) => {
          error.extensions.code.should.equal('UNAUTHENTICATED');
        });

        done();
      });
  });
});
