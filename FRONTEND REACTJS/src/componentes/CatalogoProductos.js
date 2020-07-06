import React from 'react';
import ProductoCard from './ProductoCard'

class CatalogoProductos extends React.Component {

    URL = 'http://localhost:4000'

    constructor(props){
        super(props)
        this.state = {
            datos: [],
            buscar: '',
            productosFiltro: [],
            cantidad: '1'
        }
    }

    //componentDidMount carga después del render, y llamo a la función que traerá los datos de Backend
    async componentDidMount(){
        await this.cargueProductos()
        this.filtroProductos()
    }

    //Conecta con el backend
    cargueProductos = async () => {
        const respuesta = await fetch(this.URL + '/catalogo/cargueProductos')
        const datos = await respuesta.json()
        this.setState({datos})
    }

    handleBuscar = async (e) => {
        await this.setState({ buscar: e.target.value })
        this.filtroProductos()
    }

    filtroProductos = () => {
        const productosFiltro = this.state.datos.filter(producto => producto.nombreProducto.toLowerCase().indexOf(this.state.buscar.toLowerCase()) > -1)                        //Acá coloco toLowerCase() para comparar los valores en minuscula. El método indexOf busca la primera ocurrencia dentro de una cadena asignada un valor que es el que va dentro de los parentesis, es este caso es el argumento que viene de la caja de buscar que se agregó al state llamado "buscar": el -1 es para decirle cuando encuentre la primera ocurrencia en una letra como seria: ocurrencia de 1 letra seria 1 y por lo tanto debe mostrarla y por eso se pone -1 que quiere decir que no hubo match con la palabra buscada. Se puede colocar tbn que sea diferente de -1 y no mayor. -1 es cuando no hubo match que devuelve
        this.setState({ productosFiltro })
    }

    render() {
        return (
            
            <div className="catalogoProductos">
                <div className="buscador">
                    <div>
                        <h1>Catálogo de productos</h1>
                    </div>
                    <div>
                        <p>¿Qué estás buscando?</p>  
                        <input type="text" name="buscar" onChange={this.handleBuscar} className="catalogoInput" placeholder="Escribe..."/>
                    </div>
                </div>
                <div className="catalogoContenedor">

                    {
                        this.state.productosFiltro.map((producto) => {
                            return(
                                <ProductoCard
                                    key = {producto.idProducto}
                                    idProducto = {producto.idProducto}
                                    nombreProducto = {producto.nombreProducto}
                                    imagenUrl = {producto.imagenUrl}
                                    cantidadDisponible = {producto.cantidadDisponible}
                                    precioUnitario = {producto.precioUnitario}
                                    toggleVista = {this.props.toggleVista}
                                    agregarProducto = {this.props.agregarProducto}
                                    history = {this.props.history}
                                />
                            )
                        })
                    }

                </div>
            </div>
        )
        
    }
}


export default CatalogoProductos