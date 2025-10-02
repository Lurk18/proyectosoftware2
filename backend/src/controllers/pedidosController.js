// src/controllers/pedidosController.js
const pool = require('../models/db');

/**
 * Crea un nuevo pedido en la base de datos.
 * Espera recibir un 'customer_id' en el cuerpo de la solicitud.
 */
const crearPedido = async (req, res) => {
  const { customer_id } = req.body;

  // Validación de entrada
  if (!customer_id || isNaN(customer_id)) {
    return res.status(400).json({ error: 'El campo customer_id es obligatorio y debe ser un número válido.' });
  }

  try {
    // Verificar que el cliente existe antes de crear el pedido
    const clienteExistente = await pool.query(
      'SELECT customer_id FROM Cliente WHERE customer_id = $1',
      [customer_id]
    );

    if (clienteExistente.rowCount === 0) {
      return res.status(404).json({ error: `El cliente con ID ${customer_id} no existe.` });
    }

    // Insertar nuevo pedido en la tabla Orders
    const insertQuery = `
      INSERT INTO Orders (customer_id)
      VALUES ($1)
      RETURNING order_id, customer_id, order_date, status
    `;
    const result = await pool.query(insertQuery, [customer_id]);

    // Devolver la orden recién creada
    return res.status(201).json({
      message: 'Pedido creado exitosamente.',
      pedido: result.rows[0],
    });

  } catch (err) {
    console.error('❌ Error al crear el pedido:', err);

    return res.status(500).json({
      error: 'Error interno del servidor al crear el pedido.',
      detalle: err.message,
    });
  }
};

module.exports = {
  crearPedido,
};
