import { Router } from 'express';
import MatchCtl from '../controllers/Matches.controller';

const match = Router();
const matchCtl = new MatchCtl();

match.get('/', (req, res, next) => matchCtl.getMatches(req, res, next));

// match.use(authMiddleware); -> nextOn they are private routes

match.post('/', (req, res, next) => matchCtl.newMatch(req, res, next));

export default match;
