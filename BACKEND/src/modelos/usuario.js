var bcrypt = require('bcryptjs');
const mongoose = require('mongoose');										 //Vamos a llamar a moongose esta vez no para conectarnos a la base de Datos porque eso ya lo hicimos en datasabe.js sino para crear esquemas de datos
const Schema = mongoose.Schema;											     //Define la variable Schema

const UserSchema = new Schema(										     // la estructura de un usuario
{
	usuario:{ type: String, require: true, lowercase: true },
	correo:{ type: String, require: true, unique: true },
	contrasena:{ type: String, require: true, select: true},			//select sirve para que se muestre por ejemplo en consola o no se muestre cuando se consulten los datos
	signupDate: {type: Date, default: Date.now()},
},
{
	timestamps: true													//Guarda la fecha de creaciòn y la última fecha de modificaciòn. SOlo funciona cuando ya lo guardó en Mongodb
});


UserSchema.methods.encriptarContrasena = async function(contrasenaIngresada)								//Este proceso es asincrono dado que se tarde un tiempo en encriptar la contrasena
										{
											var salt = await bcrypt.genSalt(10);				//El método genSalt sirve para decir cuantas veces se aplicarà el algoritmo de códificaciòn de la contraseña. Generalmente es genSalt(10) que no consume tantos recursos
											var hash = bcrypt.hash(contrasenaIngresada, salt);			//Acà se llama la encriptaciòn y se còdifica la contraseña ingresada por el usuario
											return hash;											//Contraseña ya codificada
										};

UserSchema.methods.compararContrasena = async function(contrasenaIngresada)							//ESTO SE DEBE MEJORAR SI SE HACE UNA APLICACIÒN, DADO QUE HAY UN METODO CON MAYOR FUERZA DE SEGURIDAD, ESTE ES DE UN VIDEO. REVISAR DOCUMENTACION DE BCRYPT
										{
											return await bcrypt.compare(contrasenaIngresada, this.contrasena);
										};


let UsuarioModel = mongoose.model('UsuarioHP', UserSchema);				 //Define el modelo del usuario. Pide 2 parametros, los datos a ingresar y el esquema donde se va ingresar	
module.exports = UsuarioModel;											 //Exporta el usuario