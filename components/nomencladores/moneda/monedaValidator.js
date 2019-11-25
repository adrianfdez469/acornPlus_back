const { body } = require( 'express-validator');

const validateAbreviatura = body('abreviatura').trim().isLength({
    max: 25, min: 2
});

const validateDescrption = body('descripcion').trim().isLength({
    max: '255'
});

const validatePrincipal = body('principal').isBoolean();

const validateConversion = body('tasacambio').isDecimal();

module.exports = [validateAbreviatura, validateDescrption, validatePrincipal, validateConversion];