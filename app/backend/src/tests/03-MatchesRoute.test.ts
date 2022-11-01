// EXTERNAL RESOURCES
import { Model } from "sequelize";
// @ts-ignore
import chaiHttp = require("chai-http");
import * as sinon from "sinon";
import * as chai from "chai";
import { before } from "mocha";
// FEATURES TO TEST
import { app } from "../app";
import Team from "../database/models/Team";
import Match from "../database/models/Match";
import User from "../database/models/User";
import auth from "../shared/auth/controller";
import MyNygma from "../shared/myNygma";
// HELPERS, STUBS ETC...
import { IMatch } from "./../services/interfaces/Match.interfaces";
import { middlewareSkipper } from "./utils/functions";
import { ALL_MATCHES, NEW_MATCH_RESPONSE } from "./mocks/responses";
import { GOOD_CREDENTIALS } from "./mocks/Users.mocks";
import {
  MATCH_TO_SCORE,
  NEW_MATCH,
  UNKNOWN_TEAM_NEW_MATCH,
  DOUBLED_TEAMS_NEW_MATCH,
  MATCH_TO_SCHEDULE,
} from "./mocks/matches.requestsBodies";
import { MATCHES_ERRORS } from "./mocks/Errors.mocks";
const nygmaHelper = new MyNygma("no secret required", {
  name: "aes-128-gcm",
  ivBits: 16,
  saltBits: 16,
});
chai.use(chaiHttp);
const { expect } = chai;

