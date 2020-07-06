const mongoose = require('mongoose');										        //Vamos a llamar a moongose esta vez no para conectarnos a la base de Datos porque eso ya lo hicimos en datasabe.js sino para crear esquemas de datos
const Schema = mongoose.Schema;											            //Define la variable Schema

	let ProductoSchema = new Schema(										        // la estructura de un usuario
    {
		nombreProducto:{ type: String, require: true},
		imagenUrl:{ type: String, require: true },
		cantidadDisponible:{ type: Number, require: true },
		precioUnitario:{ type: Number, require: true },
    });
    
let ProductoModel = mongoose.model('productoHP', ProductoSchema);				 //Define el modelo del usuario		
module.exports = ProductoModel;											         //Exporta el usuario