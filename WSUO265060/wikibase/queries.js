const WBK = require('wikibase-sdk')
const fetch = require('node-fetch');
const wbk = WBK({
    instance: 'http://156.35.98.119',
    sparqlEndpoint: 'https://query.my-wikibase-instan.se/sparql'
})
const conversor = require('./conversor.js');

/**
 * Método que obtiene información de un item de wikibase
 * @param value
 * @returns {Promise<unknown>}
 */
exports.getInfo = async(value) => {
    promise = new Promise((resolve, reject) => {
        var url = wbk.searchEntities({
            search: value,
            format: 'json',
            language: 'en',
            type: 'item'
        })

        var options = {
            method: "GET"
        };

        tornado = fetch(url, options).then(response => { return response.json()}).catch(function(error) {
            console.log('Hubo un problema con la petición Fetch:' + error.message);
            resolve(null)
        });
        resolve(tornado)
    });
    return promise
}

/**
 * Método que devuelve todos los tornados de wikibase
 * @returns {Promise<unknown>}
 */
exports.getTornados = async() => {
    promise = new Promise((resolve, reject) => {
        var url = wbk.searchEntities({
            search: 'tornado',
            format: 'json',
            language: 'en',
            type: 'item'
        })

        var options = {
            method: "GET"
        };

        tornados = fetch(url, options).then(response => { return response.json()}).catch(function(error) {
            console.log('Hubo un problema con la petición Fetch:' + error.message);
            resolve(null)
        });
        resolve(tornados)
    });
    return promise
}

/**
 * Método que devuelve información de una lista de propiedades de wikibase
 * @param properties
 * @returns {Promise<unknown>}
 */
exports.getValueClaims = async(properties) => {
    promise = new Promise((resolve, reject) => {

        idsString=""
        for (i=0;i<properties.length;i+=1){
            value2=properties[i].value
            if(Array.isArray(value2)){
                for (j=0;j<value2.length;j++){
                    if ('entity-type' in value2[j]) {
                        if (idsString!="") {
                            idsString += "|"+value2[j].id
                        }else{
                            idsString += value2[j].id
                        }
                    }
                }
            }
            else if (typeof value2 === 'object') {
                if ('entity-type' in value2) {
                    if (idsString!="") {
                        idsString += "|"+value2.id
                    }else{
                        idsString += value2.id
                    }
                }
            }

        }
        var url="http://156.35.98.119/w/api.php?action=wbgetentities&format=json&ids="+idsString
        var options = {
            method: "GET"
        };

        valueProperties = fetch(url, options).then(response => { return response.json()}).catch(function(error) {
            console.log('Hubo un problema con la petición Fetch:' + error.message);
            resolve(null)
        });
        resolve(valueProperties)
    });
    return promise
}

/**
 * Método que devuelve las claims de un tornado de wikibase
 * @param tornadoID
 * @returns {Promise<unknown>}
 */
exports.getClaims = async(tornadoID) => {
    promise = new Promise((resolve, reject) => {
        var url="http://156.35.98.119/w/api.php?action=wbgetclaims&format=json&entity="+tornadoID

        var options = {
            method: "GET"
        };

        claims = fetch(url, options).then(response => { return response.json()}).catch(function(error) {
            console.log('Hubo un problema con la petición Fetch:' + error.message);
            resolve(null)
        });
        resolve(claims)
    });
    return promise
}

/**
 * Método que devuelve las labels de una lista de propiedades de wikibase
 * @param claimsProperty
 * @returns {Promise<unknown>}
 */
exports.getLabelClaims = async(claimsProperty)=>{
    promise = new Promise((resolve, reject) => {


        var claimsPropertyString=""
        for(var i=0;i<claimsProperty.length;i+=1){
            if (i!=claimsProperty.length-1)
                claimsPropertyString+=claimsProperty[i]+"|"
            else
                claimsPropertyString+=claimsProperty[i]
        }

        var url="http://156.35.98.119/w/api.php?action=wbgetentities&props=labels&languages=en&format=json&ids="+claimsPropertyString

        var options = {
            method: "GET"
        };

        labelClaims = fetch(url, options).then(response => { return response.json()}).catch(function(error) {
            console.log('Hubo un problema con la petición Fetch:' + error.message);
            resolve(null)
        });
        resolve(labelClaims)
    });
    return promise

}

/**
 * Método que devuelve la información de una propiedad de un determinado item de wikibase
 * @param idItem
 * @param idProperty
 * @returns {Promise<unknown>}
 */
exports.getPropertyForItem = async(idItem, idProperty)=>{
    promise = new Promise((resolve, reject) => {

        var url="http://156.35.98.119/w/api.php?action=wbgetclaims&entity="+idItem+"&property="+idProperty+"&format=json"

        var options = {
            method: "GET"
        };

        property = fetch(url, options).then(response => { return response.json()}).catch(function(error) {
            console.log('Hubo un problema con la petición Fetch:' + error.message);
            resolve(null)
        });
        resolve(property)
    });
    return promise

}

/**
 * Método que devuelve información completa de un tornado (incluyendo las claims) de wikibase
 * @param idTornado
 * @returns {Promise<*>}
 */
exports.getInfoTornado = async (idTornado)=>{
    await wikibase.getClaims(idTornado).then(resp=> claimsTornado=conversor.obtainProperties(resp.claims))
    await wikibase.getValueClaims(claimsTornado).then(resp => valueClaims = resp.entities)
    await wikibase.getLabelClaims(claimsTornado.map(function(c){return c.property})).then(resp=> labelClaims=resp.entities)
    tornadoFinal=conversor.groupTornadoAndClaims(tornado, claimsTornado, labelClaims, valueClaims)
    return tornadoFinal
}

/**
 * Método que devuelve la información completa de un evento de wikibase
 * @param evento
 * @returns {Promise<void>}
 */
exports.getTypeEventValue = async (evento)=>{
    await wikibase.getInfo(evento).then(resp=> evento=resp.search[0])
    await wikibase.getPropertyForItem(evento.id,"P25").then(resp=>typeEventId = resp.claims.P25[0].mainsnak.datavalue.value.id)
    await wikibase.getInfo(typeEventId).then(resp=> typeEventValue=resp.search[0].label)
    return typeEventValue
}

