'use strict'

// Cargar modulos de node para crear servidor

var express = require('express');
var bodyParse = require('body-parser');


// Ejecutar express (http)

var app = express()

// Cargar ficheros de ruta

var article_routes= require('./routes/article');

// Middlewares

app.use(bodyParse.urlencoded({extended:false}));
app.use(bodyParse.json());

// CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

// Añadir prefijos o rutas

// Ruta o metodo de prueba para API REST

app.use('/api', article_routes);

// Exportar modulo (fichero actual)

module.exports = app;



































// Ruta o metodo de prueba para API REST

//Codigo cochino


// app.post('/probando', (req, resp) => {
//     return resp.status(200).send(`
//         <ul>
//             <li>Hola</li>
//         </ul>
    
//     `);
//     var respuesta= req.body.hola;
//     return resp.status(200).send({
//         curso: 'Master en Node',
//         autor: 'Freddy Ramos',
//         url: 'sich.sl',
//         port: 100,
//         hola:respuesta

//     });
// });