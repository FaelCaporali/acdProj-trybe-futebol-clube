import { IScoreBoard } from '../interfaces/Boards.interfaces';
import { IDBMatch } from '../interfaces/Match.interfaces';
import { ITeam } from '../interfaces/Team.interfaces';

function getPoints(type: 'homeTeam' | 'awayTeam', matches: IDBMatch[], team: ITeam): number {
  const goals = type === 'homeTeam' ? 'homeTeamGoals' : 'awayTeamGoals';
  const sufferedGoals = type === 'homeTeam' ? 'awayTeamGoals' : 'homeTeamGoals';
  const finalPoints = matches.reduce((points: number, match: IDBMatch) => {
    if (match[type] === team.id) {
      if (match[goals] > match[sufferedGoals]) return points + 3;
      if (match[goals] === match[sufferedGoals]) return points + 1;
    }
    return points;
  }, 0);
  return finalPoints;
}

function getResults(
  type: 'homeTeam' | 'awayTeam',
  matches: IDBMatch[],
  team: ITeam,
): { victories: number; draws: number; losses: number } {
  const goals = type === 'homeTeam' ? 'homeTeamGoals' : 'awayTeamGoals';
  const sufferedGoals = type === 'homeTeam' ? 'awayTeamGoals' : 'homeTeamGoals';
  const victories = matches.filter(
    (match) => match[type] === team.id && match[sufferedGoals] < match[goals],
  ).length;
  const draws = matches.filter(
    (match) => match[type] === team.id && match[sufferedGoals] === match[goals],
  ).length;
  const losses = matches.filter(
    (match) => match[type] === team.id && match[sufferedGoals] > match[goals],
  ).length;
  return { victories, draws, losses };
}

function getGoals(
  type: 'homeTeam' | 'awayTeam',
  matches: IDBMatch[],
  team: ITeam,
): { goalsPro: number; goalsCounter: number } {
  const goals = type === 'homeTeam' ? 'homeTeamGoals' : 'awayTeamGoals';
  const sufferedGoals = type === 'homeTeam' ? 'awayTeamGoals' : 'homeTeamGoals';
  const goalsPro = matches.reduce((finalGoals, match) => {
    if (match[type] === team.id) return finalGoals + match[goals];
    return finalGoals;
  }, 0);
  const goalsCounter = matches.reduce((finalGoals, match) => {
    if (match[type] === team.id) return finalGoals + match[sufferedGoals];
    return finalGoals;
  }, 0);
  return { goalsPro, goalsCounter };
}

function board(type: 'homeTeam' | 'awayTeam', matches: IDBMatch[], teams: ITeam[]): IScoreBoard[] {
  return teams.reduce((final: IScoreBoard[], team) => {
    const { victories, draws, losses } = getResults(type, matches, team);
    const { goalsPro, goalsCounter } = getGoals(type, matches, team);
    const modified: IScoreBoard = {
      name: team.teamName,
      totalPoints: getPoints(type, matches, team),
      totalGames: matches.filter((match) => match[type] === team.id).length,
      totalVictories: victories,
      totalDraws: draws,
      totalLosses: losses,
      goalsFavor: goalsPro,
      goalsOwn: goalsCounter,
      goalsBalance: goalsPro - goalsCounter,
      efficiency: '',
    };
    modified.efficiency = ((modified.totalPoints / (modified.totalGames * 3)) * 100).toFixed(2);
    return [...final, modified];
  }, []);
}

function fullBoard(home: IScoreBoard[], away: IScoreBoard[]) {
  return home.reduce((finalBoard: IScoreBoard[], homeBoard) => {
    const resultsAway = away.find((team) => team.name === homeBoard.name) as IScoreBoard;
    const fullR: IScoreBoard = {
      name: homeBoard.name,
      totalPoints: homeBoard.totalPoints + resultsAway.totalPoints,
      totalGames: homeBoard.totalGames + resultsAway.totalGames,
      totalVictories: homeBoard.totalVictories + resultsAway.totalVictories,
      totalDraws: homeBoard.totalDraws + resultsAway.totalDraws,
      totalLosses: homeBoard.totalLosses + resultsAway.totalLosses,
      goalsFavor: homeBoard.goalsFavor + resultsAway.goalsFavor,
      goalsOwn: homeBoard.goalsOwn + resultsAway.goalsOwn,
      goalsBalance: 0,
      efficiency: '',
    };
    fullR.goalsBalance = fullR.goalsFavor - fullR.goalsOwn;
    fullR.efficiency = ((fullR.totalPoints / (fullR.totalGames * 3)) * 100).toFixed(2);
    return [...finalBoard, fullR];
  }, []);
}

function sortBoard(results: IScoreBoard[]): IScoreBoard[] {
  return results
    .sort((team1, team2) => team2.totalPoints - team1.totalPoints).sort((team1, team2) => {
      if (team2.totalPoints === team1.totalPoints) return team2.goalsBalance - team1.goalsBalance;
      return 0;
    }).sort((team1, team2) => {
      if (
        team2.totalPoints === team1.totalPoints
        && team1.goalsBalance === team2.goalsBalance
      ) return team2.goalsFavor - team1.goalsFavor;
      return 0;
    }).sort((team1, team2) => {
      if (
        team2.totalPoints === team1.totalPoints
        && team1.goalsBalance === team2.goalsBalance
        && team1.goalsFavor === team2.goalsFavor
      ) return team1.goalsOwn - team2.goalsOwn;
      return 0;
    });
}

export { board, fullBoard, sortBoard, getGoals, getPoints, getResults };
