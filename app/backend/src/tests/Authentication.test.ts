import { IFullUser, IToken } from './../auth/interfaces/index';
import { Model } from 'sequelize';
import { UserAttributes, UserCreationAttributes } from './../database/models/types/User';
import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import User from '../database/models/User';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

describe('Post /login services:', () => {
  describe('Good request received:', () => {
  
    const user = { id: 1, username: 'admin', email: 'admin@admin.com', password: '$2a$08$xi.Hxk1czAO0nZR..B393u10aED0RQ1N3PAEXQ7HxtLjKPEZBu.PW' }

    before(() => {
      sinon.stub(Model, 'findOne').resolves(user as User);
      // sinon.stub(Model, 'create').resolves(user as User)
    })
    after(() => sinon.restore())
  
    it('1.1 Should return an object with an unique key "token", with a string type value', async () => {
      const httpResponse = await chai
        .request(app)
        .post('/login')
        .send({ email: 'admin@admin.com', password: 'secret_admin' });

      expect(Object.keys(httpResponse.body)).to.deep.equal(['token']);
      expect(typeof httpResponse.body.token).to.equal('string');
    });
    it('1.2 Should return 200 status', async () => {
      const httpResponse = await chai
        .request(app)
        .post('/login')
        .send({ email: 'admin@admin.com', password: 'secret_admin' });

      expect(httpResponse.status).to.equal(200);
    });
  });
});
