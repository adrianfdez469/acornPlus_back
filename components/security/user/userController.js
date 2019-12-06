const { validationResult } = require('express-validator');
const Op = require('sequelize').Op;
const bcrypt = require('bcryptjs');

const User = require('./userModel');
const Rol = require('../role/roleModel');
const helpers = require('../../../helpers/helpers');

module.exports.getUsers = async (req, resp, next) => {
    try {
        
        const {filters, orders, pagination} = req.body;
        const { start, limit } = pagination;

        const rolFilter = (filters['rol.name']) ? {
            name: {
                [Op.iLike]: `%${filters['rol.name']}%`
            }
        } : null;

        const filtros = helpers.getFiltros(filters, User.rawAttributes);

        const arrOrder = helpers.getOrder(orders, 'createdAt');

        const {rows, count} = await User.findAndCountAll({
            attributes: {
                exclude: ['password']
            },
            raw: true,
            include: [{
                model: Rol,
                attributes: ['name'],
                where: rolFilter                
            }],
            offset: start,
            limit: limit,
            order: arrOrder,
            where: {
                [Op.and]: filtros
            }
        });


        resp.status(200).json({
            rows: rows,
            count: count
        });
        

    } catch (error) {
        next(error);
    }
}

module.exports.addUser = async (req, resp, next) => {
    try{

        const errors = validationResult(req);
        helpers.checkValidationResults(errors);

        const { name, password, rolId } = req.body;
        
        const exists = await User.findOne({
            where: {
                name: {
                    [Op.iLike]: name
                }
            }
        });
        helpers.checkIfExist(exists, 'El usuario ya existe');

        const hashPass = await bcrypt.hash(password, 12);
        const user = await User.create({
            name: name,
            password: hashPass,
            rolId: rolId
        });

        resp.status(201).json({
            user: user
        });

    } catch(err){
        next(err);
    }
}
/*
module.exports.updateUser = (req, resp, next) => {
    try {
        
        const error = validationResult(req);
        helpers.checkValidationResults(error);

        const {nombre} = 

    } catch (error) {
        next(error);
    }
}*/

