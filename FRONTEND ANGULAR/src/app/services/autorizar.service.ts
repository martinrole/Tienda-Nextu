import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';          //Importo esta clase para conectar el Frontend con el Backend
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AutorizarService {

  private URL = 'http://localhost:4000/API'

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }                       //En los parentesis debo instanciar la clase http agregando private http: HttpClient     

  login(usuario){
    return this.http.post<any>(this.URL + '/login',usuario);
  }

  signin(nuevoUsuario){
    return this.http.post<any>(this.URL + '/nuevoUsuario', nuevoUsuario);
  }

  loggenIn(){                                               //Esto es un out of service: Comprueba si el usuario esta logeado o no validando el token. Esto lo llamara el guard que se creó
    if(localStorage.getItem('token')){
      return true
    }else{
      return false
    }
  }

  obtenerToken(){
    return localStorage.getItem('token')
  }

  logout(){
    localStorage.removeItem('token')
    this.router.navigate(['login'])                            //Lo redirecciona a login
  }

}
