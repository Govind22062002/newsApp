// backend/routes/news.js
const express = require('express');
const router = express.Router();

const {news}= require("../controler")
// Get all news headlines
router.get('/',news.home);

// Add a new news headline
router.post('/',news.homePost);

module.exports = router;
