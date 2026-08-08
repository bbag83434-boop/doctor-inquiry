import cors from 'cors';
import cookieParser from 'cookie-parser';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { corsOptions } from './config/cors.js';
import { env } from './config/env.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import apiV1Router from './routes/index.js';

const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(cors(corsOptions));
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));
app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

app.use('/api/v1', apiV1Router);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
