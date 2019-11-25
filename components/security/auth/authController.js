const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')

const secrets = require('../../../utils/secrets/secrets.json');

const User = require('../user/userModel');


module.exports.IsAuthenticated = (req, resp, next) => {
    
    const authHeader = req.get('Authorization');
    
    const token = authHeader.split(' ')[1];
    if(!token){
        const error = new Error('Not authenticated!');
        error.statusCode = 401;
        error.message = 'Por favor inicie sesión.';
        throw error;
    }
    
    
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, secrets.JWT_SECRET);
    } catch(err) {
        console.log(err);
        err.statusCode = 401;
        err.message = 'Ha ocurrido un error interno';
        throw err;
    }

    if(!decodedToken){
        const error = new Error('Not authenticated!');
        error.statusCode = 401;
        throw error;
    }
    
    req.user = decodedToken;
    next();

}



module.exports.Login = async (req, resp, next) => {
    try {
        const userName = req.body.userName;
        const password = req.body.password;
        let error = false;
        // Verification of user and password
        const user = await User.findOne({
            where: {
                name: userName
            }
        });

        if(!user){
            const error = new Error('Invalid credentials');
            error.statusCode = 422;
            error.message = 'Credenciales inválidas';
            throw error;
        }

        if(!bcrypt.compareSync(password, user.password)){
            const error = new Error('Invalid credentials');
            error.statusCode = 422;
            error.message = 'Credenciales inválidas';
            throw error;
        }

        const userObj = {
            userId: user.id,
            username: user.name
        }

        const segundosHora = 3600;
        const cantidadHorasDia = 24;
        const tokenExpTimeSeconds = segundosHora * cantidadHorasDia;
        const userToken = jwt.sign(userObj, secrets.JWT_SECRET, {
            expiresIn: tokenExpTimeSeconds
        });
        resp.status(200).json({
            user: {
                ...userObj, 
                token: userToken, 
                tokenExpiresIn: tokenExpTimeSeconds
            }
        });
    }catch(err){
        next(err);
    }
}



module.exports.createUser = async (req, resp, next) => {
    try {
        const username = req.body.user;
        const password = req.body.password;

        /*
            TODO
            Validators
        */

        const existingUser = await User.findOne({
            where: {
                name: username
            }
        });
        
        if(existingUser){
            const error = new Error('User in use');
            error.statuCode = 422;
            error.message = 'Usuario en uso'
            throw error;
        }

        const hashPass = bcrypt.hashSync(password, 12);
        const newUser = await User.create({
            name: username,
            password: hashPass
        });

        resp.status(201).json({
            userId: newUser.id
        });
    }catch(err){
        next(err);
    }

}

