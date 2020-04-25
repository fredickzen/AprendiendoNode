'use strict'

var validator = require('validator');
var fs = require('fs');
var path = require('path');

var Article = require('../models/article');

var controller = {

    datosCurso: (req, res) => {
        var respuesta = req.body.hola;
        return res.status(200).send({
            curso: 'Master en Node',
            autor: 'Freddy Ramos',
            url: 'sich.sl',
            port: 100,
            hola: respuesta

        });
    },
    test: (req, res) => {
        return res.status(200).send(
            {
                message: 'Soy la accion test de mi controllador de artículos'
            }
        );
    },
    save: (req, res) => {
        // Recoger parametros post

        var params = req.body;

        // Validar datos (validador)
        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);

        }
        catch (err) {
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar'
            });
        }

        if (validate_title && validate_content) {
            // Crear el objeto a guardar
            var article = new Article();

            //Asignar valores

            article.title = params.title;
            article.content = params.content;
            if (params.image) {
                article.image = params.image;    
            }
            else{
                article.image = null;    
            }
            

            // Guardar Artículo
            article.save((err, articleStored) => {

                if (err || !articleStored) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'El artículo no se ha guardado'
                    });
                }
                // Devolver una respuestas
                return res.status(200).send(
                    {
                        status: 'success',
                        article: articleStored,
                        message: 'Se ha guardado el artículo'
                    }
                );
            });
        }
        else {
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar'
            });
        }


    },
    getArticles: (req, res) => {
        var query = Article.find({});
        var last = req.params.last;
        if (last || last != undefined) {
            query.limit(5);
        }
        // FIND
        query.sort('-_id').exec((err, articles) => {
            if (err) {
                return res.status(404).send(
                    {
                        status: 'error',
                        message: 'Error al devolver artículos'
                    }
                );
            }
            if (!articles) {
                return res.status(404).send(
                    {
                        status: 'error',
                        message: 'No hay artículos'
                    }
                );
            }
            return res.status(200).send(
                {
                    status: 'success',
                    articles
                }
            );

        });

    },
    getArticle: (req, res) => {
        var articleId = req.params.id;
        if (!articleId || articleId == undefined) {
            return res.status(404).send(
                {
                    status: 'error',
                    message: 'No existe el artículo'
                }
            );
        }
        Article.findById(articleId, (err, article) => {
            if (err) {
                return res.status(500).send(
                    {
                        status: 'error',
                        message: 'Error al devolver artículo'
                    }
                );
            }
            if (!article) {
                return res.status(404).send(
                    {
                        status: 'error',
                        message: 'No existe el artículo'
                    }
                );
            }
            return res.status(200).send({
                status: 'success',
                article
            });

        });

    },
    update: (req, res) => {
        // Recoger datos
        var articleId = req.params.id;
        var params = req.body;
        // validar datos
        if (!articleId || articleId == undefined) {
            return res.status(404).send(
                {
                    status: 'error',
                    message: 'No existe el artículo'
                }
            );
        }
        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);

        }
        catch (err) {
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar'
            });
        }
        if (validate_title && validate_content) {
            // Find and update
            Article.findByIdAndUpdate({ _id: articleId }, params, { new: true },
                (err, articleUpdated) => {
                    if (err) {
                        return res.status(500).send({
                            status: 'error',
                            message: 'Error al actualizar'
                        });
                    }
                    if (!articleUpdated) {
                        return res.status(404).send({
                            status: 'error',
                            message: 'No existe el artículo'
                        });
                    }
                    return res.status(200).send(
                        {
                            status: 'success',
                            article: articleUpdated,
                            message: 'Articulo Actualizado'
                        }
                    );

                });
        }
        else {
            return res.status(500).send({
                status: 'error',
                message: 'La validación no es correcta'
            });
        }

    },
    delete: (req, res) => {
        var articleId = req.params.id;

        //Find and delete

        Article.findOneAndDelete({ _id: articleId }, (err, articleRemoved) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al eliminar'
                });
            }
            if (!articleRemoved) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el artículo'
                });
            }
            return res.status(200).send(
                {
                    status: 'success',
                    article: articleRemoved,
                    message: 'Articulo Removido'
                }
            );

        });
    },
    upload: (req, res) => {

        //Configurar modulo connec multiparty router/article.js (hecho)

        // Recoger fichero de la peticion
        if (!req.files) {
            return res.status(404).send({
                status: 'error',
                message: 'Imagen no subida'
            });
        }
        // Conseguir nombre y extentsion archivo
        var file_path = req.files.file0.path;
        var file_split = file_path.split('\\');

        // Nombre del archivo
        var file_name = file_split[2];
        // Extension del fichero
        var file_ext = (file_name.split('\.'))[1];
        // Comprobar extension, sólo imágenesm su es valida, borrar fichero
        if (file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif') {
            //Borrar archivo subido

            fs.unlink(file_path, (err) => {
                return res.status(500).send({
                    status: 'error',
                    message: 'La extensión de la imágen no es válida'
                });

            })
        }
        else {
            // Buscar artículo y asignar fichero
            var articleId = req.params.id;
            if (articleId) {
                Article.findByIdAndUpdate({ _id: articleId }, { image: file_name }, { new: true }, (err, articleUpdated) => {
                    if (err) {
                        return res.status(500).send({
                            status: 'error',
                            message: 'Error al actualizar la imágen de artículo'
                        });
                    }
                    if (!articleUpdated) {
                        return res.status(404).send({
                            status: 'error',
                            message: 'No existe el artículo'
                        });
                    }
                    return res.status(200).send(
                        {
                            status: 'success',
                            article: articleUpdated

                        }
                    );
                });
            }
            else {
                return res.status(200).send(
                    {
                        status: 'success',
                        image: file_name

                    });
            }

        }
    },
    getImage: (req, res) => {
        var file = req.params.image;
        var path_file = './upload/articles/' + file;

        fs.exists(path_file, (exists) => {
            if (exists) {
                return res.sendFile(path.resolve(path_file));
            }
            else {
                return res.status(404).send({
                    status: 'error',
                    message: 'La imagen no existe'
                });
            }
        });


    },
    search: (req, res) => {
        // Sacar string a buscar
        var searhString = req.params.search;

        //Find or 
        Article.find({
            "$or": [
                { "title": { "$regex": searhString, "$options": "i" } },
                { "content": { "$regex": searhString, "$options": "i" } }
            ]
        })
            .sort([['date', 'descending']])
            .exec((err, articles) => {
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error en la petición'
                    });
                }
                if (!articles || articles.length <= 0) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No artículos que coincidan con la búsqueda'
                    });
                }
                return res.status(200).send({
                    status: 'success',
                    articles
                });
            });


    }
}; // end controller

module.exports = controller;