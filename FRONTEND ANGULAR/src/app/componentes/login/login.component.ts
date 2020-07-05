import { Component, OnInit } from '@angular/core';
import { AutorizarService } from '../../services/autorizar.service'     //Se llama el servicio 
import { Router } from '@angular/router'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  inputType = "password";
  ojo = "../../../assets/img/icon-eye.svg";

  usuario = { email: '', pass: ''}

  constructor(
    private AutorizarService: AutorizarService,              //Se instancia el servicio agregando en los parentesis:  private AutorizarService: AutorizarService
    private router: Router                                   //Se instancia el Router que se importó en la parte arriba
  ) {  }

  ngOnInit(): void {
  }

  login(){
    console.log("Login: ", this.usuario)

    this.AutorizarService.login(this.usuario)                             //Envia los datos capturados del Formulario al servicio que luego mandará los datos al Backend
    .subscribe(                                                           //Este metodo de Angular es donde se recibe la respuesta del servidor{}
      respuesta=>{
        //console.log("Respuesta fue: ", respuesta)

        if(respuesta.resultado == "Autorizado")
        {
          localStorage.setItem('token',respuesta.token)                     //Guarda el id del token en el navegador en localStorage para luego traer los datos del usuario de su sesión
          this.router.navigate(['/main'])
        }else{
          alert(respuesta.msg)
        }
      },
      error => {console.log(error)}
    )                                                          
  }

  
}
