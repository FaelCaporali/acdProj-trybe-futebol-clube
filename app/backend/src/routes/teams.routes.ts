import { Router } from 'express';
import TeamsCtl from '../controllers/teams.controller';
import TeamServices from '../services/Team.services';

const teams = Router();
const teamServices = new TeamServices();
const teamCtl = new TeamsCtl(teamServices);

teams.get('/', (req, res, next) => teamCtl.getAll(req, res, next));

teams.get('/:id', (req, res, next) => teamCtl.findById(req, res, next));

export default teams;
