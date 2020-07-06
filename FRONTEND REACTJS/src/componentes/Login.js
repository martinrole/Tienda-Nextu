import React from 'react'
import { Link } from 'react-router-dom'


class Login extends React.Component {

    URL = 'http://localhost:4000'

    state = {}


    //Cuerpo peticiones al Backend:
    objetoPeticion = (metodo,datos) => {
        return ({
            method: metodo,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Origin': '',
                'Host': ''
            },
            body: JSON.stringify(datos)
        })
    }

    handleFormulario = async (e) => {
        e.preventDefault()
        console.log(this.state)

        try {
            const respuesta = await fetch(`${this.URL}/API/login`,this.objetoPeticion("POST",this.state))
            let json = await respuesta.json()
            console.log(json)

            if(json.resultado === "Autorizado")
            {
              localStorage.setItem('token',json.token)                              //Guarda el token en el navegador en localStorage para luego lleva los datos del usuario de su sesión en un header llamado autorización
              alert(json.msg)
              this.props.history.push('/main')                                      //Lo manda a la vista principal de los productos
            }else{
              alert(json.msg)
            }

        } catch (error) {
            console.log("Hubo error al hacer login: ", error)
        }

    }

    handleCampos = (e) => {
        this.setState({
            [e.target.name]: e.target.value                                          //e.target.name guarda el nombre del input que se especifico abajo en el HTML del render. el e.target.value guarda el valor de ese mismo input                                                    
        })
    }

    //Crea o carga el inventario inicial de los productos cuando se ejecuta en un computador diferente por primera vez
    componentDidMount(){
        fetch(`${this.URL}/catalogo/inventarioInicial`,this.objetoPeticion("GET"))
        .then(respuesta => respuesta.json())
        .then(datos => console.log(datos.msg))
    }

    render (){
        return (
            <div className="fondo">
                <div className="fondo2">
                    <form className="formulario" onSubmit={this.handleFormulario}>
                        <h1 className="texto1">Iniciar sesión</h1>
                
                        <label>Correo electrónico:</label>
                        <input type="text" name="email" onChange={this.handleCampos} className="inputInicio" autoFocus required/>

                        <label>Digite contraseña:</label>
                        <div className="contrasena-box">
                            <input type="password" name="pass" onChange={this.handleCampos} className="inputInicio" required/>
                        </div>
                        
                        <button type="submit" className="boton-inicio" onClick={this.handleFormulario}>Ingresar</button>   
                        <Link to="signin" className="texto1">Eres nuevo? &nbsp;&nbsp;&nbsp;<strong className="texto2 cursor">Registrate primero!</strong></Link>
                    </form>
                
                </div>
            </div>
        )

    }


}


export default Login