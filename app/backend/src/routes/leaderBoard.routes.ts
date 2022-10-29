import { Router } from 'express';
import BoardCtl from '../controllers/leaderBoard.controller';

const board = Router();
const boardCtl = new BoardCtl();

board.get('/', (req, res, next) => boardCtl.main(req, res, next));
board.get('/home', (req, res, next) => boardCtl.home(req, res, next));
board.get('/away', (req, res, next) => boardCtl.away(req, res, next));

export default board;
