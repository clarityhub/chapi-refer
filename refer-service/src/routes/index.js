const express = require('express');
const cors = require('cors');
const { post, get, bounce } = require('../controllers/refer');

const router = express.Router();
router.route('/refer')
  .options(cors())
  .post(cors(), post);

router.route('/refer/:shortId')
  .options(cors())
  .get(cors(), get);

router.route('/refer/bounce')
  .post(bounce); 

module.exports = router;