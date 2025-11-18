// src/controllers/InformeController.js
const pool = require('../models/db');

/**
 * Genera un informe consolidado del inventario.
 * Devuelve un resumen (totales) y un detalle de todos los items.
 */
const getInformeInventario = async (req, res) => {
  try {
    // Consulta 1: Resumen de inventario
    // (Total SKUs, Total de items en stock, Valor total del inventario)
    const summaryQuery = `
      SELECT
        COUNT(item_id) AS total_skus,
        SUM(stock) AS total_unidades_stock,
        SUM(stock * price) AS valor_total_inventario
      FROM Item;
    `;

    // Consulta 2: Detalle del inventario
    // (Lista de items, con su proveedor, stock actual y valor)
    const detailsQuery = `
      SELECT
        i.item_id,
        i.name AS producto_nombre,
        p.proveedor_name AS proveedor_nombre,
        i.stock,
        i.price AS precio_unitario,
        (i.stock * i.price) AS valor_total_item
      FROM
        Item i
      JOIN
        Proveedor p ON i.proveedor_id = p.proveedor_id
      ORDER BY
        valor_total_item DESC,
        i.stock DESC;
    `;

    // Ejecutamos ambas consultas en paralelo para mayor eficiencia
    const [summaryResult, detailsResult] = await Promise.all([
      pool.query(summaryQuery),
      pool.query(detailsQuery)
    ]);

    // Extraemos los resultados
    const resumen = summaryResult.rows[0];
    const detalle = detailsResult.rows;

    // Formateamos la respuesta
    const informe = {
      titulo: 'Informe Consolidado de Inventario',
      fecha_generacion: new Date().toISOString(),
      resumen: {
        total_skus: parseInt(resumen.total_skus, 10),
        total_unidades_stock: parseInt(resumen.total_unidades_stock, 10) || 0,
        valor_total_inventario: parseFloat(resumen.valor_total_inventario) || 0.00
      },
      detalle: detalle
    };

    res.status(200).json(informe);

  } catch (err) {
    console.error('❌ Error al generar informe de inventario:', err);
    res.status(500).json({
      error: 'Error interno del servidor al generar el informe.',
      detalle: err.message
    });
  }
};

module.exports = {
  getInformeInventario
};