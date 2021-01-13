const express = require('express');

const router = express.Router();
const AuthController = require('../controllers/auth.controller');

router.get('/auth/callback', AuthController.callback);
router.get('/auth/logout', AuthController.logout);

module.exports = router;
