// src/controllers/testController.js
const pool = require('../models/db');

const getClienteEjemplo = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Cliente WHERE customer_name = 'cliente1';");
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error en /test:', err);
    res.status(500).json({ error: 'Error al obtener cliente ejemplo : posible error en la base de datos o cliente test nunca insertado' });
  }
};

module.exports = { getClienteEjemplo };
