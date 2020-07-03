'use strict'

var mongoose = require('mongoose');
var app = require('./src/app');
var port = 3000;

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://127.0.0.1:27017/TwitterApi', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true},)
.then(()=>{
    console.log('Conexion a la base de datos correcta');
    console.log('Utilizando el puerto: ' + port);
    app.listen(port, ()=>{
        console.log('Servidor de express corriendo');
    });
}).catch(err=>{
    console.log('Error al conectarse a la base de datos');
})  