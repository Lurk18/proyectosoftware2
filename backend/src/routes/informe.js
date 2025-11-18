// src/routes/informe.js
const express = require('express');
const router = express.Router();
const { getInformeInventario } = require('../controllers/InformeController');

/**
 * @route GET /inventario
 * @desc Obtiene un informe consolidado del inventario (resumen y detalle).
 * @access public
 */
router.get('/inventario', getInformeInventario);

module.exports = router;