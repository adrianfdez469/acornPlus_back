const express = require('express');

const unidadmedidaController = require('./unidadmedidaController');
const unidadmedidaValidator = require('./unidadmedidaValidator');

const router = express.Router();

router.post('/get', unidadmedidaController.getUnidades);
router.post('/add', unidadmedidaValidator, unidadmedidaController.addUnidadmedida);
router.post('/update', unidadmedidaValidator, unidadmedidaController.updateUnidadmedida);
router.post('/delete', unidadmedidaController.deleteUnidadmedida);

module.exports = router;