import { Router } from 'express';
import AuthCtl from '../controller/index';
import AuthServices from '../service';

const auth = Router();
const authService = new AuthServices();
const authCtl = new AuthCtl(authService);

auth.post('/', (req, res, next) => authCtl.login(req, res, next));

export default auth;
