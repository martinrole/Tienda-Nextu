import React from 'react'
import { withRouter } from 'react-router-dom'                                                       //withRouter sirve para que recuerde el historial(history) de donde procede y conozca de donde proviene para luego al dar click en volver se pueda ir a main 
import ProductoCarrito from './ProductoCarrito';

const Carrito = (props) => (
    <div className="carritoContenedor">
        <h1 className="carritoTitulo">Carrito de compras</h1>
        <div className="compra">
            <div className="carritoProductos">      
                <ProductoCarrito productosCarrito= {props.productosCarrito} />
            </div>

            <div className="factura">
                <h2>Total: $ <span>{props.total.toLocaleString('en-IN')}</span></h2>
                <button onClick={() => props.history.push('/main')} className="boton-secundario">Volver</button>
                <button onClick={() => props.pagar()} className="boton-primario">Pagar</button>
            </div>
        </div>
    </div>
)
export default withRouter(Carrito) 