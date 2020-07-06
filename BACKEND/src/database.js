const mongoose = require('mongoose');

const uri = 'mongodb://localhost/tienda_db'

mongoose.connect(uri,                                                               //Acà se colocar la ip del servidor y busca el nombre de la Database, sino la encuentra la crea Si existe se va a conectar a esa Database
{
    //useMongoClient: true,                                                            //Este tbn es importante pero no supe bien com utilizarlo y lo desactive para que no bote errores
    useCreateIndex: true,                                                            //Estos 4 item son por defecto para funcionamiento de la libreria mongoose
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
    
})
.then(function()
{
    console.log("Se conecto correctamente a la Database")
})
.catch(function(error)
{
    console.log("Se presentó el error: ", error)
})

mongoose.connection.on('close',()=>{
    console.log("se cerró la conexión con mongodb: ", uri)
})

