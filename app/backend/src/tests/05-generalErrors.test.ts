import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require("chai-http");
import { expect, request } from 'chai';
import { before } from 'mocha';
import * as sinon from 'sinon';
import { Model } from 'sequelize';

import { app } from '../app';
import AuthMiddleware from '../shared/auth/middleware';
import AuthServices from '../shared/auth/service';

import { GENERAL_ERROR } from './mocks/Errors.mocks';
import { middlewareSkipper } from './utils/functions';
import { PRIVATE_ROUTES, PUBLIC_ROUTES } from './utils/assets/appRoutes';


chai.use(chaiHttp);

describe("Tests for general erros treatments on controllers", async () => {
    before(() => {
      sinon.stub(AuthMiddleware.prototype, 'logRequest').callsFake(middlewareSkipper);
      sinon.stub(AuthServices.prototype, 'login').throws(GENERAL_ERROR);
      sinon.stub(AuthServices.prototype, 'validate').throws(GENERAL_ERROR);
      sinon.stub(Model, 'findAll').throws(GENERAL_ERROR);
      sinon.stub(Model, 'findOne').throws(GENERAL_ERROR);
      sinon.stub(Model, 'findByPk').throws(GENERAL_ERROR);
      sinon.stub(Model, 'create').throws(GENERAL_ERROR);
      sinon.stub(Model, 'update').throws(GENERAL_ERROR);
    });
    after(() => sinon.restore());
    it("Should have a basic error handler, responding to all services to the error message if provided, and the 500 status", async () => {

      const promises: Promise<unknown>[] = PUBLIC_ROUTES.map(async ({method, route}) => await request(app)[method](route));

      const responses = await Promise.all(promises) as Response[];

      responses.forEach((response) => {
        expect(response.status).to.equal(500);
        expect(response.body).to.deep.equal({ message: "Any error without a code" });
      });
    });
  });

  describe("Tests for private routes access errors treatments", async () => {
    it("Should deny access with missing tokens, regardless the others requirements", async () => {

      const promises: Promise<unknown>[] = PRIVATE_ROUTES.map(async ({method, route}) => await chai.request(app)[method](route));

      const responses = await Promise.all(promises) as Response[];

      responses.forEach((response) => {
        expect(response.status).to.equal(400);
        expect(response.body).to.deep.equal({ message: "Must provide credentials" });
      });
    });

    it("Should deny access with bad tokens, regardless the others requirements", async () => {

      const promises: Promise<unknown>[] = PRIVATE_ROUTES.map(async ({method, route}) => await chai.request(app)[method](route).set('authorization', 'BAD_TOKEN'));

      const responses = await Promise.all(promises) as Response[];

      responses.forEach((response) => {
        expect(response.status).to.equal(401);
        expect(response.body).to.deep.equal({ message: "Token must be a valid token" });
      });
    });
  });
