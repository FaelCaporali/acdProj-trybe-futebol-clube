import { Router } from 'express';
import AuthCtl from '../controller/index';
import verifyRequest from '../middleware/internalVerification';
import AuthServices from '../service';

const auth = Router();
const authService = new AuthServices();
const authCtl = new AuthCtl(authService);

auth.post(
  '/',
  (req, res, next) => verifyRequest(req, res, next),
  (req, res, next) => authCtl.login(req, res, next),
);

auth.get(
  '/validate',
  (req, res, next) => authCtl.authenticate(req, res, next),
);

export default auth;
