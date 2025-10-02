const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Asegura que las variables de entorno estén disponibles
const app = express();

app.use(express.json());

// Rutas
const testRoutes = require('./routes/test');
const clientesRoutes = require('./routes/clientes');
const pedidosRoutes = require('./routes/pedidos');

// Ruta básica
app.get('/', (req, res) => {
  res.send('Servidor backend conectado con PostgreSQL funcionando correctamente.');
});

// Usar rutas
app.use('/test', testRoutes);
app.use('/clientes', clientesRoutes);
app.use('/pedidos', pedidosRoutes);

// Puerto desde variable de entorno o 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor escuchando en http://localhost:${PORT}`);
});
