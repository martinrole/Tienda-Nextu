import { Component} from '@angular/core';
import { ProductosService } from '../../services/productos.service';
import { Router } from '@angular/router'
import { PercentPipe } from '@angular/common';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent {

  carritoProductos: any[] = []                                        //Debo colocar acá any[] = [] para que abajo en el ciclo for pueda leer la propiedad length
  total = 0

  constructor( 
    private ProductosService: ProductosService,
    private router: Router 
  ) 
  {
    this.ProductosService.detalleCarrito().subscribe(
      datos=>{
        //console.log("carrito: ", datos.body)
        this.carritoProductos = datos.body
        if (this.carritoProductos != null){
          for (var i=0; i<this.carritoProductos.length; i++){
            this.total += this.carritoProductos[i]['subtotal']                      //Gracias al operador += lo que hago es recorrer el campo subtotal de cada producto y se suman. Debo colocar total = 0 arriba para que lo reconozca como numero
          }
        }

      })     
  }

  pagar(){
    this.ProductosService.pagar().subscribe
    (
      datos=>{
        alert(datos.msg)
      },
      (error) => console.log(error),
      () => {
        this.ProductosService.carritoEncabezado = 0
        this.router.navigate(['/main']) 
      }   
    )
      
  }


}
