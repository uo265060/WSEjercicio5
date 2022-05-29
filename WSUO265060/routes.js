const conversor = require('./wikibase/conversor.js');

module.exports = {
    name: 'MiRouter',
    register: async (server, options) => {
        wikibase = server.methods.getWikibase();
        server.route([
            {
                method: 'GET',
                path: '/{param*}',
                handler: {
                    directory: {
                        path: './public'
                    }
                }
            },
            {
                method: 'GET',
                path: '/tornadosmap',
                handler: async (req, h) => {
                    await wikibase.getTornados().then(resp=> tornadosObtenidos=resp.search)

                    tornadosWithClaims=[]
                    for (var i=0;i<tornadosObtenidos.length;i+=1){
                        tornado = tornadosObtenidos[i]
                        await wikibase.getInfoTornado(tornado.id).then(resp => tornadoFinal = resp)
                        tornadosWithClaims.push(conversor.groupTornadoAndClaims(tornado, claimsTornado, labelClaims, valueClaims))
                    }

                    if (tornadosWithClaims[0].id=="Q5"){
                        tornadosWithClaims.splice(0, 1);
                    }


                    return h.view('tornadosmap',
                        {
                            tornados: tornadosWithClaims
                        });
                }
            },
            {
                method: 'GET',
                path: '/tornado/{id}',
                handler: async (req, h) => {
                    // Obtenemos la información del tornado
                    await wikibase.getInfo(req.params.id).then(resp=> tornado=resp.search[0])
                    await wikibase.getInfoTornado(tornado.id).then(resp => tornadoFinal = resp)

                    // Obtenemos la información de los eventos del tornado:
                    events=[]
                    if ('hasEvents' in tornadoFinal.properties){
                        hasEvents = tornadoFinal.properties.hasEvents.value
                        if (Array.isArray(hasEvents)){
                            // Hay más de un evento
                            for (i=0;i<hasEvents.length;i++){
                                await wikibase.getTypeEventValue(hasEvents[i]).then(resp=>typeEventValue=resp)
                                events.push({"event":hasEvents[i], "typeEvent":typeEventValue})
                            }
                        }else{
                            // Solo hay un evento
                            await wikibase.getTypeEventValue(hasEvents).then(resp=>typeEventValue=resp)
                            events.push({"event":hasEvents,"typeEvent":typeEventValue})
                        }
                    }
                    return h.view('tornado',
                        {
                            tornado: tornadoFinal,
                            events: events
                        });
                }
            },
            {
                method: 'GET',
                path: '/',
                handler: async (req, h) => {
                    await wikibase.getTornados().then(resp=> tornadosObtenidos=resp.search)

                    tornadosWithClaims=[]
                    for (var i=0;i<tornadosObtenidos.length;i+=1){
                        tornado = tornadosObtenidos[i]
                        await wikibase.getInfoTornado(tornado.id).then(resp => tornadoFinal = resp)
                        tornadosWithClaims.push(conversor.groupTornadoAndClaims(tornado, claimsTornado, labelClaims, valueClaims))
                    }

                    if (tornadosWithClaims[0].id=="Q5"){
                        tornadosWithClaims.splice(0, 1);
                    }

                    return h.view('index',
                        {
                            tornados: tornadosWithClaims
                        });
                }
            }
        ])
    }
}
