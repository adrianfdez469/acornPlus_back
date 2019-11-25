const exprees = require('express');
const router = exprees.Router();

const categoriaRouter = require('./categoria/categoriaRouter');
const monedaRouter = require('./moneda/monedaRouter');
const almacenRouter = require('./almacen/almacenRouter');
const tipodescuentoRouter = require('./tipodescuento/tipoDescuentoRouter');

router.use('/nom_categoria', categoriaRouter);
router.use('/nom_moneda', monedaRouter);
router.use('/nom_almacen', almacenRouter);
router.use('/nom_tipodescuento', tipodescuentoRouter);

module.exports = router;