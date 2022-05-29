/**
 * Método que extrae "property" y "value" de la información de las propiedades
 * @param properties1, lista con información de propiedades
 * @returns {[]}
 */
exports.obtainProperties = function(properties1){
    var properties=[]

    for (let [key, value] of Object.entries(properties1)) {
        if (value.length==1){
            value2=value[0].mainsnak.datavalue.value
            if (typeof value2 === 'object'){
                if ('amount' in value2){
                    value2 = value2["amount"]
                }
            }
            property={
                "property": key,
                "value": value2
            }
        }else{
            valueList=[]
            for (i = 0;i<value.length;i++){
                value2=value[i].mainsnak.datavalue.value
                if (typeof value2 === 'object'){
                    if ('amount' in value2){
                        value2 = value2["amount"]
                    }
                }
                valueList.push(value2)
            }
            property={
                "property": key,
                "value": valueList
            }
        }

        properties.push(property)
    }
    return properties
}

/**
 * Método que agrupa la información de un tornado con la información de sus claims
 * @param tornado, información del tornado
 * @param claims, claims
 * @param labelClaims, labels de las claims
 * @param valueClaims, valores de las claims
 * @returns {*}
 */
exports.groupTornadoAndClaims = function(tornado, claims, labelClaims, valueClaims){
    claimsJson={}
    for (i=0;i<claims.length;i++){

        if (Array.isArray(claims[i].value)){
            valueList = claims[i].value
            for (j=0;j<valueList.length;j++){
                if (typeof valueList[j] === 'object'){
                    if ('entity-type' in valueList[j]) {
                        valueList[j]=valueClaims[valueList[j].id].labels.en.value
                    }
                }
                if (typeof valueList[j] === 'string' && valueList[j].includes('+')){
                    valueList[j] = valueList[j].replace('+','')
                }
                claims[i]["label"]=labelClaims[claims[i].property].labels.en.value
                claimsJson[labelClaims[claims[i].property].labels.en.value.split(" ").join("")]=claims[i]
            }
        }
        else{
            if (typeof claims[i].value === 'object'){
                if ('entity-type' in claims[i].value) {
                    claims[i].value=valueClaims[claims[i].value.id].labels.en.value
                }
            }
            if (typeof claims[i].value === 'string' && claims[i].value.includes('+')){
                claims[i].value = claims[i].value.replace('+','')
            }
            claims[i]["label"]=labelClaims[claims[i].property].labels.en.value
            claimsJson[labelClaims[claims[i].property].labels.en.value.split(" ").join("")]=claims[i]
        }
    }
    tornado["properties"]=claimsJson
    return tornado
}

/**
 * Método que devuelve la información completa de un tornado (incluyendo las claims)
 * @param idItem, id del tornado
 * @returns {Promise<*>}
 */
getInfoTornado = async(idItem)=>{
    await wikibase.getInfoTornado(idItem).then(resp=> tornado=resp.entities)
    return tornado
}