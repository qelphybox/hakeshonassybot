const express = require('express');

const router = express.Router();
const AuthController = require('../controllers/auth.controller');

router.get('/callback', AuthController.callback);
router.get('/logout', AuthController.logout);

module.exports = router;
