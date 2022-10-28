// @ts-ignore
import chaiHttp = require('chai-http');
import * as sinon from 'sinon';
import * as chai from 'chai';
import { Model } from 'sequelize';

import { app } from '../app';
import Team from '../database/models/Team';
import { before } from 'mocha';

chai.use(chaiHttp);

const { expect } = chai;

describe('/teams services:', () => {
  
  describe('1.1. (get)/teams - good request received:', () => {
  
    const teams = [
        { id: 1, teamName: 'Galo' },
        { id: 2, teamName: 'Vila Nova'},
        { id: 3, teamName: 'Mequinha' },
    ]
    const galo = teams[0]

    before(() => {
      sinon.stub(Model, 'findAll').resolves(teams as Team[]);
      sinon.stub(Model, 'findByPk').resolves(galo as Team);
    })
    after(() => sinon.restore());
  
    it('1.1.1. Should return all teams on route "/teams", with an 200 status', async () => {
      const httpResponse = await chai
        .request(app)
        .get('/teams');

      expect(httpResponse.status).to.equal(200);
      expect(httpResponse.body).to.deep.equal(teams);
    });

    it('1.1.2. Should return the first team in the array with an 200 status', async () => {
      const httpResponse = await chai
        .request(app)
        .get('/teams/1');

      expect(httpResponse.status).to.equal(200);
      expect(httpResponse.body).to.deep.equal(galo);
    });
  });

  describe('1.2. (get)/teams - bad request received', () => {
    before(() => {
      sinon.stub(Model, 'findOne').resolves({} as Team);
    })
    after(() => sinon.restore());
    
    it('1.2.1. Should return an 404 status with an error message if team id is not found', async () => {
      const httpResponse = await chai
        .request(app)
        .get('/teams/999');

      expect(httpResponse.status).to.equal(404);
      expect(httpResponse.body.message).to.deep.equal('No team found');
    });

    // test private route with credentials implementation?

    // it('1.2.2. Should require an non empty valid email string as the email field value', async () => {
    //   const httpResponse = await chai
    //     .request(app)
    //     .post('/login')
    //     .send({ email: 'admin', password: 'secret_admin' });

    //   expect(httpResponse.status).to.equal(401);
    //   expect(httpResponse.body.message).to.deep.equal('Incorrect email or password');
    // });
  })
});
