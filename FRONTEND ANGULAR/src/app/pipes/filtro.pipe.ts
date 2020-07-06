import { Pipe, PipeTransform } from '@angular/core';
import { ProductoCardComponent } from '../componentes/producto-card/producto-card.component';

@Pipe({
  name: 'filtro'                                                                          //Este es el nombre del pipe que se llama en la linea 12 de productos.component.html
})
export class FiltroPipe implements PipeTransform {

  //el parametro value viene desde el ngFor de la linea 12 del HTML de productos.component.html(Aunque se puede reutilizar en cualquier componente)
  transform(value: any, arg: any): any {                                                  //transform viene por defecto cuando se crea un archivo pipe
    //if (arg === ''|| arg.length<3) return value                                         //Esto funciona en caso que uno quiera que empiece a buscar cuando el usuario haya colocado mas de 3 letras en la caja de busqueda y no empiece de una con una sola letra

    const resultadoFiltrado = [];
    for(const elemento of value){
      if(elemento.nombreProducto.toLowerCase().indexOf(arg.toLowerCase()) >-1){           //Acá coloco toLowerCase() para comparar los valores en minuscula. El método indexOf busca la primera ocurrencia dentro de una cadena asignada un valor que es el que va dentro de los parentesis, es este caso es el argumento que viene de la caja de buscar: el -1 es para decirle cuando encuentre la primera ocurrencia en una letra como seria: ocurrencia de 1 letra seria 1 y por lo tanto debe mostrarla y por eso se pone -1 que quiere decir que no hubo match con la palabra buscada. Se puede colocar tbn que sea diferente de -1 y no mayor. -1 es cuando no hubo match que devuelve
        //console.log("entra")
        resultadoFiltrado.push(elemento)
      }
    }
    return resultadoFiltrado
  }

}
