const express = require('express');
const router = express.Router();
const MonedaController = require('./monedaController');
const monedaValidator = require('./monedaValidator');

router.post('/get', MonedaController.getMonedas);
router.post('/add', monedaValidator, MonedaController.addMoneda);
router.post('/update', monedaValidator, MonedaController.updateMoneda);
router.post('/delete', MonedaController.deleteMoneda);

module.exports = router;