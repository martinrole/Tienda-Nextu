const mongoose = require('mongoose');										 

const CartSchema = new mongoose.Schema(										    		 // la estructura del carrito
{
	idUsuario:{ type: mongoose.Schema.Types.ObjectId, ref: 'UsuarioHP', require: true, unique: true },
	productos: [{
			idProducto: {type: mongoose.Schema.Types.ObjectId, ref: 'productoHP', unique: true},
			cantidadCarrito: Number,
	}],
	fechaModificado: { type: Date, default: Date.now }
},
{ timestamps: true });																	//Guarda la fecha de creaciòn y la última fecha de modificaciòn. SOlo funciona cuando ya lo guardó en Mongodb


module.exports = mongoose.model("Cart", CartSchema)										 //Exporta la estructura del carrito, lo hice directe a los otros dos modelos para cambiar y reducir código