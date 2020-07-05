import { Component, EventEmitter, OnInit } from '@angular/core';
import { ProductosService } from '../../services/productos.service';
import { Router } from '@angular/router'
import { Observable } from 'rxjs';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {

  datoProductos = [];
  filtrado = ''
  productoCarrito:  {idProducto: '',  cantidadCarrito}

  constructor(
    private ProductosService: ProductosService,
    private router: Router
  ) 
  {
    this.ProductosService.cargaInventarioInicial()              //El constructor llama la funcion cargaInventario que esta va es al backend a cargar el archivo baseProductos.json a mongo si es la primera vez que se ejecuta en un computador
    .subscribe(
      datos=>{console.log("Inventario: ", datos)}
    )
  }

  ngOnInit() {
    this.ProductosService.productos()
    .subscribe(                                                 //subscribe trae los datos
      datos=>{                                                  //Como lo que se trae es un arreglo de productos, esta funcion recorre cada uno
        console.log("La respuesta fue: ", datos)
        this.datoProductos = datos                              //Estoy diciendo que rellene el array datoProductos con los datos que trajo del backend
      },
      error => {console.log("Hubo error: ", error)}
    )
  }

  productoSeleccionado(producto){
    //console.log("productoSeleccionado: ", producto)
    this.ProductosService.vistaProductos(producto)  
    this.router.navigate(['/main/vistaPrevia'])
  }

  agregaCarrito(producto, cantidadCarrito)
  {
  
    this.productoCarrito = {idProducto: producto.idProducto, cantidadCarrito: parseInt(cantidadCarrito)}        //Le coloco parseInt para enviar el dato como numero y no como string que llega normal del HTML
    this.ProductosService.agregaCarrito(this.productoCarrito)                      
    .subscribe
    (
      respuesta=>{
        if (respuesta){
          alert("Se agregó " + cantidadCarrito + " " + producto.nombreProducto + "(s) a la cesta")
        }else {
          alert(respuesta.msg)
        }  
      },
      error=>{console.log("Hubo error carrito:",error)},
      ()=>{
        //console.log("llego a callback: ")
        this.ProductosService.cantidadProductos()
      }  
    )

  }

  
}

