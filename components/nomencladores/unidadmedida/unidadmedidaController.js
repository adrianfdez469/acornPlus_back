const Op = require('sequelize').Op;

const { validationResult } = require('express-validator');
const helpers = require('../../../helpers/helpers');

const NomUnidadMedida = require('./unidadmedidaModel');

module.exports.getUnidades = async (req, resp, next) => {
    
    try{
    
        const { filters, orders, pagination } = req.body;
        const { limit, start } = pagination;

        const filtros = helpers.getFiltros(filters, NomUnidadMedida.rawAttributes);
        const orderArray = helpers.getOrder(orders, 'createdAt');

        const {rows, count} = await NomUnidadMedida.findAndCountAll({
            offset: start,
            limit: limit,
            where: {
                [Op.and]: filtros
            },
            order: orderArray
        });

        resp.status(200).json({
            rows: rows,
            count: count
        });


    } catch(err){
        next(err);
    }

}

module.exports.addUnidadmedida = async (req, resp, next) => {
    try {
        
        const errors = validationResult(req);
        helpers.checkValidationResults(errors)

        const { nombre, abreviatura } = req.body;

        const existe = await NomUnidadMedida.findOne({
            where: {
                [Op.or]: {
                    nombre: {[Op.iLike]: nombre},
                    abreviatura: {[Op.iLike]: abreviatura}
                }
            }
        });

        helpers.checkIfExist(existe, 'La unidad de medida ya existe');

        const unidadmedida = await NomUnidadMedida.create({
            nombre: nombre,
            abreviatura: abreviatura
        });

        resp.status(201).json({
            unidadmedida: unidadmedida
        });

    } catch (err) {
        next(err);
    }
}

module.exports.updateUnidadmedida = async (req, resp, next) => {

    try{
        const errors = validationResult(req);
        helpers.checkValidationResults(errors);
    
        const { nombre, abreviatura, id } = req.body;

        const existe = await NomUnidadMedida.findOne({
            where: {
                [Op.and]: {
                    [Op.or]: {
                        nombre: {[Op.iLike]: nombre},
                        abreviatura: {[Op.iLike]: abreviatura}
                    },
                    id: {
                        [Op.ne]: id
                    }
                }
                
            }
        });

        helpers.checkIfExist(existe, 'La unidad de medida ya existe');


        const unidadmedidaToUpdate = await NomUnidadMedida.findByPk(id);
        await unidadmedidaToUpdate.update({
            nombre: nombre,
            abreviatura: abreviatura
        });

        resp.status(200).json();

    }catch(err){
        next(err);
    }
}

module.exports.deleteUnidadmedida = async (req, resp, next) => {
    const {id} = req.body;

    const deleted = await NomUnidadMedida.destroy({
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

