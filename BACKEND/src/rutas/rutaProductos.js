const express = require('express');                            
const ProductosHP = require('../modelos/productos.js');
const Carrito = require('../modelos/carrito')
const router = express.Router();                                            //el método Router permite tener un objeto y después crear rutas en el servidor
const baseProductos = require('../../baseProductos.json');                   //Se importa el archivo con la base de Productos para anexarla a mongo cuando se ejecuta por primera vez la base
const validaToken = require('../middlewares/validaToken');                   //Middleware del token 


//Inventario inicial: (Carga el archivo baseProductos.json a mongodb)
router.get('/inventarioInicial', async function(peticion,respuesta)
{
    const productos = await ProductosHP.find()

    if(productos.length != 0){
        //console.log("Base Productos no está vacío: ", productos)
        respuesta.send({resultado: "OK", msg:"baseProductos.json ya existia"})
    }else {
        //console.log("Base Productos vacio: ", productos)

        for (var i=0; i<baseProductos.length; i++){
            const insertaProductos = new ProductosHP(baseProductos[i])
            await insertaProductos.save()    
        }
        respuesta.send({resultado: "OK", msg:"Se cargaron los productos correctamente"})
    }
});


//Actualiza el inventario:(No se implementò en el Frontend pero si debería existir en la realidad)
router.post('/actualizaInventario', async function(peticion,respuesta)
{
    const { nombreProducto, imagenUrl, cantidadDisponible, cantidadComprada, precioUnitario } = peticion.body
    const insertaProductos = new ProductosHP({nombreProducto,imagenUrl,cantidadDisponible,cantidadComprada,precioUnitario})
    await insertaProductos.save()
    respuesta.send({resultado: "OK", msg:"Se cargaron los productos correctamente"}) 

});

//Envia la cantidad de productos en cesta para mostrar en el encabezado
router.get('/cantidadProductos',validaToken.compruebaToken ,async function(peticion,respuesta)
{
    const datos = peticion.body
    idUsuario = datos.idUsuario

    let consulta = await Carrito.findOne({idUsuario})

    if (consulta !=null){
        consulta = consulta.productos
        const resultado = consulta.length
        respuesta.status(200).send(""+resultado)                                    //Le pongo dos comillas adelante dado que el método .send no puede recibir un solo numero porque lo confunde como un status, entonces estas dos comillas adeltante se concatenan para que se vaya como un string    
    }else{
        respuesta.status(200).send("0")
    }
});

//cargaProductos en página web con el inventario disponible
router.get('/cargueProductos', async function(peticion,respuesta)
{
    const productos = await ProductosHP.find()
    var productosArreglo = productos.map(function(campo)                //La función map recorre cada registro de json encontrado y los coloca en un arreglo para luego mandar al Frontend
    {
        return {idProducto: campo._id, nombreProducto: campo.nombreProducto,imagenUrl: campo.imagenUrl,cantidadDisponible: campo.cantidadDisponible,precioUnitario: campo.precioUnitario}
    })
    //console.log(productosArreglo)
    //respuesta.send({resultado: "OK", productosArreglo}) 
    respuesta.send(productosArreglo) 
});

//Asigna productos a carritos a un usuario:
router.post('/agregaCarrito', validaToken.compruebaToken, async function(peticion,respuesta)
{  
    const {idUsuario, idProducto, cantidadCarrito} = peticion.body
    // console.log(typeof(idUsuario), idUsuario, idProducto, cantidadCarrito)
    // return true
    try{
        //const carro = await Carrito.findOne({idUsuario, "productos.idProducto": '5ed6bda88b4bca165aea171b'})
        let carro = await Carrito.findOne({idUsuario})

        if (carro){                                                                                                     //Si existe el carro del idUsuario
            //console.log("carrito SI EXISTE: ", carro.productos)

            const posicionProducto =  carro.productos.findIndex(objeto => objeto.idProducto == idProducto)                //findIndex es propio de Javascript no Mongodb(No funciona en Internet Explorer). Recibe el objeto que es el carro.productos y de hay se le dice que compare el objeto.idProducto con el idProducto recibido en la peticion. Si es cero es que encontré algo, si es -1 no encontrò nada

            if(posicionProducto > -1){                                              //-1 es sino encuentra ninguna coincidencia. Si es 0 o mayor es que encontró algo.
                                                                                    //Si entra quiere decir que el producto existe y se actualiza solo la cantidad
                const producto = carro.productos[posicionProducto]                  //Captura todo el producto que ya existia para luego actualizarlo abajo      
                producto.cantidadCarrito = cantidadCarrito                          //De todo el producto capturado arriba, selecciona solo el item cantidadCarrito y lo actualiza a el valor recibido del Frontend
                carro.productos[posicionProducto] = producto                        //Acá coge todo el objeto otra vez (ya actualizado) y lo asigna a la posicion donde estaba para posteriormente guardarlo
            } else {
                                                                                     //Entra en else si no existe el producto en el carro del usuario y añade el item acá
                carro.productos.push({idProducto, cantidadCarrito})                  //Con el método push lo mete dentro de lo que ya exista en el carrito
            }
            carro = await carro.save()                                               //Acá guarda el objeto que 
            return respuesta.status(201).send({resultado:true})
        } else {
            //Entra acá si el carrito no existia para el usuario
            const carritoNuevo = await Carrito.create({
                idUsuario: idUsuario,
                productos: [{idProducto, cantidadCarrito}]
            })
            return respuesta.status(201).send({resultado: true})
        }

    } catch (error){
        console.log("Error en carrito: ",error)
        respuesta.status(500).send("Hubo un error agregando producto al carrito")
    }

});

