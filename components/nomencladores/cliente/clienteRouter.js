const express = require('express');
const router = express.Router();

const clienteController = require('./clienteController');
const clienteValidator = require('./clienteValidator');

router.post('/get', clienteController.getClientes);
router.post('/add', clienteValidator, clienteController.addCliente);
router.post('/update', clienteValidator, clienteController.updateCliente);
router.post('/delete', clienteController.deleteCliente);

module.exports = router;