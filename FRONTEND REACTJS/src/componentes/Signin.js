import React from 'react'
import { Link } from 'react-router-dom'

class Signin extends React.Component{

    URL = 'http://localhost:4000'

    state = {}

    handleCampos = (e) => {                                                                       //Esta funciòn es para guardar los datos en el state por medio del onChange que tiene cada input del formulario
        //console.log("Registro", this)                                                           //Esto es para ver como a través de la funciòn arrow permite de una acceder a los props
        //console.log(e.target.name, e.target.value)                                              //Esto sirve para ver como se guarda el nombre del campo y el valor por medio del e.target (elemento.objetivo).
        this.setState({                                                                           //Esta funciòn agregará el nombre del campo y el valor que tenga ante cualquier cambio en el input. Se actualiza cada vez se se digita algo en el input
            [e.target.name]: e.target.value 
         })
    }

    handleFormulario = async (e) => {
        e.preventDefault()
        console.log("signin: ",this.state)                                                                  //Sirvio para mostrar el state con los datos ya guardados gracias a la funciòn de arriba handleCampos
        
        try {
            const peticion = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.state)             
            } 
            const respuesta = await fetch(`${this.URL}/API/nuevoUsuario`,peticion)
            let json = await respuesta.json()
            console.log(json)

            if(json.resultado === "SI") {                             
              alert(json.msg)
              this.props.history.push('/login')                                      //Lo manda a la vista principal de los productos
            }else{
              alert(json.msg)
            }

        } catch (error) {
            console.log("Hubo error al hacer login: ", error)
        }

    }

    render(){
        return(
            <div className="fondo">
                <div className="fondo2">
                    <form className="formulario" onSubmit={this.handleFormulario}>
                        <h1 className="texto1">Registrate!</h1>
                        <div>
                            <label>Nombre:</label>
                            <input type="text" name="nombre" onChange={this.handleCampos} className="inputInicio" placeholder=" Digita nombre completo" autoFocus required/>
                        </div>
                        <div>
                            <label>Correo electrónico:</label>
                            <input type="text" name="correo" onChange={this.handleCampos} className="inputInicio" placeholder=" ejemplo@hotmail.com" required/>
                        </div>
                        <div>
                            <label>Contraseña:</label>
                            <input type="password" name="contrasena1" onChange={this.handleCampos}  className="inputInicio" placeholder=" Digita contrasena" required/>
                        </div>
                        <div>
                            <label>Confirma Contraseña:</label>
                            <input type="password" name="contrasena2" onChange={this.handleCampos} className="inputInicio" placeholder=" Confirma tu contrasena" required/>
                        </div>
                            
                        <button type="submit" className="boton-inicio" onClick={this.handleFormulario}>Confirmar Registro</button>
                    
                        <Link to="login"><strong className="texto2 cursor">Inicia sesión</strong></Link>
                    </form>

                </div>
            </div>
        )
    }


}

export default Signin