const express = require('express');
const router = express.Router();
const ctrlNvm = require('../../app_api/controllers/nvm.controller');
const ctrlCache = require('../../app_api/controllers/cache.controller');

// nvm
router
  .route('/nvm')
  .get(ctrlNvm.getNvmToken);

module.exports = router;

