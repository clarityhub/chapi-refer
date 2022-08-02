const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const bugsnag = require('bugsnag');

const routes = require('./routes');
const { settings } = require('./helpers/config');
require('./queues/mailchimp');
require('./queues/email');

helmet({
  hidePoweredBy: {
    setTo: 'Clarity Hub, Inc',
  },
});

bugsnag.register('');

const app = express();

app.use(bugsnag.requestHandler);
app.enable('trust proxy');
app.use(helmet());
app.use(bodyParser.json());
app.use(routes);
app.use(bugsnag.errorHandler);

const server = app.listen(settings.port, () => console.log(`✅ 👮🏽 service-refer running on port ${settings.port}`));

module.exports = { app, server }; // For testing
