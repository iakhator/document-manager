import app from './server/config/express';

app.listen(3000, () => {
  console.log('API Server started and listening on port 3000');
});
