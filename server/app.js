import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';

import lionsRouter from './lionsRouter';

const app = express();

app.use(morgan('dev'));
app.use(express.static('client'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/lions', lionsRouter);

app.use((error, req, res, next) => {
  if (error) {
    console.log(error.message);
    res.status(500).send(error);
  }
});

export default app;
