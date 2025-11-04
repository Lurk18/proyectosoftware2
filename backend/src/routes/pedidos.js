const express = require('express');
const router = express.Router();
// 1. Importamos la nueva función del controlador
const { 
  crearPedido, 
  obtenerPedidosPorCliente, 
  actualizarEstadoPedido // <-- Nueva función
} = require('../controllers/pedidosController');

// POST /pedidos
router.post('/', crearPedido);

// GET /pedidos/cliente/:customer_id
router.get('/cliente/:customer_id', obtenerPedidosPorCliente);

// 2. Añadimos la nueva ruta PUT para actualizar un pedido por su ID
// PUT /pedidos/:order_id
router.put('/:order_id', actualizarEstadoPedido);


module.exports = router;