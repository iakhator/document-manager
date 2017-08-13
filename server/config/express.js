import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import logger from 'morgan';
import expressValidator from 'express-validator';
import swaggerJSDoc from 'swagger-jsdoc';
import routes from '../routes';

const app = express();
// swagger definition
const swaggerDefinition = {
  info: {
    title: 'Doksmanager API',
    version: '1.0.0',
    description: 'Doksmanager API is the API for a document management system, complete with roles and privileges. Each document defines access rights; the document defines which roles can access it. Also, each document specifies the date it was published. Users are categorized by roles. Each user must have a role defined for them.',
    contact: {
      email: 'itua.akhator@andela.com',
    },
    license: {
      name: 'MIT',
      url: 'http://www.apache.org/licenses/LICENSE-2.0.html',
    }
  },
  host: 'doksmanager.herokuapp.com',
  basePath: '/',
};

// options for the swagger docs
const options = {
  // import swaggerDefinitions
  swaggerDefinition,
  // path to the API docs
  apis: [path.join(__dirname, '../routes/*.js')],
};
const swaggerSpec = swaggerJSDoc(options);

app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());

// initialize swagger-jsdoc
app.use(express.static('public/api-doc'));

// serve swagger
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

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
