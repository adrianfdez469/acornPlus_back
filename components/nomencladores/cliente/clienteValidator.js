const { body } = require('express-validator');

const nombreValidator = body('nombre')
                    .trim()
                    .exists({checkNull: true})
                    .isString()
                    .isLength({max: 50, min: 2});

const descuentoValidator = body('descuento')
                    .isNumeric()
                    .custom(input => 0 <= input <= 100);

const validateDescrption = body('descripcion').trim().isLength({
    max: '255'
});

const telfValidator = body('telefono').trim().isLength({max: 50});
const direccionValidator = body('direccion').trim().isLength({max: 255});
const correoValidator = body('correo').trim().isLength({max: 50});
const empresaValidator = body('nombreempresa').trim().isLength({max: 50});

module.exports = [nombreValidator, descuentoValidator, validateDescrption, telfValidator, direccionValidator, correoValidator, empresaValidator];
                    