'use strict'

var validator = require('validator');
var Article = require('../models/article');

var controller = {

    datosCurso: (req, resp) => {
        var respuesta = req.body.hola;
        return resp.status(200).send({
            curso: 'Master en Node',
            autor: 'Freddy Ramos',
            url: 'sich.sl',
            port: 100,
            hola: respuesta

        });
    },
    test: (req, resp) => {
        return resp.status(200).send(
            {
                message: 'Soy la accion test de mi controllador de artículos'
            }
        );
    },
    save: (req, resp) => {
        // Recoger parametros post

        var params = req.body;

        // Validar datos (validador)
        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);

        }
        catch (err) {
            return resp.status(200).send({
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
            article.image = null;

            // Guardar Artículo
            article.save((err, articleStored) => {

                if (err || !articleStored) {
                    return resp.status(404).send({
                        status: 'error',
                        message: 'El artículo no se ha guardado'
                    });
                }
                // Devolver una respuestas
                return resp.status(200).send(
                    {
                        status: 'success',
                        article: articleStored,
                        message: 'Se ha guardado el artículo'
                    }
                );
            });
        }
        else {
            return resp.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar'
            });
        }


    },
    getArticles: (req, resp) => {
        var query = Article.find({});
        var last = req.params.last;
        if (last || last != undefined) {
            query.limit(5);
        }
        // FIND
        query.sort('-_id').exec((err, articles) => {
            if (err) {
                return resp.status(404).send(
                    {
                        status: 'error',
                        message: 'Error al devolver artículos'
                    }
                );
            }
            if (!articles) {
                return resp.status(404).send(
                    {
                        status: 'error',
                        message: 'No hay artículos'
                    }
                );
            }
            return resp.status(200).send(
                {
                    status: 'success',
                    articles
                }
            );

        });

    },
    getArticle: (req, resp) => {
        var articleId = req.params.id;
        if (!articleId || articleId == undefined) {
            return resp.status(404).send(
                {
                    status: 'error',
                    message: 'No existe el artículo'
                }
            );
        }
        Article.findById(articleId, (err, article) => {
            if (err) {
                return resp.status(500).send(
                    {
                        status: 'error',
                        message: 'Error al devolver artículo'
                    }
                );
            }
            if (!article) {
                return resp.status(404).send(
                    {
                        status: 'error',
                        message: 'No existe el artículo'
                    }
                );
            }
            return resp.status(200).send({
                status: 'success',
                article
            });

        });

    },
    update: (req, resp) => {
        // Recoger datos
        var articleId = req.params.id;
        var params = req.body;
        // validar datos
        if (!articleId || articleId == undefined) {
            return resp.status(404).send(
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
            return resp.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar'
            });
        }
        if (validate_title && validate_content) {
            // Find and update
            Article.findByIdAndUpdate({_id:articleId}, params,{new:true}, 
                (err, articleUpdated) => {
                    if (err) {
                        return resp.status(500).send({
                            status: 'error',
                            message: 'Error al actualizar'
                        });
                    }
                    if (!articleUpdated) {
                        return resp.status(404).send({
                            status: 'error',
                            message: 'No existe el artículo'
                        });
                    }
                    return resp.status(200).send(
                        {
                            status: 'success',
                            article: articleUpdated,
                            message: 'Articulo Actualizado'
                        }
                    );

            });
        }
        else {
            return resp.status(500).send({
                status: 'error',
                message: 'La validación no es correcta'
            });
        }
        
    },
    delete: (req, resp) => {
        var articleId = req.params.id;

        //Find and delete

        Article.findOneAndDelete({_id:articleId}, (err, articleRemoved) =>{
            if (err) {
                return resp.status(500).send({
                    status: 'error',
                    message: 'Error al eliminar'
                });
            }
            if (!articleRemoved) {
                return resp.status(404).send({
                    status: 'error',
                    message: 'No existe el artículo'
                });
            }
            return resp.status(200).send(
                {
                    status: 'success',
                    article: articleRemoved,
                    message: 'Articulo Removido'
                }
            );

        });
    }
}; // end controller

module.exports = controller;