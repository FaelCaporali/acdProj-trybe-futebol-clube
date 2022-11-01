import * as chai from "chai";
// @ts-ignore
import chaiHttp = require("chai-http");
import { expect, request } from "chai";
import * as sinon from "sinon";
import { Model } from "sequelize";
import { after, afterEach, before } from "mocha";

import { app } from "../app";
import AuthMiddleware from "../shared/auth/middleware";
import AuthServices from "../shared/auth/service";
import auth from "../shared/auth/controller";
import Match from "../database/models/Match";

import { GENERAL_ERROR, MATCHES_ERRORS } from "./mocks/Errors.mocks";
import { middlewareSkipper } from "./utils/functions";
import { PRIVATE_ROUTES, PUBLIC_ROUTES } from "./utils/assets/appRoutes";
import { ALL_MATCHES } from "./mocks/responses";
import { MATCH_TO_SCORE } from "./mocks/matches.requestsBodies";

chai.use(chaiHttp);

describe("Tests for private routes access errors treatments", async () => {
  it("Should deny access with missing tokens, regardless the others requirements", async () => {
    const promises: Promise<unknown>[] = PRIVATE_ROUTES.map(
      async ({ method, route }) => await chai.request(app)[method](route)
    );

    const responses = (await Promise.all(promises)) as Response[];

    responses.forEach((response) => {
      expect(response.status).to.equal(400);
      expect(response.body).to.deep.equal({
        message: "Must provide credentials",
      });
    });
  });

  it("Should deny access with bad tokens, regardless the others requirements", async () => {
    const promises: Promise<unknown>[] = PRIVATE_ROUTES.map(
      async ({ method, route }) =>
        await chai.request(app)[method](route).set("authorization", "BAD_TOKEN")
    );

    const responses = (await Promise.all(promises)) as Response[];

    responses.forEach((response) => {
      expect(response.status).to.equal(401);
      expect(response.body).to.deep.equal({
        message: "Token must be a valid token",
      });
    });
  });
});

describe("", () => {
  after(() => sinon.restore());
  it("Should have a basic error handler on public and private routes, responding to all services to the error message if provided, and the 500 status", async () => {
    sinon
      .stub(AuthMiddleware.prototype, "logRequest")
      .callsFake(middlewareSkipper);
    sinon.stub(auth, "middleware").callsFake(middlewareSkipper);
    sinon.stub(AuthServices.prototype, "login").throws(GENERAL_ERROR);
    sinon.stub(AuthServices.prototype, "validate").throws(GENERAL_ERROR);
    sinon.stub(Model, "findAll").throws(GENERAL_ERROR);
    sinon.stub(Model, "findOne").throws(GENERAL_ERROR);
    sinon.stub(Model, "findByPk").throws(GENERAL_ERROR);
    sinon.stub(Model, "create").throws(GENERAL_ERROR);
    sinon.stub(Model, "update").throws(GENERAL_ERROR);

    const allRoutes = [...PRIVATE_ROUTES, ...PUBLIC_ROUTES];
    const promises: Promise<unknown>[] = allRoutes.map(
      async ({ method, route }) => await request(app)[method](route)
    );

    const responses = (await Promise.all(promises)) as Response[];

    responses.forEach((response) => {
      expect(response.status).to.equal(500);
      expect(response.body).to.deep.equal({
        message: "Any error without a code",
      });
    });
  });

  it("Test updating errors on such services", async () => {
    sinon.restore();
    const sandbox = sinon.createSandbox();
    sandbox.stub(auth, "middleware").callsFake(middlewareSkipper);
    sandbox.stub(Match, "findByPk").resolves(ALL_MATCHES[45] as Match);
    sandbox.stub(Match, "update").resolves([0, []]);

    const responseToScoreMatch = await chai
      .request(app)
      .patch("/matches/46")
      .set("authorization", "stubed")
      .send(MATCH_TO_SCORE);
    const responseToFinishMatch = await chai
      .request(app)
      .patch("/matches/46/finish")
      .set("authorization", "stubed");

    expect(responseToFinishMatch.status).to.equal(500);
    expect(responseToScoreMatch.status).to.equal(500);
    expect(responseToFinishMatch.body.message).to.equal(
      MATCHES_ERRORS.messages.generalError
    );
    expect(responseToScoreMatch.body.message).to.equal(
      MATCHES_ERRORS.messages.generalError
    );
  });
});
