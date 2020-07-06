const jwt = require('jsonwebtoken');

function compruebaToken(peticion,respuesta,next)
{
    const bearerHeader = peticion.headers['autorizacion']                                   //Valida si existe en las cabeceras de la peticiòn recibidas del navegador, una que se llama autorizaciò y la guarda en una variable
    //console.log("validaToken: ", bearerHeader)
    if (bearerHeader){                                                                      //Si existe la cabecera y no es undefined entra al condicional
        const bearer = bearerHeader.split(" ")
        const bearerToken = bearer[1]
        jwt.verify(bearerToken, 'secretKey123',(error,data) => {
            if(error){
                return respuesta.json({resultado: "El token es falso! "})
            } else {
                peticion.body.idUsuario = data._id                                                    //Agrega a la peticiòn recibida otra variable tokenID con el _id del cliente que es el que esta en mongodb y se habia guardado inicialmente en jwt.sign() cuando se autentico el cliente
                next()
            }
        })
    } else {
        respuesta.status(403).send({resultado: 'No existe token'})                              //Si no hay un token devuelve un error el middlewarey la funciòn que la llamò no se ejecutaría
    }
        
}

module.exports = {compruebaToken};