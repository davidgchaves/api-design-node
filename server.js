// Create a basic server with `express`, that:
//  - sends back the `index.html` file on a `GET` to `'/'`
//  - sends back `jsonData` on a `GET` to `'/data'`

const express = require('express');
const path = require('path');

const jsonData = { count: 12, message: 'hey' };

const app = express();

app.get('/', (_, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/data', (_, res) => {
  res.json(jsonData);
});

app.listen(3000, 'localhost', (error) => {
  error
    ? console.log(error)
    : console.log('Listening at http://localhost:3000');
});
