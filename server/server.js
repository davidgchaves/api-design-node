import express from 'express';
import bodyParser from 'body-parser';

import lionsRouter from './lionsRouter';

const app = express();

app.use(express.static('client'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/lions', lionsRouter);

app.use((error, req, res, next) => {
  if (error) { res.status(500).send(error); }
});

app.listen(3000, 'localhost', (error) => {
  return error
    ? console.log(error)
    : console.log('Listening at http://localhost:3000');
});
