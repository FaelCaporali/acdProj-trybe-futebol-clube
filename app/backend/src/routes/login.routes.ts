import { Router } from 'express';
import authCtl from '../shared/auth/controller/index';
import AuthMiddleware from '../shared/auth/middleware';

const auth = Router();
const mid = new AuthMiddleware();

auth.post(
  '/',
  (req, res, next) => mid.logRequest(req, res, next),
  (req, res, next) => authCtl.login(req, res, next),
);

auth.get(
  '/validate',
  (req, res, next) => authCtl.authenticate(req, res, next),
);

export default auth;
