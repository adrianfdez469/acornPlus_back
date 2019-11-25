const Op = require('sequelize').Op;

const { validationResult } = require('express-validator');

const NomTipoDescuento = require('./tipoDescuentoModel');
const helpers = require('../../../helpers/helpers');

module.exports.getTipodescuentos = async (req, resp, next) => {
    try{
        const { filters, orders, pagination } = req.body;
        const {start, limit} = pagination;
        
        const filtros = helpers.getFiltros(filters, NomTipoDescuento.rawAttributes);
        const ordersArr = helpers.getOrder(orders, 'createdAt');
    
        const {rows, count} = await NomTipoDescuento.findAndCountAll({
            order: ordersArr,
            where: {
                [Op.and]: filtros
            },
            limit: limit,
            offset: start
        });
        
        resp.status(200).json({
            rows: rows,
            count: count
        });

    } catch(err){
        next(err);
    }
}

module.exports.addTipodescuento = async (req, resp, next) => {

    try {
        const errors = validationResult(req);
        helpers.checkValidationResults(errors);

        const {nombre, descuento} = req.body;

        // Buscando si exite un tipo de descuento con el misma nombre
        const existe = await NomTipoDescuento.findOne({
            where:{
                nombre: nombre
            }
        });
        
        helpers.checkIfExist(existe, 'El tipo de descuento ya existe');
        
        const tipodescuento = await NomTipoDescuento.create({
            nombre: nombre,
            descuento: descuento
        });

        resp.status(201).json({
            tipodescuento: tipodescuento
        });

    } catch(err){
        return next(err);
    }
}

module.exports.updateTipodescuento = async (req, resp, next) => {

    try{
        const errors = validationResult(req);
        helpers.checkValidationResults(errors);
    
        const {nombre, descuento, id} = req.body;

        const existe = await NomTipoDescuento.findOne({
            where: {
                [Op.and]: {
                    nombre: nombre,
                    id: {
                        [Op.ne] : id
                    }                    
                }
            }
        });


        helpers.checkIfExist(existe, 'El tipo de descuento ya existe');

        const tipodescuentoToUpdate = await NomTipoDescuento.findByPk(id);
        await tipodescuentoToUpdate.update({
            nombre: nombre,
            descuento: descuento
        });

        resp.status(200).json();

    }catch(err){
        next(err);
    }
}

module.exports.deleteTipodescuento = async (req, resp, next) => {
    const {id} = req.body;

    const deleted = await NomTipoDescuento.destroy({
        where: {
            id: id
        }
    }); 

    if(deleted === 0){
        const err = Error('No encontrado');
        err.statusCode = 404;
        throw err;
    }

    resp.status(200).json();
}