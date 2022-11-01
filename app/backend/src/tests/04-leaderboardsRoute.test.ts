import Match from "../database/models/Match";
import Team from "../database/models/Team";
// @ts-ignore
import chaiHttp = require("chai-http");
import * as chai from "chai";
import * as sinon from "sinon";
import { app } from "../app";
import { beforeEach } from "mocha";
const { expect } = chai;
import { ALL_MATCHES, ALL_TEAMS } from "./mocks/responses";
import {
  HOME_TEAMS_SCORES, AWAY_TEAM_SCORES, FULL_SCORE
} from './mocks/leaderboars.mocks';

chai.use(chaiHttp);

describe("(GET)/leaderboards", () => {
  beforeEach(() => {
    sinon.stub(Match, "findAll").resolves(ALL_MATCHES as Match[]);
    sinon.stub(Team, "findAll").resolves(ALL_TEAMS as Team[]);
  });
  afterEach(() => {
    sinon.restore();
  });
  it("/leaderboard/home -> should return the right classification for data for home games", async () => {
    const response = await chai.request(app).get("/leaderboard/home");
    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal(HOME_TEAMS_SCORES);
  });
  it("/leaderboard/away -> should return the right classification for data for away games", async () => {
    const response = await chai.request(app).get("/leaderboard/away");
    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal(AWAY_TEAM_SCORES);
  });
  it("/leaderboard -> should return the right classification for data for all games", async () => {
    const response = await chai.request(app).get("/leaderboard");
    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal(FULL_SCORE);
  });
});
