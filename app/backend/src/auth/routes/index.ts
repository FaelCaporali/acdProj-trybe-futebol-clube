import { Router } from 'express';
import AuthCtl from '../controller';
import AuthService from '../service';
import User from '../../database/models/User';

const auth = Router();
const authCtl = new AuthCtl(new AuthService(User));

auth.post('/', authCtl.login);

export default auth;
