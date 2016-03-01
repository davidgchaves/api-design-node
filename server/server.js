import express from 'express';
import bodyParser from 'body-parser';

const app = express();

app.use(express.static('client'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let lions = [];
let id = 0;

app.get('/lions', (_, res) => {
  res.json(lions);
});

app.get('/lions/:id', (req, res) => {
  const lionId = req.params.id;
  res.json(
    lions.filter((lion) => lion.id === lionId)[0]
  );
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
  const lionId = req.params.id;
  let updatedLion = undefined;

  // In case you try to modify the id
  if (updateData.id) { delete updateData.id; }

  lions = lions.map((lion) => {
    if (lion.id !== lionId) { return lion; }

    updatedLion = { ...lion, ...updateData };
    return updatedLion;
  });

  updatedLion
    ? res.json(updatedLion)
    : res.send();
});

app.delete('/lions/:id', (req, res) => {
  const lionId = req.params.id;
  let deletedLion = undefined;

  lions = lions.map((lion) => {
    if (lion.id !== lionId) { return lion; }

    deletedLion = lion;
    return deletedLion;
  });

  deletedLion
    ? res.json(deletedLion)
    : res.send();
});

app.listen(3000, 'localhost', (error) => {
  return error
    ? console.log(error)
    : console.log('Listening at http://localhost:3000');
});
