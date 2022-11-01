import { IMatchSchedule } from '../../services/interfaces/Match.interfaces';
import {
  IMatchRequest,
  IScore,
} from "../../services/interfaces/Match.interfaces";

const NEW_MATCH: IMatchRequest = {
  homeTeam: 2,
  awayTeam: 1,
  homeTeamGoals: 0,
  awayTeamGoals: 1,
};

const MATCH_TO_SCORE: IScore = {
  homeTeamGoals: 4,
  awayTeamGoals: 6,
};

const MATCH_TO_SCHEDULE: IMatchSchedule = {
  homeTeam: 2,
  awayTeam: 1,
  homeTeamGoals: 4,
  awayTeamGoals: 6,
  inProgress: 'false',
};

const MISSING_FIELDS_NEW_MATCH = {
  homeTeam: 2,
  awayTeam: 1,
  homeTeamGoals: 0,
};

const UNKNOWN_TEAM_NEW_MATCH = {
  homeTeam: 1,
  awayTeam: 999,
  homeTeamGoals: 0,
  awayTeamGoals: 1,
};

const DOUBLED_TEAMS_NEW_MATCH: IMatchRequest = {
    homeTeam: 1,
    awayTeam: 1,
    homeTeamGoals: 0,
    awayTeamGoals: 1,
  };

export {
  NEW_MATCH,
  MATCH_TO_SCORE,
  MATCH_TO_SCHEDULE,
  MISSING_FIELDS_NEW_MATCH,
  UNKNOWN_TEAM_NEW_MATCH,
  DOUBLED_TEAMS_NEW_MATCH,
};
