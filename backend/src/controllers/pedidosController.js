// src/controllers/pedidosController.js
const pool = require('../models/db');

/**
 * Crea un nuevo pedido en la base de datos.
 * Espera recibir un 'customer_id' en el cuerpo de la solicitud.
 */
const crearPedido = async (req, res) => {
  // Extraemos el customer_id del cuerpo de la solicitud
  const { customer_id } = req.body;

  // Verificamos que el customer_id fue proporcionado
  if (!customer_id) {
    return res.status(400).json({ error: 'El campo customer_id es obligatorio.' });
  }

  try {
    // La consulta SQL para insertar un nuevo pedido.
    // Usamos $1 como placeholder para evitar inyección SQL.
    // 'RETURNING *' nos devuelve el registro completo que se acaba de crear.
    const query = 'INSERT INTO Orders (customer_id) VALUES ($1) RETURNING *';
    const values = [customer_id];

    // Ejecutamos la consulta
    const result = await pool.query(query, values);

    // Enviamos el nuevo pedido creado como respuesta con un estado 201 (Created)
    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error('❌ Error al crear el pedido:', err);
    // Manejamos posibles errores, como un customer_id que no existe en la tabla Cliente
    if (err.code === '23503') { // Código de error para violación de llave foránea
        return res.status(404).json({ error: `El cliente con ID ${customer_id} no existe.` });
    }
    res.status(500).json({ error: 'Error interno del servidor al crear el pedido.' });
  }
};

module.exports = {
  crearPedido,
};
