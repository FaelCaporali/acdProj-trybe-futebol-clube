import { Model } from "sequelize";
// @ts-ignore
import chaiHttp = require("chai-http");
import * as sinon from "sinon";
import * as chai from "chai";
import { afterEach, before } from "mocha";

import { app } from "../app";
import Match from "../database/models/Match";
import User from "../database/models/User";

import { IMatchRequest, IScore } from "./../services/interfaces/Match.interfaces";
import { ITeam } from "./../services/interfaces/Team.interfaces";
import MyNygma from "../shared/myNygma";

const GOOD_CREDENTIALS = {
  email: "admin@admin.com",
  password: "secret_admin",
};

const BAD_CREDENTIALS = {
  email: "admin@admin.com",
  password: "secret_admin",
};

const BAD_TOKEN = { token: "badToken" };

const GOOD_NEW_MATCH_REQUEST: IMatchRequest = {
  homeTeam: 2,
  awayTeam: 1,
  homeTeamGoals: 0,
  awayTeamGoals: 1,
};

const GOOD_PATCH_MATCH_REQUEST: IScore = {
  homeTeamGoals: 4,
  awayTeamGoals: 6,
};

const GOOD_PATCH_MATCH_RESPONSE: unknown = {
  id: 49,
  homeTeam: 2,
  awayTeam: 1,
  homeTeamGoals: 4,
  awayTeamGoals: 6,
  inProgress: true,
};

const DOUBLED_TEAMS_NEW_MATCH_REQUEST: IMatchRequest = {
  homeTeam: 1,
  awayTeam: 1,
  homeTeamGoals: 0,
  awayTeamGoals: 1,
};

const MISSING_FIELDS_MATCH_REQUEST = {
  homeTeam: 2,
  awayTeam: 1,
  homeTeamGoals: 0,
};

const UNKNOWN_TEAM_MATCH_REQUEST = {
  homeTeam: 1,
  awayTeam: 999,
  homeTeamGoals: 0,
  awayTeamGoals: 1,
};

const GOOD_POST_MATCH_RESPONSE: unknown = {
  id: 49,
  homeTeam: 2,
  awayTeam: 1,
  homeTeamGoals: 0,
  awayTeamGoals: 1,
  inProgress: true,
};


const TEAMS: ITeam[] = [
  { id: 8, teamName: "Flamengo" },
  { id: 9, teamName: "Mequinha" },
  { id: 14, teamName: "Vila Nova" },
  { id: 15, teamName: "São José-SP" },
  { id: 16, teamName: "Galo" },
];

const ALL_MATCHES_RESPONSE: unknown[] = [
  {
    id: 1,
    homeTeam: 16,
    homeTeamGoals: 4,
    awayTeam: 8,
    awayTeamGoals: 1,
    inProgress: false,
    teamHome: { teamName: "Galo" },
    teamAway: { teamName: "Flamengo" },
  },
  {
    id: 2,
    homeTeam: 9,
    homeTeamGoals: 1,
    awayTeam: 14,
    awayTeamGoals: 1,
    inProgress: true,
    teamHome: { teamName: "Mequinha" },
    teamAway: { teamName: "Vila Nova" },
  },
];

const PRIVATE_MATCHES_ROUTES: {
  method: "post" | "get" | "patch";
  route: string;
}[] = [
  { method: "post", route: "/matches" },
  { method: "patch", route: "/matches/1/finish" },
  { method: "patch", route: "/matches/1" },
];

const nygmaHelper = new MyNygma('no secret required');

chai.use(chaiHttp);

const { expect } = chai;

