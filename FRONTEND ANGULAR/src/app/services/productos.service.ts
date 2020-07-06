import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';          //Importo esta clase para conectar el Frontend con el Backend
import { Productos } from '../registros';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  private URL = 'http://localhost:4000/catalogo'
  productoRecibido = {}
  carritoEncabezado: any

  constructor(
    private http: HttpClient
  ) { }

  cargaInventarioInicial(){
    return this.http.get<any>(this.URL + '/inventarioInicial')
  }

  productos(){
    //return this.http.get<Productos[]>('https://jsonplaceholder.typicode.com/posts')         //Lo que aparece como Productos[] quiere decir que lo que debe traer es un arreglo y la estructura que debe tener es la del archivo registros.ts  que llama al json de productos
    return this.http.get<Productos[]>(this.URL + '/cargueProductos')                          
  }

  vistaProductos(producto){
    this.productoRecibido = producto
    //console.log("el producto es: ", this.productoRecibido)
  }

  agregaCarrito(productoCarrito){
    //console.log("Service carrito: ",productoCarrito)
    return this.http.post<any>(this.URL + '/agregaCarrito', productoCarrito)
  }

  detalleCarrito(){
    return this.http.get<any>(this.URL + '/muestraCarrito',{observe: 'response'})
  }

  cantidadProductos(){
    this.http.get<any>(this.URL + '/cantidadProductos').subscribe(
      respuesta =>{
        this.carritoEncabezado = respuesta
        console.log("canti: ", this.carritoEncabezado)
      }
    )
    
  }

  pagar(){
    return this.http.get<any>(this.URL + '/pagar')
  }

}
