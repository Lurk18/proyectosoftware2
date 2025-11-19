// src/routes/pedidos.js

const express = require('express');
const router = express.Router();

const { 
  crearPedido, 
  obtenerPedidosPorCliente, 
  actualizarEstadoPedido,
  obtenerPedidoPorId,
  eliminarPedido
} = require('../controllers/pedidosController');

// POST /pedidos
router.post('/', crearPedido);

// GET /pedidos/cliente/:customer_id
router.get('/cliente/:customer_id', obtenerPedidosPorCliente);

// GET /pedidos/orden/:order_id
router.get('/orden/:order_id', obtenerPedidoPorId);

// PUT /pedidos/update/:order_id
router.put('/update/:order_id', actualizarEstadoPedido);

// PATCH /pedidos/update/:order_id (soporta clientes que usan PATCH)
router.patch('/update/:order_id', actualizarEstadoPedido);

// DELETE /pedidos/remove/:order_id
router.delete('/remove/:order_id', eliminarPedido);


module.exports = router;