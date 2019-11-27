const Op = require('sequelize').Op;

/** 
 * Usado para crear los filtros dinamicos que se realizan por columnas para poner en el where del find
 * @param filters Debe recibir un formato como el que sigue:
 * {
 *      nombreColumna1: 'valor',
 *      nombreColumna2: 'valor',
 *      nombreColumnaNumerica1: [{op: '>', valor: 5}, {op: '<', valor: 30}]  // 5 < numero < 30
 *      nombreColumnaNumerica2: 25
 * }
 * @param attributes No es mas que el resultado de la llamada a la propiedad rawAttributes del modelo
*/
module.exports.getFiltros = (filters, attributes) => {

    const getFiltro = filtro => {
        const stringFilter = filtro => ({[Op.iLike]: `%${filtro.valor}%`});
            const equalFilter = filtro => ({[Op.eq]: filtro.valor});
            const numberFilter = filtro => {
                if(Array.isArray(filtro.valor)){
                    return {
                        [Op.and]: filtro.valor.reduce((acum, filt) => {
                            if(filt.op === '<'){
                                acum[Op.lt] = filt.valor;
                            }
                            if(filt.op === '>'){
                                acum[Op.gt] = filt.valor;
                            }
                            return acum;
                        }, {})
                    }
                    
                }else{
                    return {
                        [Op.eq]: filtro.valor
                    }
                }
            }

            const column = attributes[filtro.campo].type.key;
            switch(column){
                case 'STRING': return stringFilter(filtro);
                case 'INTEGER' : return numberFilter(filtro);
                case 'BIGINT' : return numberFilter(filtro);
                case 'FLOAT' : return numberFilter(filtro);
                case 'REAL' : return numberFilter(filtro);
                case 'DOUBLE' : return numberFilter(filtro);
                case 'DECIMAL' : return numberFilter(filtro);                    
                case 'BOOLEAN': return equalFilter(filtro);
                default: return equalFilter(filtro);
            }
    }
    
    const filtros = [];
    for (const key in filters) {
        filtros.push(
            {
                [key]: getFiltro({
                    campo: key,
                    valor: filters[key]
                })
            }
        );
    }

    return filtros;
}

/**
 * Usado para crear y permitir el ordenamiendo por columnas en una consulta find
 * @param orders Debe recibir parametros como el que sigue:
 * [
 *      {column: 'nombreColumna1', order: 'desc'},
 *      {column: 'nombreColumna2', order: 'asc'},
 * ]
 * @param defaltFieldToOrder='id' Es el campo por el que va a ordernar si no viene nada en el 
 * parametro orders
 * 
*/

module.exports.getOrder = (orders, defaltFieldToOrder = 'id') => {
    const ordersArr = [];
    if(!orders || orders.length === 0){
        ordersArr.push([defaltFieldToOrder,'DESC']);
    }else if(orders.length > 0){
        ordersArr.push(
            ...orders.map(o => {
                return [o.column, o.order];
            })
        );
    }
    return ordersArr;
}

/**
 * Usada para validar la entrada de datos y lanzar un error 422 en caso de que no pase la validacion
 * @param error Es el parametro obtenido de validationResult
 * @returns void
 * @throws Lanza un error
 */


module.exports.checkValidationResults = errors => {
    
    if(!errors.isEmpty()){
        const error = new Error('Invalid input');
        error.statusCode = 422;
        error.message = errors.array()[0].msg;
        error.data = errors.array();
        throw error;
    }    
}

/**
 * Usado para verificar si el objeto pasado es un objeto valido, en ese caso se lanza un error.
 * @param existe Objeto que ha sido buscado previamente en base de datos.
 * @param pesimisticMsg Mensaje que se debe enviar al front en caso de error
 * @throws Lanza un error en caso de que el @param existe sea un objeto valido
 */

module.exports.checkIfExist = (existe, pesimisticMsg) => {
    if(existe){
        const err = new Error('Already exists');
        err.statusCode = 422;
        err.message = pesimisticMsg;
        throw err;
    }
}