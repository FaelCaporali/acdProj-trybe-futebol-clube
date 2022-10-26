// @ts-ignore
import chaiHttp = require('chai-http');
import * as sinon from 'sinon';
import * as chai from 'chai';
import { Model } from 'sequelize';

import { app } from '../app';
import User from '../database/models/User';

import { IRole } from '../auth/interfaces';

chai.use(chaiHttp);

const { expect } = chai;

describe('/login services:', () => {
  describe('1.1. (POST)/login - good request received:', () => {
  
    const user = { id: 1, username: 'admin', email: 'admin@admin.com', password: '$2a$08$xi.Hxk1czAO0nZR..B393u10aED0RQ1N3PAEXQ7HxtLjKPEZBu.PW' }

    before(() => {
      sinon.stub(Model, 'findOne').resolves(user as User);
    })
    after(() => sinon.restore());
  
    it('1.1.1. Should return 200 status on the response', async () => {
      const httpResponse = await chai
        .request(app)
        .post('/login')
        .send({ email: 'admin@admin.com', password: 'secret_admin' });

      expect(httpResponse.status).to.equal(200);
    });

    it('1.1.2. Should return an object with a single key named "token" and a string typed value on the response body', async () => {
      const httpResponse = await chai
        .request(app)
        .post('/login')
        .send({ email: 'admin@admin.com', password: 'secret_admin' });

      expect(Object.keys(httpResponse.body)).to.deep.equal(['token']);
      expect(typeof httpResponse.body.token).to.equal('string');
    });
  });

  describe('1.2. (POST)/login - bad request received', () => {

    const user = { id: 1, username: 'admin', email: 'admin@admin.com', password: '$2a$08$xi.Hxk1czAO0nZR..B393u10aED0RQ1N3PAEXQ7HxtLjKPEZBu.PW' }

    before(() => {
      sinon.stub(Model, 'findOne').resolves(user as User);
    })
    after(() => sinon.restore());
    
    it('1.2.1. Should require an email field on the request body', async () => {
      const httpResponse = await chai
        .request(app)
        .post('/login')
        .send({ password: 'secret_admin' });

      expect(httpResponse.status).to.equal(400);
      expect(httpResponse.body.message).to.deep.equal('All fields must be filled');
    });

    it('1.2.2. Should require an non empty valid email string as the email field value', async () => {
      const httpResponse = await chai
        .request(app)
        .post('/login')
        .send({ email: 'admin', password: 'secret_admin' });

      expect(httpResponse.status).to.equal(400);
      expect(httpResponse.body.message).to.deep.equal('All fields must be filled');
    });

    it('1.2.3. Should require password field on the request body', async () => {
      const httpResponse = await chai
        .request(app)
        .post('/login')
        .send({ email: 'admion@admin.com' });

      expect(httpResponse.status).to.equal(400);
      expect(httpResponse.body.message).to.deep.equal('All fields must be filled');
    });

    it('1.2.4. Should require an 6 characters minimum length string as the password field value', async () => {
      const httpResponse = await chai
        .request(app)
        .post('/login')
        .send({ email: 'admin@admin.com', password: 'asd' });

      expect(httpResponse.status).to.equal(400);
      expect(httpResponse.body.message).to.deep.equal('All fields must be filled');
    });
  });

  describe('1.3. (GET) /login/validate services - ', () => {
    const user = { id: 1, username: 'admin', email: 'admin@admin.com', password: '$2a$08$xi.Hxk1czAO0nZR..B393u10aED0RQ1N3PAEXQ7HxtLjKPEZBu.PW', role: 'admin' };
    before(() => {
      sinon.stub(Model, 'findOne').resolves(user as User);
    })
    after(() => sinon.restore())

    it('1.3.1. Should return the right user role if a valid token is provided on header "authorization" field', async () => {
      const { body: { token } } = await chai
        .request(app)
        .post('/login')
        .send({ email: 'admin@admin.com', password: 'secret_admin' });
      const httpResponse = await chai.request(app).get('/login/validate').set('authorization', token);
      expect(httpResponse.body).to.deep.equal({ role: user.role });
      expect(httpResponse.body.role).to.equal('admin');
    });

    it('1.3.2. Should return a status 404 and "Invalid token" as a message value, in body response, if token is invalid or not provided',
    // set a optional body key in user -> {"expires":"time"} for test purposes only to validate expired token response?
    // or stub myNygma?
    async () => {
      const httpResponse = await chai.request(app).get('/login/validate').set('authorization', 'non-valid-token');
      expect(httpResponse.status).to.equal(404);
      expect(httpResponse.body.message).to.equal("Invalid token");
    });
  })
});
