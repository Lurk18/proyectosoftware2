const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const itemRoutes = require('./routes/itemRoutes');
const ingredientRoutes = require('./routes/ingredientRoutes');
const mongoID = require("./routes/idRoutes");

// Configurar variables de entorno
dotenv.config();

// Crear instancia de Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Para parsear JSON en requests

// Ruta de prueba localhost:3000
app.get('/', (req, res) => {
  res.send('Backend funcionando. Consulta: /api/id/:idmongoDB');
});

// Rutas para la api
app.use('/api', itemRoutes, ingredientRoutes, mongoID);

// Conexión a MongoDB y arranque del servidor si hay conexion
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Conectado a MongoDB');
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
})
.catch(err => {
  console.error('❌ Error al conectar con MongoDB:', err);
});


