'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 3900;

mongoose.connect('mongodb://localhost:27017/api_rest_blog',{useNewUrlParser:true, useUnifiedTopology: true})
.then(()=>{
    console.log('La conexión a la base de datos se ha realizado xd');
    
    //Crear servidor y ponerme a escuchar peticiones HTTP
    app.listen(port, () =>
    {
        console.log('Servidor corriendo en http://localhost:'+port);

    });
});
