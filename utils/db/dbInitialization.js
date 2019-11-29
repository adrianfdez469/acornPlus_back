const bcrypt = require('bcryptjs');
const sequelize = require('./sequelizeConf');

const User = require('../../components/security/user/userModel');
const Rol = require('../../components/security/role/roleModel');
const Resource = require('../../components/security/resources/resoursesModel');

const setDbRelations = () => {

    Rol.hasMany(User);
    User.belongsTo(Rol);
    
    Rol.belongsToMany(Resource, {as: 'RolResource', through: 'seg_rolresourse'});
    Resource.belongsToMany(Rol, {as: 'RolResource', through: 'seg_rolresourse'});
}

const syncrhonizeDb = async options => {
    try{
        await sequelize.sync(options);
        //await sequelize.sync({alter: true});
    }catch (err){
        await sequelize.dropAllSchemas();
        await sequelize.createSchema('mod_seguridad');
        await sequelize.createSchema('mod_nomencladores');
        await sequelize.sync({force: true});
    }
    
}

const populateDb = async () => {
    const resources = await Resource.bulkCreate([
        {id: 1000, name: 'mod_seguridad', nameid: 'seg' },
            {id: 1001, name: 'Getionar usuarios', nameid: 'nom_usuario', parentid: 1000},
            {id: 1002, name: 'Gestionar roles', nameid: 'nom_rol', parentid: 1000},

        {id: 2000, name: 'Nomencladores', nameid: 'nom' },
            {id: 2001, name: 'Categorias', nameid: 'nom_categoria', parentid: 2000},
            {id: 2002, name: 'Monedas', nameid: 'nom_moneda', parentid: 2000},
            {id: 2003, name: 'Almacenes', nameid: 'nom_almacen', parentid: 2000},
            {id: 2004, name: 'Tipo de descuentos', nameid: 'nom_tipodescuento', parentid: 2000},
            {id: 2005, name: 'Unidad de medidas', nameid: 'nom_unidadmedida', parentid: 2000},
            {id: 2006, name: 'Proveedores', nameid: 'nom_proveedor', parentid: 2000},
            {id: 2007, name: 'Clientes', nameid: 'nom_cliente', parentid: 2000},

        {id: 3000, name: 'Configuracion', nameid: 'conf' }


    ]);

    const rol = await Rol.create({
        id: 1,
        name: 'Administrador',
        description: 'Rol del administrador del sistema'
    });

    await rol.addRolResource(resources.map(res => res.id));
    
    const hashpass = await bcrypt.hash('admin', 12);
    const user = await User.create({
        id: 1,
        name: 'admin',
        password: hashpass
    });
    
    await rol.addUser(user);
}

const initDb = async params => {
    await setDbRelations();
    await syncrhonizeDb(params.syncOptions);
    if(params.syncOptions.force){
        await populateDb();
    }
}

module.exports = initDb;