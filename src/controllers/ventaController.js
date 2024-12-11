// src/controllers/ventaController.js
const { Funcion, Venta, CONFIGURACION_SALA } = require('../models');

const ventaController = {
    // Obtener configuración de la sala
    getConfiguracion: (req, res) => {
        try {
            res.json({ 
                success: true, 
                data: CONFIGURACION_SALA 
            });
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                error: error.message 
            });
        }
    },

    // Obtener estado de las sillas para una función
    getSillasOcupadas: async (req, res) => {
        try {
            const ventas = await Venta.find({ 
                funcion: req.params.funcionId 
            });
            
            const sillasOcupadas = ventas.flatMap(v => v.sillas);
            
            res.json({ 
                success: true, 
                data: sillasOcupadas 
            });
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                error: error.message 
            });
        }
    },

    // Crear una nueva venta
    crearVenta: async (req, res) => {
        try {
            const { funcionId, sillas } = req.body;

            // Verificar disponibilidad de sillas
            const ventasExistentes = await Venta.find({ 
                funcion: funcionId 
            });
            
            const sillasOcupadas = ventasExistentes.flatMap(v => v.sillas);

            // Verificar si alguna silla está ocupada
            const hayConflicto = sillas.some(silla => 
                sillasOcupadas.some(ocupada => 
                    ocupada.fila === silla.fila && 
                    ocupada.columna === silla.columna
                )
            );

            if (hayConflicto) {
                return res.status(400).json({
                    success: false,
                    message: 'Una o más sillas seleccionadas ya están ocupadas'
                });
            }

            // Calcular valor total
            const valor_total = sillas.length * CONFIGURACION_SALA.PRECIO_BOLETA;

            const venta = new Venta({
                funcion: funcionId,
                sillas,
                valor_total
            });

            await venta.save();

            res.status(201).json({
                success: true,
                data: venta
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    },

    // Obtener reporte de ventas
    getReporte: async (req, res) => {
        try {
            const ventas = await Venta.find().populate('funcion');

            const total_ventas = ventas.reduce((sum, v) => sum + v.valor_total, 0);
            const total_boletas = ventas.reduce((sum, v) => sum + v.sillas.length, 0);
            const capacidad_total = CONFIGURACION_SALA.FILAS * CONFIGURACION_SALA.COLUMNAS;
            const porcentaje_ocupacion = (total_boletas / capacidad_total * 100).toFixed(2);

            const reporte = {
                total_ventas,
                total_boletas,
                porcentaje_ocupacion,
                detalle_ventas: ventas
            };

            res.json({
                success: true,
                data: reporte
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
};

module.exports = ventaController;