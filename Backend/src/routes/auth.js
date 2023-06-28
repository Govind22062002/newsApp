// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const {userAuth} = require("../controler/")

router.post('/register',userAuth.register)
router.post('/login',userAuth.login)

module.exports = router;
