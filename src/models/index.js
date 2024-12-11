// src/models/index.js
const mongoose = require('mongoose');

// Configuración fija de la sala
const CONFIGURACION_SALA = {
    FILAS: 8,
    COLUMNAS: 10,
    PRECIO_BOLETA: 15000
};

// Schema para la Función
const funcionSchema = new mongoose.Schema({
    fecha: { 
        type: Date, 
        required: true 
    },
    hora: { 
        type: String, 
        required: true,
        match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/ // Formato HH:MM
    },
    pelicula: {
        type: String,
        required: true
    },
    estado: { 
        type: String, 
        enum: ['PROGRAMADA', 'EN_CURSO', 'FINALIZADA'],
        default: 'PROGRAMADA'
    },
    sillas_vendidas: {
        type: Number,
        default: 0
    },
    total_ventas: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Schema para la Venta
const ventaSchema = new mongoose.Schema({
    funcion: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Funcion',
        required: true 
    },
    sillas: [{
        fila: { 
            type: Number, 
            required: true 
        },
        columna: { 
            type: Number, 
            required: true 
        }
    }],
    valor_total: { 
        type: Number, 
        required: true 
    }
}, {
    timestamps: true
});

const Funcion = mongoose.model('Funcion', funcionSchema);
const Venta = mongoose.model('Venta', ventaSchema);

module.exports = {
    Funcion,
    Venta,
    CONFIGURACION_SALA
};