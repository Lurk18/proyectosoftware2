// src/routes/pedidos.js
const express = require('express');
const router = express.Router();
const { crearPedido } = require('../controllers/pedidosController');

// Definimos la ruta para crear un nuevo pedido.
// Será una petición POST a la raíz de '/pedidos'.
router.post('/', crearPedido);

module.exports = router;

