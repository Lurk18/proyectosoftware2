const express = require('express');
const router = express.Router();
const { getItemByFoodCode } = require('../controllers/itemController');

// Buscar por food code
router.get('/code/:foodCode', getItemByFoodCode);

module.exports = router;
