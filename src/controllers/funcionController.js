// src/controllers/funcionController.js
const { Funcion, CONFIGURACION_SALA } = require('../models');

const funcionController = {
    // Crear nueva función
    crearFuncion: async (req, res) => {
        try {
            const { fecha, hora, pelicula } = req.body;
            
            // Verificar si ya existe una función en esa fecha y hora
            const funcionExistente = await Funcion.findOne({ fecha, hora });
            if (funcionExistente) {
                return res.status(400).json({
                    success: false,
                    message: 'Ya existe una función programada para esa fecha y hora'
                });
            }

            const funcion = new Funcion({
                fecha,
                hora,
                pelicula
            });

            await funcion.save();

            res.status(201).json({
                success: true,
                data: funcion
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    },

    // Obtener funciones
    getFunciones: async (req, res) => {
        try {
            const funciones = await Funcion.find()
                .sort({ fecha: 1, hora: 1 }); // Ordenadas por fecha y hora

            res.json({
                success: true,
                data: funciones
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    },

    // Obtener función específica
    getFuncion: async (req, res) => {
        try {
            const funcion = await Funcion.findById(req.params.id);
            if (!funcion) {
                return res.status(404).json({
                    success: false,
                    message: 'Función no encontrada'
                });
            }

            res.json({
                success: true,
                data: funcion
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    },

    // Cerrar función
    cerrarFuncion: async (req, res) => {
        try {
            const funcion = await Funcion.findById(req.params.id);
            if (!funcion) {
                return res.status(404).json({
                    success: false,
                    message: 'Función no encontrada'
                });
            }

            funcion.estado = 'FINALIZADA';
            await funcion.save();

            res.json({
                success: true,
                data: funcion
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
};

module.exports = funcionController;