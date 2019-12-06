const createError = require('http-errors');
const Op = require('sequelize').Op;

const Rol = require('./roleModel');
const Resource = require('../resources/resoursesModel');
const User = require('../user/userModel');
const helper = require('../../../helpers/helpers');

module.exports.getActionsFromUser = async (req, resp, next) => {

    try{
        const userData = req.user;

        const rol = await Rol.findOne({
           include: [{
                model: Resource,
                as: 'RolResource'
            },{
                model: User,
                where: {
                    id: userData.userId
                }
            }
            ]
        });
        
        if(!rol){
            const error = new Error('Rol not found');
            error.statusCode = 404;
            throw error;
        }

        const actions = [...rol.RolResource];
        

        return resp.status(200).json({
            user: userData,
            rol: { id: rol.id, name: rol.name },
            actions: actions
        });

    }catch(err){
        err.statusCode = 500;
        next(err);
    }
}

module.exports.addRole = async (req, resp, next) => {
    const rolname = req.body.name;
    const roldescription = req.body.description;
    const resourceIds = req.body.resources;

    // Rol exists?
    const rol = await Rol.findOne({
        where: {
            name: rolname
    }})

    if(rol){
        return next(createError('El rol ya existe').status(422));
    }

    try{
        const newRol = await Rol.create({
            name: rolname,
            description: roldescription
        });

        if(resourceIds && Array.isArray(resourceIds) && resourceIds.length > 0){
            const resources = await Resource.findAll({
                where: {
                    id: resourceIds
                }
            });
            await newRol.addRolResource(resources);
        }
        

        resp.status(201).json({
            rol: newRol
        });

    }catch(err){
        return next(err);
    }
}

module.exports.getRoles = async (req, resp, next) => {
    
    try{
        const { filters, orders, pagination } = req.body;
        const { start, limit } = pagination;
    
        const filtros = helper.getFiltros(filters, Rol.rawAttributes);
        const arrOrders = helper.getOrder(orders, 'createdAt');
        
        const { rows, count } = await Rol.findAndCountAll({
            limit: limit,
            offset: start,
            orders: arrOrders,
            where: {
                [Op.and]: filtros
            }
        });    
           
        resp.status(200).json({
            rows: rows,
            count: count
        });
        
    } catch(err){
        next(err);
    }    
}

module.exports.addActionsToRol = async (req, resp, next) => {
    


}

