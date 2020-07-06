import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom'
import Encabezado from './Encabezado';
import CatalogoProductos from './CatalogoProductos';
import VistaPrevia from './VistaPrevia';
import Carrito from './Carrito';

class Main extends React.Component {

    URL = 'http://localhost:4000'

    state= {
        token: '',
        autenticado: false,
        producto: {},
        productosCarrito: [],
        carrito: 0,
        total: 0
    }
    //componentDidMount carga después del render, y llamo a la función que traerá los datos de Backend
    async componentDidMount() {
        await this.obtenerToken()

        if (this.state.token === "Bearer null"){
            alert ("Por favor autenticarse primero...")
            return this.props.history.push('/login')
        } else {
            console.log(this.state.token)
            this.setState ({ autenticado: true })
            await this.cantidadProductos()
            this.muestraCarrito()
        }
    }

    //Cuerpo peticiones al Backend:
    objetoPeticion = (metodo,datos) => {
        return ({
            method: metodo,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'autorizacion': this.state.token,
                'Origin': '',
                'Host': ''
            },
            body: JSON.stringify(datos)
        })
    }


    obtenerToken = async () => {
        await this.setState({ token: `Bearer ${localStorage.getItem('token')}` })
    }

    //Trae la cantidad de producto en la cesta del backend y muestra el número en el navbar
    cantidadProductos = async () => {
        try {
            const respuesta = await fetch(`${this.URL}/catalogo/cantidadProductos`, this.objetoPeticion("GET"))
            let carrito = await respuesta.json()
            this.setState({ carrito })         
        } catch (error) {
            console.log("Algo falló en cantidadProductos: ", error)
        }
    }

    //Pide el detalle de productos a comprar en la vista del carrito:
    muestraCarrito = async () => {
        const respuesta = await fetch(`${this.URL}/catalogo/muestraCarrito`, this.objetoPeticion("GET"))
 
        if (respuesta.status === 200) {
            let subtotales = 0
            let productosCarrito = await respuesta.json()
            this.setState({ productosCarrito })

            for (let i=0; i<productosCarrito.length; i++) {
                subtotales += productosCarrito[i]['subtotal']                                           //Gracias al operador += lo que hago es recorrer el campo subtotal de cada producto y se suman teniendo en cuenta el valor anterior el array. Debo colocar subtotal = 0 arriba para que lo reconozca como numero    
            }
            this.setState({total: subtotales})  
        }
    }

    //Boton clic de Añadir producto:
    agregaProductoCarrito = async (props) => {
        console.log(props)
        const respuesta = await fetch(`${this.URL}/catalogo/agregaCarrito`, this.objetoPeticion("POST", props))
        
        if (respuesta){
            alert("Se agregó " + props.cantidadCarrito + " " + props.nombreProducto + "(s) a la cesta")
          }else {
            alert(respuesta.msg)
          }
        await this.muestraCarrito()
        await this.cantidadProductos()  
    }
    
    //Recoge los datos del producto seleccionado en el boton Ver mas y los envia a la vistaPrevia component
    toggleVista = async (props) => {
        await this.setState({ producto: props})
        this.props.history.push('/main/vistaPrevia')
    }

    pagar = async () => {
        console.log("llego a pagar")
        await fetch(`${this.URL}/catalogo/pagar`, this.objetoPeticion("GET"))
        .then(respuesta => respuesta.json())
        .then(datos => {                                                            //Este video me permitió entender el fetct y los then: https://www.youtube.com/watch?v=e1unK0rKuuM
            this.setState({ total:0, carrito: 0, productosCarrito: [] })
            alert(datos.msg)    
        })

        this.props.history.push('/main')
    }

    salir = () => {
        localStorage.removeItem('token')
        alert("Hasta luego...")
        this.props.history.push('/login')
    }

    render(){
        return(
            <div className="fondo3">
                <div className="encabezado">
                    <Encabezado carrito={this.state.carrito} salir={this.salir} />
                </div>
                <Switch>                  
                    <Route exact path="/main/carrito" render={()=> <Carrito productosCarrito={this.state.productosCarrito} total={this.state.total} pagar={this.pagar}/>} /> 
                    <Route exact path="/main/vistaPrevia" render={() => ( this.state.autenticado === true ? <VistaPrevia producto={this.state.producto} /> : <Redirect to='/login' /> ) } />
                    <Route exact path="" render={() => <CatalogoProductos toggleVista={this.toggleVista} agregarProducto={this.agregaProductoCarrito}/> }/>
                </Switch>

            </div>
        )
    }

}

export default Main