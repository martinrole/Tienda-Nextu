const jwt = require('jsonwebtoken');

function verificaAutorizacion(peticion,respuesta,next){
    //console.log(peticion.headers.autorizacion)
    if (!peticion.headers.autorizacion){
        return respuesta.status(403).send({resultado: "Acceso Denegado"})
    }

    const token = peticion.headers.autorizacion.split(" ")[1]           //el split separa por el caracter especificado. En este caso es por un espacio dado que el header autorizacion tiene dos datos, una palabra Bearer y el token. Como solo quiero es token coloco[1]

    //Valida el token:
    if (token === 'null') {
        return respuesta.status(403).send({resultado: "Acceso Denegado 2"})
    }

    const payload = jwt.decode(token,"secretKey123")                //Se llama payload porque es un objeto el contenido que está edentro del token
    //console.log(payload)
    
    //Envia datos:
    peticion.usuarioId = payload._id
    //console.log("El dato es: ", peticion.usuarioId)
    next()
}

module.exports = {verificaAutorizacion}                         //No se porque si no le coloco corchetes se daña si en el video: https://www.youtube.com/watch?v=w8It1NHeGps al man si le sirve normal 