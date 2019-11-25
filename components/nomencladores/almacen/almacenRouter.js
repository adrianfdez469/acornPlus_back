const express = require('express');
const router = express.Router();
const AlmacenController = require('./almacenController');
const AlmacenValidator = require('./AlmacenValidator');

router.post('/get', AlmacenController.getAlmacenes);
router.post('/add', AlmacenValidator, AlmacenController.addAlmacen);
router.post('/update', AlmacenValidator, AlmacenController.updateAlmacen);
router.post('/delete', AlmacenController.deleteAlmacen);

module.exports = router;