describe("/matches services:", () => {
  describe("(get)/matches:", () => {
    before(() => {
      sinon.stub(Match, "findAll").resolves(ALL_MATCHES_RESPONSE as Match[]);
    });
    after(() => sinon.restore());

    it('Should return all matches with teams names joined on route "/matches", with an 200 status', async () => {
      const httpResponse = await chai.request(app).get("/matches");

      expect(httpResponse.status).to.equal(200);
      expect(httpResponse.body).to.deep.equal(ALL_MATCHES_RESPONSE);
    });

    // build 500 error test?
    // it("1.1.2", async () => {
    //   const httpResponse = await chai.request(app).get("/teams/1");

    //   expect(httpResponse.status).to.equal(500);
    // });
  });

  describe("(get)/matches/:id - good request received", () => {
    before(() => {
      sinon.stub(Match, "findOne").resolves(ALL_MATCHES_RESPONSE[0] as Match);
    });
    after(() => sinon.restore());

    it("Should return an 200 status with the right object representing a match, on route /matches/:id", async () => {
      const httpResponse = await chai.request(app).get("/matches/1");

      expect(httpResponse.status).to.equal(200);
      expect(httpResponse.body.message).to.deep.equal(ALL_MATCHES_RESPONSE[0]);
    });
  });

  describe("(get)/matches/:id - invalid id", () => {
    before(() => {
      sinon.stub(Match, "findOne").resolves(undefined);
    });
    after(() => sinon.restore());

    it("Should return an 404 status and any not found message for an invalid id, on route get /matches/:id", async () => {
      const httpResponse = await chai.request(app).get("/matches/980");

      expect(httpResponse.status).to.equal(404);
      expect(httpResponse.body).to.deep.equal({ message: "not found" });
    });
  });

  describe("(get)/matches/query - fine query", () => {
    before(() => {
      const firstResponse = [] as unknown[][];
      sinon.stub(Match, "findAll")
        .onFirstCall().resolves([ALL_MATCHES_RESPONSE[0]] as Match[])
        .onSecondCall().resolves([ALL_MATCHES_RESPONSE[1]] as Match[]);
    });
    after(() => sinon.restore());

    it("Resolves with actives matches", async () => {
      const httpResponse = await chai
        .request(app)
        .get("/matches?inProgress=true");

      expect(httpResponse.status).to.equal(200);
      expect(httpResponse.body).to.deep.equal([ALL_MATCHES_RESPONSE[0]]);
    });

    it("Resolves with inatives matches", async () => {
      const httpResponse = await chai
        .request(app)
        .get("/matches?inProgress=false");

      expect(httpResponse.status).to.equal(200);
      expect(httpResponse.body).to.deep.equal([ALL_MATCHES_RESPONSE[1]]);
    });
  });

  describe("(post)/matches", () => {
    before(() => {
      sinon.stub(Match, "create").resolves(GOOD_POST_MATCH_RESPONSE as Model);
      sinon.stub(User, 'findOne').resolves({ 
        ...GOOD_CREDENTIALS,
        password: nygmaHelper.hashPassword(GOOD_CREDENTIALS.password),
        role: 'admin'
      } as User);
    });
    after(() => sinon.restore());

    it("Should deny registry a match with same team as home and away team ", async () => {
      const {
        body: { token },
      } = await chai.request(app).post("/login").send(GOOD_CREDENTIALS);
      const response = await chai
        .request(app)
        .post("/matches")
        .set("authorization", token)
        .send(DOUBLED_TEAMS_NEW_MATCH_REQUEST);

      expect(response.status).to.equal(422);
      expect(response.body).to.deep.equal({
        message: "It is not possible to create a match with two equal teams",
      });
    });

    it("Should deny registry a match with a team not registered", async () => {
      const {
        body: { token },
      } = await chai.request(app).post("/login").send(GOOD_CREDENTIALS);
      const response = await chai
        .request(app)
        .post("/matches")
        .set("authorization", token)
        .send(UNKNOWN_TEAM_MATCH_REQUEST);

      expect(response.status).to.equal(404);
      expect(response.body).to.deep.equal({
        message: "There is no team with such id!",
      });
    });

    it("Should gracefully post a match with all the above requirements fulfilled", async () => {
      const {
        body: { token },
      } = await chai.request(app).post("/login").send(GOOD_CREDENTIALS);
      const response = await chai
        .request(app)
        .post("/matches")
        .set("authorization", token)
        .send(GOOD_NEW_MATCH_REQUEST);

      expect(response.status).to.equal(201);
      expect(response.body).to.deep.equal(GOOD_POST_MATCH_RESPONSE);
    });
  });

  describe("(patch)/matches/:id", () => {
    before(() => {
      sinon.stub(Match, "update").resolves([1, []]);
      sinon.stub(Match, 'findByPk').resolves(GOOD_POST_MATCH_RESPONSE as Model);
      sinon.stub(User, 'findOne').resolves({ 
        ...GOOD_CREDENTIALS,
        password: nygmaHelper.hashPassword(GOOD_CREDENTIALS.password),
        role: 'admin'
      } as User);
    });
    after(() => sinon.restore());

    it("Gracefully score a goal", async () => {
      const {
        body: { token },
      } = await chai.request(app).post("/login").send(GOOD_CREDENTIALS);
      const response = await chai
        .request(app)
        .patch("/matches/49")
        .set("authorization", token)
        .send(GOOD_PATCH_MATCH_REQUEST);

      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal(GOOD_POST_MATCH_RESPONSE);
    });

    it("Gracefully blows the finish whistle", async () => {
      const {
        body: { token },
      } = await chai.request(app).post("/login").send(GOOD_CREDENTIALS);
      const response = await chai
        .request(app)
        .patch("/matches/49/finish")
        .set("authorization", token);

      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal({ message: 'Finished' });
    });
  });

  describe("Tests for private routes access", async () => {
    it("Should deny access with missing tokens, regardless the others requirements", async () => {

      const promises: Promise<unknown>[] = PRIVATE_MATCHES_ROUTES.map(async ({method, route}) => await chai.request(app)[method](route));

      const responses = await Promise.all(promises) as Response[];

      responses.forEach((response) => {
        expect(response.status).to.equal(400);
        expect(response.body).to.deep.equal({ message: "Must provide credentials" });
      });
    });

    it("Should deny access with bad tokens, regardless the others requirements", async () => {

      const promises: Promise<unknown>[] = PRIVATE_MATCHES_ROUTES.map(async ({method, route}) => await chai.request(app)[method](route).set('authorization', BAD_TOKEN.token));

      const responses = await Promise.all(promises) as Response[];

      responses.forEach((response) => {
        expect(response.status).to.equal(401);
        expect(response.body).to.deep.equal({ message: "Token must be a valid token" });
      });
    });
  });
});
