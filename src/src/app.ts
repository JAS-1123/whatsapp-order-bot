import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import { routes } from './routes';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';
import { requestLogger } from './middleware/requestLogger';

const app = express();

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());

app.use(requestLogger);

app.use('/', routes);

app.use(notFound);
app.use(errorHandler);

export { app };
