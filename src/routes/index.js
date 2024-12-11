// src/routes/index.js
const express = require('express');
const router = express.Router();
const ventaController = require('../controllers/ventaController');
const funcionController = require('../controllers/funcionController');

// Rutas de Funciones
router.post('/funciones', funcionController.crearFuncion);
router.get('/funciones', funcionController.getFunciones);
router.get('/funciones/:id', funcionController.getFuncion);
router.put('/funciones/:id/cerrar', funcionController.cerrarFuncion);

router.put('/funciones/:id/sillas', funcionController.actualizarSillas);


// Rutas de Ventas y Configuración (las que ya teníamos)
router.get('/configuracion', ventaController.getConfiguracion);
router.get('/funcion/:funcionId/sillas', ventaController.getSillasOcupadas);
router.post('/ventas', ventaController.crearVenta);
router.get('/reportes/ventas', ventaController.getReporte);

module.exports = router;