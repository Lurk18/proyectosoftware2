// src/controllers/clientesController.js
const pool = require('../models/db');

const getTotalClientes = async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) FROM Cliente;');
    const totalClientes = parseInt(result.rows[0].count, 10);
    res.json({ totalClientes });
  } catch (err) {
    console.error('❌ Error al contar clientes:', err);
    res.status(500).json({ error: 'Error al contar los clientes' });
  }
};

module.exports = { getTotalClientes };
