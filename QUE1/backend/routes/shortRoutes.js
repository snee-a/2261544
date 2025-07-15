const express = require('express');
const router = express.Router();
const {
  makeShortUrl,
  redirectToLongUrl,
  getStats,
} = require('../controllers/shortControllers');  
router.post('/shorturls', makeShortUrl);  
router.get('/shorturls/:shortcode',getStats);
router.get('/:shortcode', redirectToLongUrl);
module.exports = router;
