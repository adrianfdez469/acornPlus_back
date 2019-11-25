const { body } = require( 'express-validator');

const validateNombre = body('nombre').trim().isLength({
    max: 100, min: 3
});

const validateDescrption = body('descuento')
                .isNumeric();
                
                
                

module.exports = [validateNombre, validateDescrption];