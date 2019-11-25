const express = require('express');
const router = express.Router();
const TipodescuentoController = require('./tipoDescuentoController');
const TipodescuentoValidator = require('./tipoDescuentoValidator');

router.post('/get', TipodescuentoController.getTipodescuentos);
router.post('/add', TipodescuentoValidator, TipodescuentoController.addTipodescuento);
router.post('/update', TipodescuentoValidator, TipodescuentoController.updateTipodescuento);
router.post('/delete', TipodescuentoController.deleteTipodescuento);

module.exports = router;