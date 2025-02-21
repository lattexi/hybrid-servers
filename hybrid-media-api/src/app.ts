import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';

import {notFound, errorHandler} from './middlewares';
import api from './api';

const app = express();

app.use(morgan('dev'));
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: false, // käytetään vain alla olevia asetuksia
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-eval'"],
      connectSrc: ['*'],
      imgSrc: ["'self'", '*'],
    },
  }),
);
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '..', 'public')));

// serve public folder for apidoc
app.use('/app', express.static(path.join(__dirname, '..', 'app')));

// Kaikki muut /app/*-reitit ohjataan index.html:lle
app.get('/app/*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'app', 'index.html'));
});

app.use('/api/v1', api);

app.use(notFound);
app.use(errorHandler);

export default app;
