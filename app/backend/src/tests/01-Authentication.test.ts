// @ts-ignore
import chaiHttp = require('chai-http');
import * as sinon from 'sinon';
import * as chai from 'chai';
import { Model } from 'sequelize';
import { before } from 'mocha';

import { app } from '../app';
import User from '../database/models/User';

import {
FAKE_USER,
GOOD_CREDENTIALS,
MISSING_EMAIL_CREDENTIALS,
INVALID_EMAIL_USER,
MISSING_PASSWORD_USER,
INVALID_MIN_LENGTH_PASSWORD,
NON_REGISTERED_USER,
BAD_CREDENTIALS,
} from './mocks/Users.mocks';
import { GOOD_TOKEN, USER } from './mocks/responses';
import { AUTH_ERRORS } from './mocks/Errors.mocks';
import { request } from 'chai';

chai.use(chaiHttp);

const { expect } = chai;

describe('TESTS FOR /login ROUTES', () => {
  
  describe('(POST)/login - for a good request received:', async () => {
  
    sinon.stub(Model, 'findOne').resolves(USER as User);

    
    const httpResponse = await chai
        .request(app)
        .post('/login')
        .send(GOOD_CREDENTIALS);
  
    it('Should return 200 status on the response', () => {
      expect(httpResponse.status).to.equal(200);
    });
    it('Should have a key named "token" on the response body', () => {
      expect(Object.keys(httpResponse.body)).to.deep.equal(['token'])
    });
    it('Should have a string valued token on the response body', () => {
      expect(typeof httpResponse.body.token).to.equal('string')
    });
    sinon.restore();
  });

  describe('(POST)/login - bad request received', () => {
    
    describe('For invalid or missing fields', () => {
      const modelSpy = sinon.spy(Model.findOne);
      
      it(`Should require an email field on the request body. If not found:
      - Should return an 400 status;
      - should return the right error message;
      - Should not try to access the DataBase`, async () => {
        const httpResponse = await chai
          .request(app)
          .post('/login')
          .send(MISSING_EMAIL_CREDENTIALS);
  
        expect(httpResponse.status).to.equal(400);
        expect(httpResponse.body.message).to.deep.equal(AUTH_ERRORS.messages.missingField);
        expect(modelSpy.called).to.equal(false);
      });

      it(`Should require an non empty valid email string as the email field value. If not provided:
      - Should return an 401 status;
      - Should return the right error message;
      - Should not try to access the DataBase`, async () => {
        const httpResponse = await chai
          .request(app)
          .post('/login')
          .send(INVALID_EMAIL_USER);
  
        expect(httpResponse.status).to.equal(401);
        expect(httpResponse.body.message).to.deep.equal(AUTH_ERRORS.messages.invalidField);
        expect(modelSpy.called).to.equal(false);
      });

      it(`Should require password field on the request body, if not provided:
      - Should return an 400 status.
      - Should return the right error message.
      - Should not try to access the DataBase`, async () => {
        const httpResponse = await chai
          .request(app)
          .post('/login')
          .send(MISSING_PASSWORD_USER);
  
        expect(httpResponse.status).to.equal(400);
        expect(httpResponse.body.message).to.deep.equal(AUTH_ERRORS.messages.missingField);
        expect(modelSpy.called).to.equal(false);
      });
  
      it(`Should require an 6 characters minimum length string as the password field value, if not provided:
      - Should return an 401 status;
      - Should return the right error message;
      - Should not try to access the DataBase`, async () => {
        const httpResponse = await chai
          .request(app)
          .post('/login')
          .send(INVALID_MIN_LENGTH_PASSWORD);
  
        expect(httpResponse.status).to.equal(401);
        expect(httpResponse.body.message).to.deep.equal(AUTH_ERRORS.messages.invalidField);
        expect(modelSpy.called).to.equal(false);
      });

      it('Confirms that non of the above tests has called the DataBase for an User roll', () => {
        expect(modelSpy.callCount).to.equal(0);
      });
      sinon.restore();
    });

    describe('For bad credentials', () => {
      before(() => {
        sinon.stub(Model, 'findOne').resolves(USER as User);
      })
      after(() => sinon.restore());

      it(`For an unregistered user:
      - Should return an 401 status;
      - Should return the right message on the response body;`, async () => {
        const httpResponse = await chai
          .request(app)
          .post('/login')
          .send(NON_REGISTERED_USER);
  
        expect(httpResponse.status).to.equal(401);
        expect(httpResponse.body.message).to.deep.equal(AUTH_ERRORS.messages.invalidField);
      });
  
      it('Should deny access if the hashed password provided doesn\'t match to the password on the DataBase, returning an 401 status.', async () => {
        const httpResponse = await chai
          .request(app)
          .post('/login')
          .send(BAD_CREDENTIALS);
  
        expect(httpResponse.status).to.equal(401);
        expect(httpResponse.body.message).to.deep.equal(AUTH_ERRORS.messages.invalidField);
      });
    });
  });

  describe('(POST)/login/register', () => {
    before(() => {
      sinon.stub(User, 'create').resolves(USER as User);
      sinon.stub(User, 'findOne').resolves(USER  as User);
      sinon.stub(User, 'findByPk').resolves(USER as User);
    })
    after(() => sinon.restore());

    it('Should gracefully register an user, responding with a log token and a 201 status', async () => {
      const httpResponse = await request(app).post('/login/register').send(FAKE_USER);

      expect(httpResponse.status).to.equal(201);
      expect(Object.keys(httpResponse.body)).to.deep.equal(['token']);
      expect(typeof httpResponse.body.token).to.deep.equal('string');
    });
  });

  describe('(GET) /login/validate services', () => {
    before(() => {
      sinon.stub(Model, 'findOne').resolves(USER as User);
      sinon.stub(Model, 'findByPk').resolves(USER as User);
    });
    after(() => sinon.restore());


    it('Should return the right user role if a valid token is provided on header "authorization" field', async () => {
      const { body: { token } } = await chai
        .request(app)
        .post('/login')
        .send(GOOD_CREDENTIALS);
      const httpResponse = await chai.request(app).get('/login/validate').set('authorization', token);
      expect(httpResponse.body).to.deep.equal({ role: FAKE_USER.role });
    });

    it('Should return a status 401 and "Token must be a valid token" as a message value in body response, if token is invalid',
    async () => {
      const httpResponse = await chai.request(app).get('/login/validate').set('authorization', 'non-valid-token');
      expect(httpResponse.status).to.equal(401);
      expect(httpResponse.body.message).to.equal(AUTH_ERRORS.messages.invalidToken);
    });

    it('Should return a status 400 and "Must provide credentials" as a message value, in body response, if token is not provided. \n It should not try to access the DataBase',
    async () => {
      sinon.restore();
      const testSpy = sinon.spy(Model, 'findOne');
      const httpResponse = await chai.request(app).get('/login/validate');

      expect(httpResponse.status).to.equal(400);
      expect(httpResponse.body.message).to.equal(AUTH_ERRORS.messages.missingToken);
      expect(testSpy.called).to.equal(false);
    });
  })
});
