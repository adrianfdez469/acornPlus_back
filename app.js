const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const sequelize = require('./utils/db/sequelizeConf');
const dbInit =require('./utils/db/dbInitialization');

const io = require('./socket');

const app = express();



app.use(logger('dev'));
app.use(express.json());

app.use( ( req, resp, next ) => {
  // Para liminar el origen de los dominios que pueden utilizar el REST-API
  resp.setHeader( 'Access-Control-Allow-Origin', '*' );
  // Para limitar los tipos de metodos a los que pueden acceder los origenes precios especificados
  resp.setHeader( 'Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE' );
  // Para limiar los headers que pueden brindar los clientes que consumen la TEST-API
  resp.setHeader( 'Access-Control-Allow-Headers', 'Content-Type, Authorization' );
  if(req.method === 'OPTIONS')
    return resp.status(200).json();
  next();
} )

const routers = require('./components/componentsRoutes');
app.use('/', routers);


app.post('/notificacion', (req, resp, next) => {
  io.getIo().emit('mapa', { action: 'notificar', id: req.body.id});
  resp.status(200).json({
    message: 'OK'
  });
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
/*
app.use(function(err, req, res, next) {
  console.log(err);
  return res.status(err.status || 500).json({
    error: err.message || err.errorMsg
  });
});*/
app.use( ( error, req, resp, next ) => {
  console.log('----> ', error );
  if(error.statusCode && error.message){
    const status = error.statusCode;
    const message = error.message;
    resp.status( status ).json( {
        message: message,
        data: error.data
    } );
  }else{
    resp.status( 500 ).json();
  }
  
} );


sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
    dbInit({
      syncOptions: {
        force: true
      }
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = app;
