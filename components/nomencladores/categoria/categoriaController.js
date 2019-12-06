const { validationResult } = require('express-validator');
const NomCategoria = require('./categoriaModel');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const helpers = require('../../../helpers/helpers');

module.exports.addCategoria = async (req, resp, next) => {

    try{
        const {
            nombre, descripcion, color, orden
        } = req.body;
    
        const errors = validationResult(req);
        helpers.checkValidationResults(errors);
    
        const categoria = await NomCategoria.findOne({
            where: {
                nombre: {
                    [Op.iLike]: nombre
                }
            }
        });
    
        helpers.checkIfExist(categoria, 'La categoria ya existe');
    
        await NomCategoria.update({
            orden: Sequelize.literal('orden + 1')
        }, {
            where: {
                orden: {
                    [Op.gte]: orden
                }
            }
        });
    
        const newCategoria = await NomCategoria.create({
            nombre: nombre,
            descripcion: descripcion,
            color: color,
            orden: orden
        });

        resp.status(201).json({
            categoria: newCategoria
        });


    }catch(err){
        next(err);
    }
}

module.exports.getCategorias = async (req, resp, next) => {
    try{
        
        const {pagination, filters, orders} = req.body;
        const {start, limit} = pagination;

        const filtros = helpers.getFiltros(filters, NomCategoria.rawAttributes);
        const ordersArr = helpers.getOrder(orders, 'createdAt');

        const categorias = await NomCategoria
            .findAndCountAll({
                limit: limit,
                offset: start,
                order: ordersArr,
                where: {
                    [Op.and]: filtros
                },
                
            });
        
        resp.status(200).json({
            rows: categorias.rows,
            count: categorias.count
        });
    }catch(err){
        next(err);
    }
}

module.exports.deleteCategoria = async (req, resp, next) => {

    try{
        const id = req.body.id;

        await NomCategoria.update({
            orden: Sequelize.literal('orden - 1')
        }, {
            where: {
                orden: {
                    [Op.gt]: Sequelize.literal(`(SELECT orden FROM mod_nomencladores.nom_categoria where id=${id})`)
                }
            }
        });
        
        const deleted = await NomCategoria.destroy({
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
    
    } catch (err) {
        next(err);
    }
    
}

module.exports.updateCategoria = async (req, resp, next) => {
    try{
        const {
            nombre, descripcion, color, orden, id
        } = req.body;
    
        const errors = validationResult(req);
        helpers.checkValidationResults(errors);
    
        const categoria = await NomCategoria.findOne({
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
    
        helpers.checkIfExist(categoria, 'La categoria ya existe');
    
        const categoriaToUp = await NomCategoria.findOne({
            where: {
                id: id
            }
        });

        const oldOrden = categoriaToUp.orden;
        if(oldOrden > orden){
            // aumentar 1 a los que estan menores que el orden viejo y mayores que el orden nuevo
            await NomCategoria.update({
                orden: Sequelize.literal('orden + 1')
            },{
                where: {
                    [Op.and]: {
                        orden: {
                            [Op.lt]: oldOrden,
                            [Op.gte]: orden
                        }
                    }
                }
            });
        }else if(oldOrden < orden){
            //disminuir 1 a los que estan mayores que el orden viejo y menores que orden nuevo
            await NomCategoria.update({
                orden: Sequelize.literal('orden - 1')
            },{
                where: {
                    [Op.and]: {
                        orden: {
                            [Op.gt]: oldOrden,
                            [Op.lte]: orden
                        }
                    }
                }
            });
        }
        
        await categoriaToUp.update({
            nombre: nombre,
            descripcion: descripcion,
            orden: orden,
            color: color
        });
        

        resp.status(200).json({
            categoria: categoriaToUp
        });


    }catch(err){
        next(err);
    }
}