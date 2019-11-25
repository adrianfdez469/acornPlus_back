const Op = require('sequelize').Op;

const { validationResult } = require('express-validator');

const NomMoneda = require('./monedaModel');
const helpers = require('../../../helpers/helpers');

module.exports.getMonedas = async (req, resp, next) => {
    try{
        const { filters, orders, pagination } = req.body;
        const {start, limit} = pagination;
        
        const filtros = helpers.getFiltros(filters, NomMoneda.rawAttributes);
        const ordersArr = helpers.getOrder(orders, 'createdAt');
    
        const {rows, count} = await NomMoneda.findAndCountAll({
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

module.exports.addMoneda = async (req, resp, next) => {

    try {
        const errors = validationResult(req);
        helpers.checkValidationResults(errors);

        const {abreviatura, descripcion, tasacambio, principal} = req.body;

        // Buscando si exite una moneda con la misma abreviatura
        const existe = await NomMoneda.findOne({
            where:{
                abreviatura: abreviatura
            }
        });
        
        helpers.checkIfExist(existe, 'La moneda ya existe');

        // Si la nueva moneda es principal, pongo la principal anterior como no principal
        if(principal === true){
            await NomMoneda.quitarLaPrincipal();
        }

        const moneda = await NomMoneda.create({
            abreviatura: abreviatura,
            descripcion: descripcion,
            tasacambio: tasacambio,
            principal: principal
        });

        resp.status(201).json({
            moneda: moneda
        });

    } catch(err){
        next(err);
    }
}

module.exports.updateMoneda = async (req, resp, next) => {

    try{
        const errors = validationResult(req);
        helpers.checkValidationResults(errors);
    
        const {abreviatura, descripcion, tasacambio, principal, id} = req.body;

        const existe = await NomMoneda.findOne({
            where: {
                [Op.and]: {
                    abreviatura: abreviatura,
                    id: {
                        [Op.ne] : id
                    }                    
                }
            }
        });


        helpers.checkIfExist(existe, 'La moneda ya existe');

        // Si la nueva moneda es principal, pongo la principal anterior como no principal
        if(principal === true){
            await NomMoneda.quitarLaPrincipal();
        }

        const monedaToUpdate = await NomMoneda.findByPk(id);
        await monedaToUpdate.update({
            abreviatura: abreviatura,
            descripcion: descripcion,
            tasacambio: tasacambio,
            principal: principal
        });

        resp.status(200).json();

    }catch(err){
        next(err);
    }
}

module.exports.deleteMoneda = async (req, resp, next) => {
    const {id} = req.body;

    const deleted = await NomMoneda.destroy({
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