const Op = require('sequelize').Op;

const { validationResult } = require('express-validator');

const NomProveedor = require('./proveedorModel');
const helpers = require('../../../helpers/helpers');

module.exports.getProveedores = async (req, resp, next) => {
    try{
        const { filters, orders, pagination } = req.body;
        const {start, limit} = pagination;
        
        const filtros = helpers.getFiltros(filters, NomProveedor.rawAttributes);
        const ordersArr = helpers.getOrder(orders, 'createdAt');
    
        const {rows, count} = await NomProveedor.findAndCountAll({
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

module.exports.addProveedor = async (req, resp, next) => {

    try {
        const errors = validationResult(req);
        helpers.checkValidationResults(errors);

        const {nombre, descripcion, telefono, correo, sitioweb} = req.body;

        const existe = await NomProveedor.findOne({
            where:{
                nombre: {
                    [Op.iLike]: nombre
                }
            }
        });
        
        helpers.checkIfExist(existe, 'El proveedor ya existe');

        const proveedor = await NomProveedor.create({
            nombre: nombre,
            descripcion: descripcion,
            telefono: telefono,
            correo: correo,
            sitioweb: sitioweb
        });

        resp.status(201).json({
            proveedor: proveedor
        });

    } catch(err){
        next(err);
    }
}

module.exports.updateProveedor = async (req, resp, next) => {

    try{
        const errors = validationResult(req);
        helpers.checkValidationResults(errors);
    
        const {nombre, descripcion, telefono, correo, sitioweb, id} = req.body;

        const existe = await NomProveedor.findOne({
            where:{
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

        helpers.checkIfExist(existe, 'El proveedor ya existe');

        
        const proveedorToUpdate = await NomProveedor.findByPk(id);
        await proveedorToUpdate.update({
            nombre: nombre,
            descripcion: descripcion,
            telefono: telefono,
            correo: correo,
            sitioweb: sitioweb
        });

        resp.status(200).json();

    }catch(err){
        next(err);
    }
}

module.exports.deleteProveedor = async (req, resp, next) => {
    const {id} = req.body;

    const deleted = await NomProveedor.destroy({
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