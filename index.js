import app from './server/app';

app.listen(3000, 'localhost', (error) => {
  return error
    ? console.log(error)
    : console.log('Listening at http://localhost:3000');
});
