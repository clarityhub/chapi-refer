const SparkPost = require('sparkpost');
const { settings } = require('../helpers/config');

const client = new SparkPost(settings.sparkpost.apiKey);

module.exports = {
  send(...args) {
    // Support multiple email clients
    return client.transmissions.send(...args);
  },
};
