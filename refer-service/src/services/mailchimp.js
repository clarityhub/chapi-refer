const Mailchimp = require('mailchimp-api-v3');
const { settings } = require('../helpers/config');

const { apiKey } = settings.mailchimp;

module.exports = new Mailchimp(apiKey);