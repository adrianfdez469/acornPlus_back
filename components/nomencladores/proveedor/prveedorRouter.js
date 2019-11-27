const express = require('express');

const proveedorController = require('./proveedorController');
const proveedorValidator = require('./proveedorValidator');

const router = express.Router();

router.post('/get', proveedorController.getProveedores);
router.post('/add', proveedorValidator, proveedorController.addProveedor);
router.post('/update', proveedorValidator, proveedorController.updateProveedor);
router.post('/delete', proveedorController.deleteProveedor);

module.exports = router;