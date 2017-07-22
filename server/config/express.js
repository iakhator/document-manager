import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import expressValidator from 'express-validator';
import routes from '../routes';


const app = express();

app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());

app.use((req, res, next) => {
  const send = res.send;
  let sent = false;
  res.send = (data) => {
    if (sent) return;
    send.bind(res)(data);
    sent = true;
  };
  next();
});
// mount all routes on /api path
app.use('/api/v1', routes);


export default app;
