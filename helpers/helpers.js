const Op = require('sequelize').Op;

/* Usado para crear los filtros dinamicos que se realizan por columnas para poner en el where del find
 * Debe recibir un formato como el que sigue:
 * {
 *      nombreColumna1: 'valor',
 *      nombreColumna2: 'valor',
 *      nombreColumnaNumerica1: [{op: '>', valor: 5}, {op: '<', valor: 30}]  // 5 < numero < 30
 *      nombreColumnaNumerica2: 25
 * }
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

/*
 * Usado para crear y permitir el ordenamiendo por columnas en una consulta find
 * Debe recibir parametros como el que sigue:
 * [
 *      {column: 'nombreColumna1', order: 'desc'},
 *      {column: 'nombreColumna2', order: 'asc'},
 * ]
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

module.exports.checkValidationResults = errors => {
    
    if(!errors.isEmpty()){
        const error = new Error('Invalid input');
        error.statusCode = 422;
        error.message = errors.array()[0].msg;
        error.data = errors.array();
        throw error;
    }    
}

module.exports.checkIfExist = (existe, pesimisticMsg) => {
    if(existe){
        const err = new Error('Already exists');
        err.statusCode = 422;
        err.message = pesimisticMsg;
        throw err;
    }
}