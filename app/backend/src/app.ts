import * as express from 'express';
import * as cors from 'cors';
import helmet from 'helmet';
import auth from './routes/login.routes';
import httpErrorMiddleware from './shared/error/middleware';
import teams from './routes/teams.routes';
import match from './routes/matches.routes';

class App {
  public app: express.Express;

  constructor() {
    this.app = express();

    this.configApp();
    this.configRoutes();

    // Não remover essa rota
    this.app.get('/', (req, res) => res.json({ ok: true }));
  }

  private configApp():void {
    // const accessControl: express.RequestHandler = (_req, res, next) => {
    //   res.header('Access-Control-Allow-Origin', '*');
    //   res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS,PUT,PATCH');
    //   res.header('Access-Control-Allow-Headers', '*');
    //   next();
    // };

    this.app.use(express.json());

    this.app.use(cors());
    this.app.use(helmet());
    // Para evitar conflitos de headers, a configuração inicial do projeto é mantida abaixo para sobrescrever o cors e helmet;
    // this.app.use(accessControl);
  }

  private configRoutes() {
    this.app.use('/login', auth);
    this.app.use('/teams', teams);
    this.app.use('/matches', match);
    this.app.use(httpErrorMiddleware);
  }

  public start(PORT: string | number):void {
    this.app.listen(PORT, () => console.log(`Running on port ${PORT}`));
  }
}

export { App };

// A execução dos testes de cobertura depende dessa exportação
export const { app } = new App();
