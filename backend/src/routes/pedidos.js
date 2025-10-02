const express = require('express');
const router = express.Router();
const { crearPedido, obtenerPedidosPorCliente } = require('../controllers/pedidosController');

// POST /pedidos
router.post('/', crearPedido);

// ✅ GET /pedidos/cliente/:customer_id
router.get('/cliente/:customer_id', obtenerPedidosPorCliente);

module.exports = router;

