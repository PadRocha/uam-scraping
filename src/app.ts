import cors from 'cors';
import express, { Request, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
// import moduleName from 'http-delayed-response'


import { config } from './config/config';
import api from './routes/api.routes';

const app = express();

//*------------------------------------------------------------------*/
// * Settings
//*------------------------------------------------------------------*/

app.set('pkg', require('../package.json'));
app.set('trust proxy', true);
app.set('env', config.ENV);
app.set('port', config.PORT);

//*------------------------------------------------------------------*/
// * Middlewares
//*------------------------------------------------------------------*/

if (app.get('env') === 'development') {
  app.use(morgan('dev'));
}
app.use(cors());
app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//*------------------------------------------------------------------*/
// * Routes
//*------------------------------------------------------------------*/

app.get('/', (req: Request, res: Response) => res.json({
  name: app.get('pkg').name,
  version: app.get('pkg').version,
  author: app.get('pkg').author,
  contributors: app.get('pkg').contributors,
  deprecated: app.get('pkg').deprecated,
}));

app.use('/api', api);


/*------------------------------------------------------------------*/

export default app;
