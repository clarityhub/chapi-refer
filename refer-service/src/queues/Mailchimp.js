const mailchimp = require('../services/mailchimp');
const Queue = require('./_Queue');
const { settings } = require('../helpers/config');

const queue = new Queue();

const { listId } = settings.mailchimp;

queue.run(function(batch) {
  if (batch.length === 0) {
    return;
  }

  // Take the batch and add some members
  mailchimp.post(`/lists/${listId}`, {
    members: batch.map((item) => {
      return {
        email_address: item.email,
        status: 'subscribed',
        ip_signup: item.ipAddress,
      };
    }),
  }).then((results) => {
    // TODO nothing?
  }).catch((error) => {
    console.error(error);
  });
});

module.exports = queue;