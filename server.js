// Create a basic server with `express`, that:
//  - sends back the `index.html` file on a `GET` to `'/'`
//  - sends back `jsonData` on a `GET` to `'/data'`

import express from 'express';
import path from 'path';

const jsonData = { count: 12, message: 'hey' };

const app = express();

app.get('/', (_, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/data', (_, res) => {
  res.json(jsonData);
});

app.listen(3000, 'localhost', (error) => {
  return error
    ? console.log(error)
    : console.log('Listening at http://localhost:3000');
});
