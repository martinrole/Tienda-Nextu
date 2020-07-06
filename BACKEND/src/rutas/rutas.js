const express = require('express');                            
const UsuarioHP = require('../modelos/usuario.js');
const jwt = require('jsonwebtoken');
const auto = require('../middlewares/autorizacion');
const router = express.Router();                                         //el método Router permite tener un objeto y después crear rutas en el servidor

router.post('/nuevoUsuario', async function(peticion,respuesta)
{
     
    const { nombre, correo, contrasena1, contrasena2 } = peticion.body
    //console.log(peticion.body) 
    //console.log(nombre, correo, contrasena1, contrasena2)
    
    if (nombre.length == 0 || correo.length == 0 || contrasena1 == 0 || contrasena2 == 0){
        respuesta.send({resultado: "NO", msg:"Ningun campo del formulario puede estar vacío", nombre, correo})
    }else if (contrasena1 != contrasena2){
        respuesta.send({resultado: "NO", msg:"Contraseñas ingresadas no son iguales", nombre, correo})
    }else if (contrasena1.length < 3){
        respuesta.send({resultado: "NO", msg:"Contraseñas debe tener al menos 3 caracteres", nombre, correo})
    }else {
        const nuevoUsuario = new UsuarioHP({usuario: nombre, correo, contrasena: contrasena1})   
        const validaCorreo = await UsuarioHP.findOne({correo: correo});                       //Busca si el correo ingresado ya existe en la base de Datos
        //console.log(validaCorreo)
        if(validaCorreo)
        {
          respuesta.send({resultado: "NO", msg: "No creado. Usuario ya existe en Database"})
        }else{             
          nuevoUsuario.contrasena = await nuevoUsuario.encriptarContrasena(contrasena1)         //Acá llamo el objeto creado y su propiedad constraseña que se capturo arriba para convertirla en encriptada diciendole que es igual al mismo usuario llamando el metodo creado en modelUsuario.js para encriptar la contraseña recibida en el FrontEnd
          //console.log("Esta es la contraseña ahora: ",nuevoUsuario.contrasena)
          await nuevoUsuario.save()                                                           //El método save manda la instruccion para que guarde los datos en MongoDB. Este proceso toma un tiempo x, pero como javascript es asincrono, debemos colocar async al principio de la funciòn y await donde debe esperar que termine para que no se sale el proceso y corra en orden
          const token = jwt.sign({_id: nuevoUsuario._id}, 'secretKey123')
          //respuesta.status(200).json({token})
          respuesta.status(200).send({resultado: "SI", msg: "Usuario creado correctamente. Ya puede iniciar sesión", token})
        }
      }
});

router.post('/login', async function(peticion, respuesta)
{
  const {email, pass} = peticion.body
  console.log(peticion)
  console.log({email,pass})
  
  if (email == null || pass == null){
    respuesta.send({resultado: "Acceso Denegado", msg:"Por favor diligenciar los dos campos para ingresar"})
  }
  else if (email.length == 0 || pass.length == 0){
    respuesta.send({resultado: "Acceso Denegado", msg:"Por favor diligenciar los dos campos para ingresar"})
  } else 
  {
    const login =  await UsuarioHP.findOne({correo: email})                       //Busca si el correo ingresado ya existe en la base de Datos
    
    if(!login)
    {
      respuesta.send({resultado: "Acceso Denegado", msg: "Correo ingresado no existe"})
    }else
    {            
      validaPass = await login.compararContrasena(pass)                                                     //Acá llamo el objeto creado (compararContrasena) y envío la constraseña recibida en el Frontend  para convertirla en encriptada y preguntar si es igual la contraseá del mismo usuario llamando el metodo creado en modelUsuario.js
      //console.log("Resultado de comparacion de contrasena: ",validaPass)
      
      if (validaPass)                                                                                       //Si la respuesta es correcta se envia un token al Frontend de identificacion
      {
        const token = jwt.sign({_id:login._id},'secretKey123')                                           //Sign(Firma) recibe el usuario y la clave secreta que es personal con la que codifica y el unico que la sabra es el creador de la PAGINA QUE LA VARIABLE DE ENTORNO    //Debo aprender como utilizar para una aplicaciòn real el secretKey dado que esta una forma generica y fija. Esto debe ser con variables
        respuesta.status(200).send({resultado: "Autorizado", msg: "Bienvenido(a) " + login.usuario, token})
      } else {
        respuesta.send({resultado: "Acceso Denegado", msg: "Contraseña ingresada incorrecta."})
      }
    }
  }
  
})

router.get('/datosPrivados', auto.verificaAutorizacion, function(peticion,respuesta){
    respuesta.status(200).send({resultado:"SI", msg:"Acceso Concedido", id: peticion.usuarioId})

})

module.exports = router; 