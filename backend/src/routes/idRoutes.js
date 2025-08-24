const express = require('express');
const router = express.Router();
const { getItemByID } = require('../controllers/idController');

// Buscar por food code
router.get('/id/:mongoid', getItemByID);

module.exports = router;
