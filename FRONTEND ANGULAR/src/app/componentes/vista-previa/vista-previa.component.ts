import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router'        //ActivatedRoute sirve para leer los parametros de la ruta activada, es decir que cuando la vista productos de click en ver mas enviará los datos del producto seleccionado acá y se recibirá gracias a esta importación
import { ProductosService } from '../../services/productos.service'

@Component({
  selector: 'app-vista-previa',
  templateUrl: './vista-previa.component.html',
  styleUrls: ['./vista-previa.component.css']
})
export class VistaPreviaComponent implements OnInit {

  productoVista = <any>{}
  
  constructor(
    private router: Router,
    private ProductosService: ProductosService
  ) { 
      this.productoVista = this.ProductosService.productoRecibido
      console.log("vista-previa producto: ", this.productoVista)
    }

  ngOnInit() {
  }

  productos(){
    this.router.navigate(['main'])
  }

}
