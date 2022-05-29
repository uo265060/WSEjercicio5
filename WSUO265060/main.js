// Módulos
const Hapi = require('@hapi/hapi');
const routes = require("./routes.js");
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const wikibase = require('./wikibase/queries')


// Servidor
const server = Hapi.server({
    port: 8080,
    host: 'localhost',
});


server.method({
    name: 'getWikibase',
    method: () => {
        return wikibase;
    },
    options: {}
});


const iniciarServer = async () => {
    try {
        await server.register(Inert);
        await server.register(Vision);
        await server.register(routes);
        await server.views({
            engines: {
                html: require('handlebars')
            },
            relativeTo: __dirname,
            path: './views',
            context : {
                sitioWeb: "tornados - UO265060"
            }
        });
        await server.start();
        console.log('Servidor localhost:8080');
    } catch (error) {
        console.log('Error '+error);
    }
};

iniciarServer();
