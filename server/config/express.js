import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import routes from '../routes';


const app = express();

app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// mount all routes on /api path
app.use('/api/v1', routes);


export default app;