//Envía el detalle de productos a comprar en la vista del carrito:
router.get("/muestraCarrito", validaToken.compruebaToken, async function(peticion, respuesta)
{   
    const datos = peticion.body
    //console.log(typeof(datos), datos, datos.idUsuario)
    idUsuario = datos.idUsuario

    let consulta = await Carrito.findOne({idUsuario}).populate('productos.idProducto',['idProducto','nombreProducto','imagenUrl','precioUnitario']).exec()                 //Acá esta haciendo el cruce del Schema Carrito con el Schema de productos por medio del id(Schema.Types.ObjectId) gracias al método populate().exe()   ----- Dentro de populate se colocaron dos criterios: PRIMERO: 'productos.idProducto' que quiere decir, cruceme el objeto productos (Está dentro del shema Carrito) con el idProducto del schema y traigame lo que esta en el schema de productos (En el schema carrito esta ref: que apunta al schema productos). SEGUNDO: Está un arreglo con los campos que quiero que me traiga para que no traiga todo). Esto es bueno dado que si cambia el precio del producto, cuando el cliente vea el carrito se actualiza tbn el precio actual
    
    if (consulta != null){                                                                               //Si el carrito no está vacìo entra. De lo contrario, envia null como resultado abajo
        consulta = consulta.productos                                                                    //Cuando termina la consulta de arriba al servidor, me trae el id del cliente y el arreglo con la informaciòn de productos con el cruce hecho, pero lo unico que necesito, son los productos que hacen parte del carrito del cliente por tal motivo, tomo la misma variable consulta y le asigno.productos                                                          
    
        const carrito = consulta.map(function(elemento){                                                  //Acá hago un recorrido con el método map de cada producto de la consulta del anterior paso por dos motivos. PRIMERO: Quiero llevar al frontend UNICAMENTE los datos que tengo que presentarle al cliente y para cerrar o descargar la venta"_id". SEGUNDO: mientras hace el recorrido de cada producto, multiplico la cantidad por el precio para mostrar el subtotal
            return {     
                idProducto: elemento.idProducto["_id"],
                nombreProducto: elemento.idProducto["nombreProducto"],
                imagenUrl: elemento.idProducto["imagenUrl"],
                precioUnitario: elemento.idProducto["precioUnitario"],
                cantidadCarrito: elemento.cantidadCarrito,
                subtotal: elemento.idProducto["precioUnitario"]*elemento.cantidadCarrito
            }
        })
        respuesta.status(200).send(carrito)

    } else {
        respuesta.status(204).send(null)
    }

    //--------------------------------------------------------------------------------------------------
    //Esto es otra forma de hacer el populate.exe() agregandole una funciòn dentro del exe, me sirvio para desarrollar y entender esto y por eso no lo borro
    // const juan = await Carrito.findOne({idUsuario}).populate('productos.idProducto',['nombreProducto','imagenUrl','precioUnitario']).exec(function(error,data){
    //     if(error){
    //         console.log("hubo error: ",error)   
    //     } else {
    //         //console.log("El nombre del producto es: ", pepe.productos)
    //         //respuesta.status(200).send(data.productos)
    //         return data.productos
    //     }    
    // })

})

//Descarga los productos del inventario, limpia la cesta del cliente y
router.get("/pagar", validaToken.compruebaToken, async function(peticion,respuesta)
{
    const datos = peticion.body
    idUsuario = datos.idUsuario
    
    let consulta = await Carrito.findOne({idUsuario})                                                   //Busca el carrito del cliente

    if (consulta == null){
        return respuesta.send({msg:"NO HAY PRODUCTOS PARA PAGAR"})     
    }
    
    consulta = consulta.productos                                                                       //Trae solo los productos del carrito del cliente, no trae todo el schema, porque no lo necesito
    //console.log(consulta.length)


    for (var i=0; i<consulta.length; i++){
        //console.log(consulta[0].idProducto)
    
        let inventario = await ProductosHP.findOne({_id: consulta[i].idProducto})
        inventario.cantidadDisponible = inventario.cantidadDisponible - consulta[i].cantidadCarrito
    
        if (inventario.cantidadDisponible<0){
            console.log("Se va hace el envio, pero se alerta que se acabó el inventario y no va a estar disponible")
            inventario.cantidadDisponible = 0
        }
        
        await inventario.save()  
    }

    const pepe = await Carrito.findOneAndDelete({idUsuario})
    respuesta.send({msg:"OK PAGO"})

})

module.exports = router;