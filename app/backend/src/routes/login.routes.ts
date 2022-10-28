import { Router } from 'express';
import authCtl from '../shared/auth/controller/index';
import verifyRequest from '../shared/auth/middleware/internalVerification';

const auth = Router();

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
