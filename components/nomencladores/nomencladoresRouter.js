const exprees = require('express');
const router = exprees.Router();

const categoriaRouter = require('./categoria/categoriaRouter');
const monedaRouter = require('./moneda/monedaRouter');
const almacenRouter = require('./almacen/almacenRouter');
const tipodescuentoRouter = require('./tipodescuento/tipoDescuentoRouter');
const unidadmedidaRouter = require('./unidadmedida/unidadmedidaRouter');
const proveedorRouter = require('./proveedor/prveedorRouter');
const clienteRouter = require('./cliente/clienteRouter');

router.use('/nom_categoria', categoriaRouter);
router.use('/nom_moneda', monedaRouter);
router.use('/nom_almacen', almacenRouter);
router.use('/nom_tipodescuento', tipodescuentoRouter);
router.use('/nom_unidadmedida', unidadmedidaRouter);
router.use('/nom_proveedor', proveedorRouter);
router.use('/nom_cliente', clienteRouter);

module.exports = router;