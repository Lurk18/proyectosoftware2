const express = require('express');
const router = express.Router();
const { getItemByDesc } = require('../controllers/ingredientController');

// Buscar por food code
router.get('/search/:description', getItemByDesc);

module.exports = router;
