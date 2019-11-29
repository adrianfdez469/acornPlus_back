const Op = require('sequelize').Op;
const { validationResult } = require('express-validator');
const NomCliente = require('./clienteModel');
const helpers = require('../../../helpers/helpers');

module.exports.addCliente = async (req, resp, next) => {

    try{

        const errors = validationResult(req);
        helpers.checkValidationResults(errors);

        const {nombre, descuento, descripcion, telefono, correo, direccion, nombreempresa} = req.body;

        const existe = await NomCliente.findOne({
            where: {
                nombre: {
                    [Op.iLike]: nombre
                }
            }
        });
        helpers.checkIfExist(existe, 'El cliente ya existe');

        const cliente  = await NomCliente.create({
            nombre: nombre,
            descuento: descuento,
            descripcion: descripcion,
            telefono: telefono,
            correo: correo,
            direccion: direccion,
            nombreempresa: nombreempresa
        });

        resp.status(201).json({
            cliente: cliente
        });

    }catch(err){
        next(err);
    }
}

module.exports.getClientes = async (req, resp, next) => {

    try {
        const { filters, orders, pagination } = req.body;
        const { start, limit } = pagination;
    
        const filtros = helpers.getFiltros(filters, NomCliente.rawAttributes);
        const arrOrders = helpers.getOrder(orders, 'createdAt');
    
        const { rows, count } = await NomCliente.findAndCountAll({
            offset: start,
            limit: limit,
            order: arrOrders,
            where: {
                [Op.and]: filtros
            }
        });
    
        resp.status(200).json({
            rows: rows,
            count: count
        });
    }catch (err){
        next(err);
    }
}

module.exports.updateCliente = async (req, resp, next) => {

    try{

        const errors = validationResult(req);
        helpers.checkValidationResults(errors);

        const {nombre, descuento, descripcion, telefono, correo, direccion, nombreempresa, id} = req.body;

        const existe = await NomCliente.findOne({
            where: {
                [Op.and]: {
                    nombre: {
                        [Op.iLike]: nombre
                    },
                    id: {
                        [Op.ne]: id
                    }
                }
            }
        });
        helpers.checkIfExist(existe, 'El cliente ya existe');

        const clienteToUpdate = await NomCliente.findByPk(id);

        await clienteToUpdate.update({
            nombre: nombre,
            descuento: descuento,
            descripcion: descripcion,
            telefono: telefono,
            correo: correo,
            direccion: direccion,
            nombreempresa: nombreempresa
        });

        resp.status(200).json({
            cliente: clienteToUpdate
        });

    } catch(err){
        next(err);
    }
}

module.exports.deleteCliente = async (req, resp, next) => {
    try{

        const id = req.body.id;

        const deleted = await NomCliente.destroy({
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

    }catch(err){
        next(err);
    }
}