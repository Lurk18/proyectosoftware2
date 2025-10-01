// src/routes/clientes.js
const express = require('express');
const router = express.Router();
const { getTotalClientes } = require('../controllers/clientesController');

router.get('/', getTotalClientes);

module.exports = router;
