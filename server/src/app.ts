import express from 'express';
import cors from 'cors';
import passport from 'passport';
import {decksRouter} from '@/resources/decks/decks.router';
import {cardRouter} from '@/resources/card/card.router';
import swaggerUI from 'swagger-ui-express';
import path from 'path';
import YAML from 'yamljs';
import { authRouter, authenticate } from './resources/auth/auth.router';
import  {router} from './resources/users/user.router';

const app = express();
const swaggerDocument = YAML.load(path.join(__dirname, '../doc/api.yaml'));

app.use(express.json());
app.use('/doc', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.use(passport.initialize());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Accept,Authorization,Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

app.use(cors({credentials: true, origin: ['http://localhost:8080', 'http://localhost:8081', 'http://localhost:8082']}));
app.options('*', cors());

app.use('/', (req, res, next) => {
  if (req.originalUrl === '/') {
    res.send('Service is running!');
    return;
  }
  next();
});

app.use('/users', authenticate, router);
app.use('/decks', authenticate, decksRouter);
app.use('/cards', authenticate, cardRouter);
app.use('/login', authRouter);
app.use('/logout', authRouter);
app.use('/register', authRouter);
app.use('/refresh-tokens', authRouter);

export default app;