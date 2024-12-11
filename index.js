// index.js (raíz del proyecto)
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/database');
require('dotenv').config();

// Importar rutas
const routes = require('./src/routes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión a la base de datos
connectDB();

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API CineMax funcionando! 🎬' });
});

// Rutas de la API
app.use('/api', routes);

// Middleware para manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Middleware para rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});