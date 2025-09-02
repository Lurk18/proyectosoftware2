const express = require('express');
const { Pool } = require('pg');

// Crear una instancia de Express
const app = express();
app.use(express.json());

// Configurar conexión a PostgreSQL usando DATABASE_URL del entorno
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Probar la conexión
pool.connect()
  .then(() => console.log('✅ Conectado a PostgreSQL'))
  .catch(err => console.error('❌ Error al conectar a PostgreSQL:', err));

// Ruta básica para verificar el servidor
app.get('/', (req, res) => {
  res.send('Servidor backend conectado con PostgreSQL 🚀');
});

// Ruta ejemplo: obtener usuarios
app.get('/usuarios', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuarios');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// Puerto desde variable de entorno o 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor escuchando en http://localhost:${PORT}`);
});
