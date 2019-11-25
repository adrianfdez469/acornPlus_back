const bcrypt = require('bcryptjs');
const sequelize = require('./sequelizeConf');

const User = require('../../components/security/user/userModel');
const Rol = require('../../components/security/role/roleModel');
const Resource = require('../../components/security/resources/resoursesModel');

const setDbRelations = () => {

    Rol.hasMany(User);
    User.belongsTo(Rol);
    
    Rol.belongsToMany(Resource, {as: 'RolResources', through: 'rolresourses'});
    Resource.belongsToMany(Rol, {as: 'RolResources', through: 'rolresourses'});
}

const syncrhonizeDb = async options => {
    await sequelize.sync(options);
}

const populateDb = async () => {
    const resources = await Resource.bulkCreate([
        {id: 1000, name: 'Seguridad', nameid: 'seg' },
            {id: 1001, name: 'Getionar usuarios', nameid: 'nom_usuario', parentid: 1000},
            {id: 1002, name: 'Gestionar roles', nameid: 'nom_rol', parentid: 1000},

        {id: 2000, name: 'Nomencladores', nameid: 'nom' },
            {id: 2001, name: 'Categorias', nameid: 'nom_categoria', parentid: 2000},
            {id: 2002, name: 'Monedas', nameid: 'nom_moneda', parentid: 2000},
            {id: 2003, name: 'Almacenes', nameid: 'nom_almacen', parentid: 2000},
            {id: 2004, name: 'Tipo de descuentos', nameid: 'nom_tipodescuento', parentid: 2000},

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