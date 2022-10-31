import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require("chai-http");
import { expect } from 'chai';
import { before } from 'mocha';
import * as sinon from 'sinon';
import { app } from '../app';
import { Model } from 'sequelize';


chai.use(chaiHttp);

describe("Tests for general erros treatments", async () => {
    before(() => {
        sinon.stub(Model, 'findAll').throws(new Error('any error without code provided'));
        sinon.stub(Model, 'findOne').throws(new Error('any error without code provided'));
        sinon.stub(Model, 'findByPk').throws(new Error('any error without code provided'));
        sinon.stub(Model, 'create').throws(new Error('any error without code provided'));
        sinon.stub(Model, 'update').throws(new Error('any error without code provided'));
      });
      after(() => sinon.restore());
    it("Should have a basic error handler, responding to all services to the error message if provided, and the 500 status", async () => {

      const promises: Promise<unknown>[] = PUBLIC_ROUTES.map(async ({method, route}) => await chai.request(app)[method](route));

      const responses = await Promise.all(promises) as Response[];

      responses.forEach((response) => {
        expect(response.status).to.equal(500);
        expect(response.body).to.deep.equal({ message: "any error" });
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

  const PUBLIC_ROUTES: { method: 'get' | 'post' | 'patch', route: string }[] = [
    {
        method: 'post',
        route: '/login',
    },
    {
        method: 'get',
        route: '/login/validate',
    },
    {
        method: 'get',
        route: '/teams',
    },
    {
        method: 'get',
        route: '/teams/1',
    },
    {
        method: 'get',
        route: '/matches',
    },
    {
        method: 'get',
        route: '/matches/1',
    },
    {
        method: 'get',
        route: '/leaderboard',
    },
    {
        method: 'get',
        route: '/leaderboard/home',
    },
    {
        method: 'get',
        route: '/leaderboard/away',
    }
  ];

  const PRIVATE_ROUTES: { method: 'get' | 'post' | 'patch', route: string }[] = [
    {
        method: 'post',
        route: '/matches',
    },
    {
        method: 'patch',
        route: '/matches/1',
    },
    {
        method: 'patch',
        route: '/matches/1/finish',
    }
  ];