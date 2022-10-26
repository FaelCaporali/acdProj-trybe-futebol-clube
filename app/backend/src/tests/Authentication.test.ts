import { Model } from 'sequelize';
import { UserAttributes, UserCreationAttributes } from './../database/models/types/User';
import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import User from '../database/models/User';

import { Response } from 'superagent';
import { IUser } from '../auth/interfaces';

chai.use(chaiHttp);

const { expect } = chai;

describe('Post /login services:', () => {
  describe('Good request received:', () => {
    const user = { id: 1, username: 'Sócrates', email: 'socrates@corintia.com', password: '123456' }
    before(() => {
      sinon.stub(Model, 'findOne').resolves(null)
      // sinon.stub(Model, 'create').resolves(user as User)
    })
    after(() => sinon.restore())
    it('deve retornar um status 200', async () => {
      
      // expect(httpResponse.body).to.have.all.keys(['token']);
      // expect(httpResponse.body).to.deep.equal(userWithoutPass);
    })
    it('1.1 Should return a token', async () => {
      const httpResponse = await chai
        .request(app)
        .post('/login')
        .send({ email: 'socrates@corintcha.com', password: '123456' });

      expect(httpResponse.status).to.equal(200);
    });
    it('1.2 Should return 200 status', async () => {
      const httpResponse = await chai
        .request(app)
        .post('/login')
        .send({ email: 'socrates@corintcha.com', password: '123456' });

      expect(httpResponse.status).to.equal(200);
    });
  })
  /**
   * Exemplo do uso de stubs com tipos
   */

  // let chaiHttpResponse: Response;

  // before(async () => {
  //   sinon
  //     .stub(Example, "findOne")
  //     .resolves({
  //       ...<Seu mock>
  //     } as Example);
  // });

  // after(()=>{
  //   (Example.findOne as sinon.SinonStub).restore();
  // })

  // it('...', async () => {
  //   chaiHttpResponse = await chai
  //      .request(app)
  //      ...

  //   expect(...)
  // });
});
