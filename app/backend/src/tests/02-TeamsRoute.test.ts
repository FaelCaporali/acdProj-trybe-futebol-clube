import { Model } from 'sequelize';
// @ts-ignore
import chaiHttp = require('chai-http');
import * as sinon from 'sinon';
import * as chai from 'chai';
import { app } from '../app';
import Team from '../database/models/Team';
import { before } from 'mocha';

chai.use(chaiHttp);

const { expect } = chai;

describe('/teams services:', () => {
  
  describe('(GET)/teams - good request received:', () => {
  
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
  
    it('- Should return all teams on route "/teams", with an 200 status', async () => {
      const httpResponse = await chai
        .request(app)
        .get('/teams');

      expect(httpResponse.status).to.equal(200);
      expect(httpResponse.body).to.deep.equal(teams);
    });

    it('- Should return the team with the right id on the dataBase with an 200 status', async () => {
      const httpResponse = await chai
        .request(app)
        .get('/teams/1');

      expect(httpResponse.status).to.equal(200);
      expect(httpResponse.body).to.deep.equal(galo);
    });
  });

  describe('(GET)/teams - bad request received', () => {
    before(() => {
      sinon.stub(Team, 'findOne').resolves(null);
    })
    after(() => sinon.restore());
    
    it('- Should return an 404 status with an error message if team id is not found', async () => {
      const httpResponse = await chai
        .request(app)
        .get('/teams/999');

      expect(httpResponse.status).to.equal(404);
      expect(httpResponse.body.message).to.deep.equal('No team found');
    });
  });
});
