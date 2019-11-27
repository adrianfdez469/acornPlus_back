const { body } = require( 'express-validator');

const validateNombre = body('nombre').trim().isLength({
    max: 50, min: 3
});


const validateAbreviatura = body('abreviatura').trim().isLength({
    max: 7, min: 1
});
                
                

module.exports = [validateNombre, validateAbreviatura];