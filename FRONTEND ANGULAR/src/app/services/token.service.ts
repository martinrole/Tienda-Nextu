import { Injectable } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';              //Estoy importando ese valor
import { AutorizarService } from '../services/autorizar.service'

@Injectable({
  providedIn: 'root'
})
export class TokenService implements HttpInterceptor {                //Acá agregué: implements HttpInterceptor para que funcione. Este pide que exista una función llamada intercept que recibe dos párametros

  constructor(
    private AutorizarService: AutorizarService                        //Se aplica la instancia de AutorizarService para utilizarlo
  ) { }

  intercept(peticion, next){                                            //Este método intercept es propio de HttpInterceptor. Esta funcion recibe dos párametros una peticiòn y un next. La petición toma la información que existe en cada peticiòn y va a tratar de añadir más informaciòn como una cabecera(setHeader)  
    let agregaCabecera = 
    peticion.clone({                                                    //La peticiòn tiene un mètodo llamado clone() que permite establecer más cabeceras a través de una propiedad llamada setHeaders
      setHeaders: {
        Autorizacion: `Bearer ${this.AutorizarService.obtenerToken()}`    //Esto quiere decir que en cada petición se va añadir esta cabecera llamada autorizaciòn que se puede ver en Devtools sección Network(Red) en nombre login y apartado Headers
      }
    })
    return next.handle(agregaCabecera)
  }

  
}
