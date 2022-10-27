import { IMatch } from './../services/interfaces/Match.interfaces';
import { ITeam } from './../services/interfaces/Team.interfaces';
// @ts-ignore
import chaiHttp = require("chai-http");
import * as sinon from "sinon";
import * as chai from "chai";
import { before } from "mocha";

import { app } from "../app";
// import Team from "../database/models/Team";
import Match from "../database/models/Match";
import { IDBMatch } from "../services/interfaces/Match.interfaces";

chai.use(chaiHttp);

const { expect } = chai;

describe("/matches services:", () => {
  describe("1.1. (get)/matches:", () => {
    const matches: IDBMatch[] = [
      {
        id: 1,
        homeTeam: 16,
        homeTeamGoals: 4,
        awayTeam: 8,
        awayTeamGoals: 1,
        inProgress: false,
      },
      {
        id: 2,
        homeTeam: 9,
        homeTeamGoals: 1,
        awayTeam: 14,
        awayTeamGoals: 1,
        inProgress: false,
      },
    ];

    const teams: ITeam[] = [
      { id: 8, teamName: "Flamengo" },
      { id: 9, teamName: "Mequinha" },
      { id: 14, teamName: "Vila Nova" },
      { id: 15, teamName: "São José-SP" },
      { id: 16, teamName: "Galo" },
    ];

    const expected: unknown[] = [
      {
        id: 1,
        homeTeam: 16,
        homeTeamGoals: 4,
        awayTeam: 8,
        awayTeamGoals: 1,
        inProgress: false,
        teamHome: {
          teamName: "Galo",
        },
        teamAway: {
          teamName: "Flamengo",
        },
      },
      {
        id: 2,
        homeTeam: 9,
        homeTeamGoals: 1,
        awayTeam: 14,
        awayTeamGoals: 1,
        inProgress: false,
        teamHome: {
          teamName: "Mequinha",
        },
        teamAway: {
          teamName: "Vila Nova",
        },
      },
    ];

    before(() => {
      sinon.stub(Match, 'findAll').resolves(expected as Match[]);
    })
    after(() => sinon.restore());

    it('1.1.1. Should return all matches with teams names joined on route "/matches", with an 200 status', async () => {
      const httpResponse = await chai.request(app).get("/matches");

      expect(httpResponse.status).to.equal(200);
      expect(httpResponse.body).to.deep.equal(expected);
    });

    // it("1.1.2. Should return the first team in the array with an 200 status", async () => {
    //   const httpResponse = await chai.request(app).get("/teams/1");

    //   expect(httpResponse.status).to.equal(200);
    //   expect(httpResponse.body).to.deep.equal(galo);
    // });
  });

  // describe("1.2. (get)/teams - bad request received", () => {
  //   before(() => {
  //     sinon.stub(Model, "findOne").resolves({} as Team);
  //   });
  //   after(() => sinon.restore());

  //   it("1.2.1. Should return an 404 status with an error message if team is not found", async () => {
  //     const httpResponse = await chai.request(app).get("/teams/999");

  //     expect(httpResponse.status).to.equal(404);
  //     expect(httpResponse.body.message).to.deep.equal("No team found");
  //   });
  // });
});
