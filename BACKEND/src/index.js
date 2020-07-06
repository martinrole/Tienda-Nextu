const express = require('express'),
      database = require('./database.js'),
      cors = require('cors'),
      rutas = require('./rutas/rutas.js'),
      rutaProductos = require('./rutas/rutaProductos.js')


//Inicializaciones:
const PORT = 4000;
const app = express();                                      //Crea el objeto del servidor

app.use(cors());
app.use(express.json());                                    //Este metodo json() es importante porque va a ser capaz de convertir los datos recibidos a un formato json que puedo manipular. Tiene que ir primero esto que la rutas que es la linea siguiente.
app.use(express.urlencoded({extended: false}));             //Sirve para recibir los datos del frontend y convertirlos en un objeto de javascript para enviar al backend
app.use('/API',rutas);
app.use('/catalogo',rutaProductos);


app.listen(PORT);
console.log('Servidor en puerto: ', PORT)