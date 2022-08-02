const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
const sparkpost = require('../services/sparkpost');
const Queue = require('./_Queue');
const { settings } = require('../helpers/config');
const { INACTIVE } = require('../enums/status');
const {
  SignUp,
} = require('../models');

const { domain } = settings;

const queue = new Queue();

const template = fs.readFileSync(path.resolve(path.join(__dirname, '..', 'templates', 'signup.html')), { encoding: 'utf8' });
const compiled = Handlebars.compile(template);

queue.run(function (batch) {
  if (batch.length === 0) {
    return;
  }
  batch.forEach((item) => {
    sparkpost.send({
      content: {
        from: 'signup@clarityhub.io',
        subject: 'Thanks for signing up!',
        html: compiled({
          appUrl: domain,
          shortId: item.shortId,
        }),
      },
      recipients: [
        { address: item.email },
      ],
    }).then((response) => {
      if (response.results.total_rejected_recipients > 0) {
        console.log('REJECTED!');
        console.log('🏷', item.shortId);
        SignUp.update({
          status: INACTIVE,
        }, {
          where: {
            shortId: item.shortId,
          }
        });
      }
    }).catch((error) => {
      console.error(error);
    });
  });
});

module.exports = queue;