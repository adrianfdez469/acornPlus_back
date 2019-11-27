const { body } = require( 'express-validator');

const validateNombre = body('nombre').trim().isLength({
    max: 50, min: 3
});

const validateDescrption = body('descripcion').trim().isLength({
    max: '255'
});

const validateCorreo = body('correo').trim().normalizeEmail().optional({nullable: true});

const validateTelf = body('descripcion').trim().isLength({
    max: '255'
});
const validateSitioWeb = body('sitioweb').trim().isLength({
    max: '255'
});

module.exports = [validateNombre, validateDescrption, validateCorreo, validateTelf, validateSitioWeb];