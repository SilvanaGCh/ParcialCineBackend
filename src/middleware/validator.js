// src/middleware/validator.js
const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      errors: errors.array() 
    });
  }
  next();
};

const salaValidation = [
  body('nombre').notEmpty().withMessage('El nombre es requerido'),
  body('filas').isInt({ min: 1 }).withMessage('Número de filas inválido'),
  body('columnas').isInt({ min: 1 }).withMessage('Número de columnas inválido'),
  body('precio_boleta').isFloat({ min: 0 }).withMessage('Precio de boleta inválido'),
  handleValidationErrors
];

const funcionValidation = [
  body('sala').isMongoId().withMessage('ID de sala inválido'),
  body('fecha').isISO8601().withMessage('Fecha inválida'),
  body('hora').matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Hora inválida (formato HH:MM)'),
  handleValidationErrors
];

const reservaValidation = [
  body('funcionId').isMongoId().withMessage('ID de función inválido'),
  body('sillas').isArray().withMessage('Sillas debe ser un array'),
  body('sillas.*.fila').isInt({ min: 0 }).withMessage('Fila inválida'),
  body('sillas.*.columna').isInt({ min: 0 }).withMessage('Columna inválida'),
  handleValidationErrors
];

module.exports = {
  salaValidation,
  funcionValidation,
  reservaValidation
};