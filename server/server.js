import express from 'express';
import bodyParser from 'body-parser';

const app = express();

app.use(express.static('client'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let lions = [];
let id = 0;

app.param('id', (req, res, next, lionId) => {
  const lion = lions.filter((l) => l.id === lionId)[0];

  if (lion) {
    req.lion = lion;
    next();
  } else {
    res.send();
  }
});

app.get('/lions', (_, res) => {
  res.json(lions);
});

app.get('/lions/:id', (req, res) => {
  res.json(req.lion);
});

app.post('/lions', (req, res) => {
  const assembleNewLion = () => {
    id += 1;
    return { ...req.body, id: id.toString(10) };
  };

  const lion = assembleNewLion();
  lions = [...lions, lion];

  res.json(lion);
});

app.put('/lions/:id', (req, res) => {
  const updateData = req.body;

  // In case you try to modify the id
  if (updateData.id) { delete updateData.id; }

  res.json({ ...req.lion, ...updateData });
});

app.delete('/lions/:id', (req, res) => {
  const lionId = req.params.id;

  lions = lions.filter((lion) => lion.id !== lionId);

  res.json(req.lion);
});

app.use((error, req, res, next) => {
  if (error) { res.status(500).send(error); }
});

app.listen(3000, 'localhost', (error) => {
  return error
    ? console.log(error)
    : console.log('Listening at http://localhost:3000');
});
