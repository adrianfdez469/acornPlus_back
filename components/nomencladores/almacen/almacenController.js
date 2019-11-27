const Op = require('sequelize').Op;

const { validationResult } = require('express-validator');

const NomAlmacen = require('./almacenModel');
const helpers = require('../../../helpers/helpers');

module.exports.getAlmacenes = async (req, resp, next) => {
    try{
        const { filters, orders, pagination } = req.body;
        const {start, limit} = pagination;
        
        const filtros = helpers.getFiltros(filters, NomAlmacen.rawAttributes);
        const ordersArr = helpers.getOrder(orders, 'createdAt');
    
        const {rows, count} = await NomAlmacen.findAndCountAll({
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

module.exports.addAlmacen = async (req, resp, next) => {

    try {
        const errors = validationResult(req);
        helpers.checkValidationResults(errors);

        const {nombre, descripcion} = req.body;

        // Buscando si exite un almacen con el misma nombre
        const existe = await NomAlmacen.findOne({
            where:{
                nombre: {
                    [Op.iLike]: nombre
                }
            }
        });
        
        helpers.checkIfExist(existe, 'El almacén ya existe');
        
        const almacen = await NomAlmacen.create({
            nombre: nombre,
            descripcion: descripcion
        });

        resp.status(201).json({
            almacen: almacen
        });

    } catch(err){
        return next(err);
    }
}

module.exports.updateAlmacen = async (req, resp, next) => {

    try{
        const errors = validationResult(req);
        helpers.checkValidationResults(errors);
    
        const {nombre, descripcion, id} = req.body;

        const existe = await NomAlmacen.findOne({
            where: {
                [Op.and]: {
                    nombre: {
                        [Op.iLike]: nombre
                    },
                    id: {
                        [Op.ne] : id
                    }                    
                }
            }
        });


        helpers.checkIfExist(existe, 'El almacén ya existe');

        const almacenToUpdate = await NomAlmacen.findByPk(id);
        await almacenToUpdate.update({
            nombre: nombre,
            descripcion: descripcion
        });

        resp.status(200).json();

    }catch(err){
        next(err);
    }
}

module.exports.deleteAlmacen = async (req, resp, next) => {
    const {id} = req.body;

    const deleted = await NomAlmacen.destroy({
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