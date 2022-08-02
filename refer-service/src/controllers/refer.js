const bugsnag = require('bugsnag');
const ShortId = require('shortid');
const validator = require('email-validator');
const { settings } = require('../helpers/config');
const { badRequest, ok, error, notFound } = require('../helpers/responses');
const { VALID, INVALID } = require('../enums/status');
const {
  SignUp,
  IpAddress,
} = require('../models');
const mailchimpQueue = require('../queues/mailchimp');
const emailQueue = require('../queues/email');

const { domain } = settings;

/**
 * Calculate the number of invites for a given
 * shortId
 */
const get = async (req, res) => {
  const { shortId } = req.params;

  if (!shortId || typeof shortId !== 'string') {
    return error(res)({
      reason: 'Invalid referral code',
    });
  }

  try {
    const referrer = await SignUp.findOne({
      where: {
        shortId,
      }
    });

    if (!referrer) {
      return notFound(res)({
        reason: 'That referral code was not found in our system',
      });
    }

    const signups = await SignUp.findAll({
      attributes: ['id'],
      where: {
        referrerId: referrer.id,
        status: VALID,
      },
    });

    ok(res)({
      count: signups.length,
    });
  } catch (err) {
    bugsnag.notify(err, { severity: 'error' });
    error(res)({
      reason: 'Something bad happened',
    });
  }
};

/**
 * Add the new sign up and add the referral user's id
 */
const post = async (req, res) => {
  const { email, shortId } = req.body;

  if (email === null || typeof email !== 'string') {
    return badRequest(res)({
      reason: 'Invalid email',
    });
  }

  if (shortId != null && typeof shortId !== 'string') {
    return badRequest(res)({
      reason: 'Invalid referral code',
    });
  }
  
  // check if email is valid
  if (!validator.validate(email)) {
    return badRequest(res)({
      reason: 'Invalid email',
    });
  }

  try {
    // check if the email already exists in the system
    const existingSignUp = await SignUp.findOne({
      attributes: ['id'],
      where: {
        email,
      },
    });

    if (existingSignUp) {
      return badRequest(res)({
        reason: 'That email has already signed up',
      });
    }

    const obj = {
      email,
      shortId: ShortId.generate(),
    };

    const ipAddress = await IpAddress.findOne({
      where: {
        ipAddress: req.ip,
      },
    });

    if (ipAddress && ipAddress.numberOfSignUps > 1) {
      return badRequest(res)({
        reason: 'This IP has signed up too many times!',
      });
    }

    if (shortId) {
      const referrer = await SignUp.findOne({
        attributes: ['id'],
        where: {
          shortId,
        }
      });

      obj.referrerId = referrer.id;
    }

    const signup = await SignUp.create(obj);

    if (ipAddress) {
      ipAddress.numberOfSignUps += 1;
      ipAddress.save();
    } else {
      IpAddress.create({
        ipAddress: req.ip,
      });
    }

    // Dispatch mailchimp
    mailchimpQueue.enqueue({
      email,
      ipAddress: req.ip,
    });
    // Dispatch follow up email
    emailQueue.enqueue({
      email,
      shortId: signup.shortId,
    });

    res.cookie('shortId', signup.shortId, { domain: `.${domain}`, path: '/' });
    ok(res)({
      shortId: signup.shortId,
    });
  } catch (err) {
    console.error(err);
    bugsnag.notify(err, { severity: 'error' });
    error(res)({
      reason: 'Something bad happened',
    });
  }
};

/**
 * Mark bounced emails as invalid
 */
const bounce = (req, res) => {
  console.log('BOUNCE!');
  req.body.forEach((m) => {
    if (m && m.msys && m.msys.message_event && m.msys.message_event.rcpt_to) {
      const email = m.msys.message_event.rcpt_to;

      console.log('📩', email);
      SignUp.update({
        status: INVALID,
      }, {
        where: {
          email,
        },
      });
    }
  });

  ok(res)({});
};

module.exports = {
  get,
  post,
  bounce,
};