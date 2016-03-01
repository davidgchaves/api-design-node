import { Router } from 'express';

const lionsRouter = Router();
let lions = [];
let id = 0;

const updateId = () => {
  return (req, res, next) => {
    id += 1;
    req.body.id = id.toString(10);

    next();
  };
};

lionsRouter.param('id', (req, res, next, lionId) => {
  const lion = lions.filter((l) => l.id === lionId)[0];

  if (lion) {
    req.lion = lion;
    next();
  } else {
    next(new Error('lion not found'));
  }
});

lionsRouter.route('/')
  .get((_, res) => {
    res.json(lions);
  })
  .post(updateId(), (req, res) => {
    const lion = req.body;

    lions = [...lions, lion];
    res.json(lion);
  });

lionsRouter.route('/:id')
  .get((req, res) => {
    res.json(req.lion);
  })
  .put((req, res) => {
    const lionId = req.params.id;
    const updateData = req.body;

    // In case you try to modify the id
    if (updateData.id) { delete updateData.id; }

    lions = lions.map((lion) => {
      return lion.id !== lionId
        ? lion
        : { ...req.lion, ...updateData };
    });

    res.json({ ...req.lion, ...updateData });
  })
  .delete((req, res) => {
    const lionId = req.params.id;

    lions = lions.filter((lion) => lion.id !== lionId);

    res.json(req.lion);
  });

export default lionsRouter;
