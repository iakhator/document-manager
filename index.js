import app from './server/config/express';

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('API Server started and listening on port 3000');
});
