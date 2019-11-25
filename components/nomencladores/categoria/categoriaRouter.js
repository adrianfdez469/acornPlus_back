const express = require('express');

const categoriaController = require('./categoriaController');
const categoriaValidator = require('./categoriaValidator');
const router = express.Router();

router.post('/add',categoriaValidator, categoriaController.addCategoria);
router.post('/update', categoriaValidator,categoriaController.updateCategoria);
router.post('/get', categoriaController.getCategorias);
router.post('/delete', categoriaController.deleteCategoria);

module.exports = router;