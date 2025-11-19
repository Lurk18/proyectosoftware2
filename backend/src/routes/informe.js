// src/routes/informe.js
const express = require('express');
const router = express.Router();
const { getInformeInventario, getProductoMasVendido } = require('../controllers/informeController');

/**
 * @route GET /inventario
 * @desc Obtiene un informe consolidado del inventario (resumen y detalle).
 * @access public
 */
router.get('/inventario', getInformeInventario);

/**
 * @route GET /informes/producto-mas-vendido
 * @desc Devuelve el producto más vendido (por cantidad total)
 * @access public
 */
router.get('/producto-mas-vendido', getProductoMasVendido);

module.exports = router;