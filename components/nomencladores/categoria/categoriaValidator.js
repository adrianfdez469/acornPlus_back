const { body } = require( 'express-validator');

const validateNombre = body('nombre').trim().isLength({
    max: 25, min: 3
});

const validateDescrption = body('descripcion').trim().isLength({
    max: '255'
});

const validateOrden = body('orden').isNumeric();

const validateHexColor = body('color').isHexColor();

module.exports = [validateNombre, validateDescrption, validateOrden, validateHexColor];