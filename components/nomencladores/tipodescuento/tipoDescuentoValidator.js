const { body } = require( 'express-validator');

const validateNombre = body('nombre').trim().isLength({
    max: 100, min: 3
});

const validateDescuento = body('descuento')
                .isNumeric();
                
                
                

module.exports = [validateNombre, validateDescuento];