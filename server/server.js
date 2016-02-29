import express from 'express';
import bodyParser from 'body-parser';

const app = express();

app.use(express.static('client'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const lions = [];
let id = 0;

app.listen(3000, 'localhost', (error) => {
  return error
    ? console.log(error)
    : console.log('Listening at http://localhost:3000');
});
