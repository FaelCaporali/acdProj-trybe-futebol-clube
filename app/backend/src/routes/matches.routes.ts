import { Router } from 'express';
import MatchCtl from '../controllers/Matches.controller';
import auth from '../shared/auth/controller';

const match = Router();
const matchCtl = new MatchCtl();

match.get('/', (req, res, next) => matchCtl.getMatches(req, res, next));

match.use((rq, rs, nxt) => auth.middleware(rq, rs, nxt));

match.post('/', (req, res, next) => matchCtl.newMatch(req, res, next));
match.patch('/:id', (req, res, next) => matchCtl.scoreGoal(req, res, next));
match.patch('/:id/finish', (req, res, next) => matchCtl.finishMatch(req, res, next));

export default match;
