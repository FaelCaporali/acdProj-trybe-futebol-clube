import { Router } from 'express';
import MatchCtl from '../controllers/Matches.controller';

const match = Router();
const matchCtl = new MatchCtl();

match.get('/', (req, res, next) => matchCtl.matches(req, res, next));

// match.use(authMiddleware); -> nextOn they are private routes

export default match;
