// src/routes/test.js
const express = require('express');
const router = express.Router();
const { getClienteEjemplo } = require('../controllers/testController');

router.get('/', getClienteEjemplo);

module.exports = router;