describe("/matches services:", () => {
  describe("(get)/matches:", () => {
    before(() => {
      sinon.stub(Match, "findAll").resolves(ALL_MATCHES as Match[]);
    });
    after(() => sinon.restore());

    it('Should return all matches with teams names joined on route "/matches", with an 200 status', async () => {
      const httpResponse = await chai.request(app).get("/matches");

      expect(httpResponse.status).to.equal(200);
      expect(httpResponse.body).to.deep.equal(ALL_MATCHES as IMatch[]);
    });
  });

  describe("(get)/matches/:id - good request received", () => {
    before(() => {
      sinon.stub(Match, "findOne").resolves(ALL_MATCHES[0] as Match);
    });
    after(() => sinon.restore());

    it("Should return an 200 status with the right object representing a match, on route /matches/:id", async () => {
      const httpResponse = await chai.request(app).get("/matches/1");

      expect(httpResponse.status).to.equal(200);
      expect(httpResponse.body).to.deep.equal({ ...ALL_MATCHES[0] });
    });
  });

  describe("(get)/matches/:id - invalid id", () => {
    before(() => {
      sinon.stub(Match, "findOne").resolves(undefined);
    });
    after(() => sinon.restore());

    it("Should return an 404 status and 'Match not found' message for an invalid id, on route get /matches/:id", async () => {
      const httpResponse = await chai.request(app).get("/matches/980");

      expect(httpResponse.status).to.equal(404);
      expect(httpResponse.body).to.deep.equal({ message: "Match not found" });
    });
  });

  describe("(get)/matches/query", () => {
    before(() => {
      sinon
        .stub(Match, "findAll")
        .onFirstCall().resolves([ALL_MATCHES[0]] as Match[])
        .onSecondCall().resolves([ALL_MATCHES[1]] as Match[]);
    });
    after(() => sinon.restore());

    it("Resolves with actives matches", async () => {
      const httpResponse = await chai
        .request(app)
        .get("/matches?inProgress=true");

      expect(httpResponse.status).to.equal(200);
      expect(httpResponse.body).to.deep.equal([ALL_MATCHES[0]]);
    });

    it("Resolves with inatives matches", async () => {
      const httpResponse = await chai
        .request(app)
        .get("/matches?inProgress=false");

      expect(httpResponse.status).to.equal(200);
      expect(httpResponse.body).to.deep.equal([ALL_MATCHES[1]]);
    });
  });

  describe("(post)/matches", () => {
    before(() => {
      sinon.stub(Match, "create").resolves(NEW_MATCH_RESPONSE as Model);
      sinon.stub(Team, "findByPk").resolves(NEW_MATCH_RESPONSE as Team);
      sinon.stub(auth, "middleware").callsFake(middlewareSkipper);
    });
    after(() => sinon.restore());

    it("Should deny request a registry a match with same team as home and away team ", async () => {
      const response = await chai
        .request(app)
        .post("/matches")
        .set("authorization", "stubed")
        .send(DOUBLED_TEAMS_NEW_MATCH);

      expect(response.status).to.equal(422);
      expect(response.body.message).to.equal(MATCHES_ERRORS.messages.doubledTeamError);
    });

    it("Should deny registry a match with a team not registered", async () => {
      const response = await chai
        .request(app)
        .post("/matches")
        .set("authorization", "stubed")
        .send(UNKNOWN_TEAM_NEW_MATCH);

      expect(response.status).to.equal(404);
      expect(response.body.message).to.equal(MATCHES_ERRORS.messages.notFoundTeam);
    });

    it("Should gracefully post a match with all the above requirements fulfilled", async () => {
      const response = await chai
        .request(app)
        .post("/matches")
        .set("authorization", 'stubed')
        .send(NEW_MATCH);

      expect(response.status).to.equal(201);
      expect(response.body).to.deep.equal(NEW_MATCH_RESPONSE);
    });

    it("Should gracefully schedule a match with all the above requirements fulfilled", async () => {
      const response = await chai
        .request(app)
        .post("/matches")
        .set("authorization", 'stubed')
        .send(MATCH_TO_SCHEDULE);

      expect(response.status).to.equal(201);
      expect(response.body).to.deep.equal(NEW_MATCH_RESPONSE);
    });
  });

  describe("(patch)/matches/:id", () => {
    before(() => {
      sinon.stub(Match, "update").resolves([1, []]);
      sinon.stub(Match, "findByPk").resolves(NEW_MATCH_RESPONSE as Model);
      sinon.stub(User, "findOne").resolves({
        ...GOOD_CREDENTIALS,
        password: nygmaHelper.hashPassword(GOOD_CREDENTIALS.password),
        role: "admin",
      } as User);
    });
    after(() => sinon.restore());

    it("Gracefully score a goal, testing token services", async () => {
      const {
        body: { token },
      } = await chai.request(app).post("/login").send(GOOD_CREDENTIALS);
      const response = await chai
        .request(app)
        .patch("/matches/49")
        .set("authorization", token)
        .send(MATCH_TO_SCORE);

      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal(NEW_MATCH_RESPONSE);
    });

    it("Gracefully blows the finish whistle, testing token services", async () => {
      const {
        body: { token },
      } = await chai.request(app).post("/login").send(GOOD_CREDENTIALS);
      const response = await chai
        .request(app)
        .patch("/matches/49/finish")
        .set("authorization", token);

      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal({ message: "Finished" });
    });
  });

  describe("(patch)/matches/:id", () => {
    before(() => {
      sinon
        .stub(Match, "findByPk")
        .onFirstCall()
        .resolves(ALL_MATCHES[1] as Match)
        .onSecondCall()
        .resolves(null);
      sinon.stub(auth, "middleware").callsFake(middlewareSkipper);
    });
    after(() => sinon.restore());

    it("Should not update a match in Progress", async () => {
      const response = await chai
        .request(app)
        .patch("/matches/1")
        .set("authorization", 'stubed')
        .send(MATCH_TO_SCORE);

      expect(response.status).to.equal(422);
      expect(response.body.message).to.equal(
        "Match has already ended or not started yet"
      );
    });

    it("Test for an error finding the match, at the match update", async () => {
      const response = await chai
        .request(app)
        .patch("/matches/1")
        .set("authorization", 'stubed');

      expect(response.status).to.equal(500);
      expect(response.body).to.deep.equal({ message: "Internal server error" });
    });
  });
});
