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

/**
 * Obtiene todos los pedidos de un cliente específico.
 * Recibe el ID del cliente por parámetro en la URL.
 */
const obtenerPedidosPorCliente = async (req, res) => {
  const { customer_id } = req.params;

  // Validación básica
  if (!customer_id || isNaN(customer_id)) {
    return res.status(400).json({ error: 'El parámetro customer_id debe ser un número válido.' });
  }

  try {
    // Verificar que el cliente existe
    const clienteExistente = await pool.query(
      'SELECT customer_id FROM Cliente WHERE customer_id = $1',
      [customer_id]
    );

    if (clienteExistente.rowCount === 0) {
      return res.status(404).json({ error: `El cliente con ID ${customer_id} no existe.` });
    }

    // Obtener todos los pedidos del cliente
    const pedidos = await pool.query(
      `SELECT order_id, order_date, status
       FROM Orders
       WHERE customer_id = $1
       ORDER BY order_date DESC`,
      [customer_id]
    );

    res.status(200).json({
      customer_id: parseInt(customer_id),
      cantidad: pedidos.rowCount,
      pedidos: pedidos.rows
    });

  } catch (err) {
    console.error('❌ Error al obtener pedidos del cliente:', err);
    res.status(500).json({
      error: 'Error interno del servidor al obtener los pedidos.',
      detalle: err.message
    });
  }
};

/**
 * Obtiene un pedido por su ID.
 * Recibe el ID del pedido por parámetro en la URL.
 */

const obtenerPedidoPorId = async (req, res) => {
  const { order_id } = req.params;

  // Validación básica
  if (!order_id || isNaN(order_id)) {
    return res.status(400).json({ error: 'El parámetro order_id debe ser un número válido.' });
  }

  try {
    // Obtener el pedido por su ID
    const pedido = await pool.query(
      `SELECT order_id, customer_id, order_date, status
       FROM Orders
       WHERE order_id = $1`,
      [order_id]
    );

    if (pedido.rowCount === 0) {
      return res.status(404).json({ error: `El pedido con ID ${order_id} no existe.` });
    }

    res.status(200).json({
      pedido: pedido.rows[0]
    });

  } catch (err) {
    console.error('❌ Error al obtener el pedido por ID:', err);
    res.status(500).json({
      error: 'Error interno del servidor al obtener el pedido.',
      detalle: err.message
    });
  }
};

/**
 * Elimina un pedido por su ID.
 * Recibe el ID del pedido por parámetro en la URL.
 */
const eliminarPedido = async (req, res) => {
  const { order_id } = req.params;

  // Validación básica
  if (!order_id || isNaN(order_id)) {
    return res.status(400).json({ error: 'El parámetro order_id debe ser un número válido.' });
  }

  try {
    const deleteQuery = `
      DELETE FROM Orders
      WHERE order_id = $1
      RETURNING order_id, customer_id, order_date, status
    `;

    const result = await pool.query(deleteQuery, [order_id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: `El pedido con ID ${order_id} no existe.` });
    }

    return res.status(200).json({
      message: `Pedido con ID ${order_id} eliminado correctamente.`,
      pedido: result.rows[0]
    });

  } catch (err) {
    console.error(`❌ Error al eliminar el pedido ${order_id}:`, err);
    return res.status(500).json({
      error: 'Error interno del servidor al eliminar el pedido.',
      detalle: err.message
    });
  }
};

/**
 * Actualiza el estado de un pedido específico.
 * Recibe el ID del pedido por parámetro en la URL.
 * Espera recibir un 'status' en el cuerpo de la solicitud.
 */
const actualizarEstadoPedido = async (req, res) => {
  const { order_id } = req.params;
  // Aceptamos tanto 'status' (inglés) como 'estado' (español) en el body
  const statusRaw = req.body.status ?? req.body.estado;
  const status = typeof statusRaw === 'string' ? statusRaw.trim() : statusRaw;

  // Validaciones
  if (!order_id || isNaN(order_id)) {
    return res.status(400).json({ error: 'El parámetro order_id debe ser un número válido.' });
  }
  if (!status || typeof status !== 'string' || status === '') {
    return res.status(400).json({ error: 'El campo "status" (o "estado") es obligatorio en el body y debe ser un texto no vacío.' });
  }

  try {
    // 1. Actualizar el estado del pedido en la BD
    // Usamos RETURNING para que la consulta nos devuelva el registro actualizado
    const updateQuery = `
      UPDATE Orders
      SET status = $1
      WHERE order_id = $2
      RETURNING order_id, customer_id, order_date, status
    `;
    
    const result = await pool.query(updateQuery, [status.trim(), order_id]);

    // 2. Verificar si la actualización fue exitosa
    // Si rowCount es 0, significa que no se encontró un pedido con ese order_id
    if (result.rowCount === 0) {
      return res.status(404).json({ error: `El pedido con ID ${order_id} no existe.` });
    }

    // 3. Devolver el pedido actualizado
    return res.status(200).json({
      message: 'Estado del pedido actualizado exitosamente.',
      pedido: result.rows[0],
    });

  } catch (err) {
    console.error(`❌ Error al actualizar el pedido ${order_id}:`, err);
    return res.status(500).json({
      error: 'Error interno del servidor al actualizar el pedido.',
      detalle: err.message,
    });
  }
};


// Exportamos todas las funciones, incluyendo la nueva
module.exports = {
  crearPedido,
  obtenerPedidosPorCliente,
  actualizarEstadoPedido,
  obtenerPedidoPorId,
  eliminarPedido
};