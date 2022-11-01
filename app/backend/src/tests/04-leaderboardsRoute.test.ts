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

describe("Nas Rotas /leaderboards", () => {
  beforeEach(() => {
    sinon.stub(Match, "findAll").resolves(ALL_MATCHES as Match[]);
    sinon.stub(Team, "findAll").resolves(ALL_TEAMS as Team[]);
  });
  afterEach(() => {
    sinon.restore();
  });
  it("/home -> tendo os dados do banco fornecidos como na DB inicial, testa o resultado da classificação", async () => {
    const response = await chai.request(app).get("/leaderboard/home");
    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal(HOME_TEAMS_SCORES);
  });
  it("/away -> tendo os dados do banco fornecidos como na DB inicial, testa o resultado da classificação", async () => {
    const response = await chai.request(app).get("/leaderboard/away");
    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal(AWAY_TEAM_SCORES);
  });
});
it("/ -> tendo os dados do banco fornecidos como na DB inicial, testa o resultado da classificação", async () => {
  const response = await chai.request(app).get("/leaderboard");
  expect(response.status).to.equal(200);
  expect(response.body).to.deep.equal(FULL_SCORE);
});
