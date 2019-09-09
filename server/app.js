const Koa = require('koa');
const mount = require('koa-mount');
const cors = require('koa2-cors');
const bodyParser = require('koa-bodyparser');
const handleErrors = require('./middleware/errors');

const app = new Koa();
const api = require('./lib/api');

app.use(cors());
app.use(bodyParser());
app.use(mount('/api', api));
app.on('error', handleErrors);

module.exports = app;
