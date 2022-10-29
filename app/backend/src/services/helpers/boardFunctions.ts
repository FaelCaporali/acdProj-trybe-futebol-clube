import { IScoreBoard } from '../interfaces/Boards.interfaces';
import { IDBMatch } from '../interfaces/Match.interfaces';
import { ITeam } from '../interfaces/Team.interfaces';

export function homePoints(matches: IDBMatch[], team: ITeam): number {
  const finalPoints = matches.reduce((points: number, match: IDBMatch) => {
    if (match.homeTeam === team.id) {
      if (match.awayTeamGoals < match.homeTeamGoals) return points + 3;
      if (match.awayTeamGoals === match.homeTeamGoals) return points + 1;
    }
    return points;
  }, 0);
  return finalPoints;
}

export function homeResults(
  matches: IDBMatch[],
  team: ITeam,
): { victories: number; draws: number; losses: number } {
  const victories = matches.filter(
    (match) =>
      match.homeTeam === team.id && match.homeTeamGoals > match.awayTeamGoals,
  ).length;
  const draws = matches.filter(
    (match) =>
      match.homeTeam === team.id && match.homeTeamGoals === match.awayTeamGoals,
  ).length;
  const losses = matches.filter(
    (match) =>
      match.homeTeam === team.id && match.homeTeamGoals < match.awayTeamGoals,
  ).length;
  return { victories, draws, losses };
}

export function homeGoals(
  matches: IDBMatch[],
  team: ITeam,
): { goalsPro: number; goalsCounter: number } {
  const goalsPro = matches.reduce((finalGoals, match) => {
    if (match.homeTeam === team.id) return finalGoals + match.homeTeamGoals;
    return finalGoals;
  }, 0);
  const goalsCounter = matches.reduce((finalGoals, match) => {
    if (match.homeTeam === team.id) return finalGoals + match.awayTeamGoals;
    return finalGoals;
  }, 0);
  return { goalsPro, goalsCounter };
}

export function sortBoard(results: IScoreBoard[]): IScoreBoard[] {
  return results.sort((team1, team2) => team2.totalPoints - team1.totalPoints)
    .sort((team1, team2) => {
      if (team2.totalPoints === team1.totalPoints) {
        return team2.goalsBalance - team1.goalsBalance;
      }
      return 0;
    })
    .sort((team1, team2) => {
      if (team1.goalsBalance === team2.goalsBalance) {
        return team2.goalsFavor - team1.goalsFavor;
      }
      return 0;
    }).sort((team1, team2) => {
      if (team1.goalsFavor === team2.goalsFavor) {
        return team1.goalsOwn - team2.goalsOwn;
      }
      return 0;
    });
}
