// Imports comunes a varios documentos HTML
import { recuperarCarrito, crearFilaHTML, guardarCarrito,
         mostrarMensaje } from "./utils.js"

const carrito = recuperarCarrito()
const tableBody = document.getElementById("tableBody")
const totalPrice = document.getElementById("totalPrice")
const btnVolver = document.getElementById("btnReturn")
const btnComprar = document.getElementById("btnBuy")

function validarCarritoVacio() {
    if (carrito.length === 0) {
        location.href = "index.html"
    }
}

function calcularTotalCarrito() {
    let totalCarrito = carrito.reduce((acc, producto)=> acc + producto.precio, 0 )
    return `$ ${totalCarrito.toLocaleString()}`
}

function activarClickBotonesEliminar() {
    const botonesEliminar = document.querySelectorAll("td#delButton")

    botonesEliminar.forEach((boton)=> {
        boton.addEventListener("click", ()=> {
            let indice = carrito.findIndex((producto)=> producto.id === boton.dataset.codigo)
            carrito.splice(indice, 1)
            mostrarMensaje("Se ha quitado el producto del carrito", "info", 3500)
            cargarCarritoDeCompras()
            guardarCarrito(carrito)
        })
    })
}

function cargarCarritoDeCompras() {
    if (carrito.length > 0) {
        tableBody.innerHTML = ""
        carrito.forEach((producto)=> tableBody.innerHTML += crearFilaHTML(producto))
        totalPrice.textContent = calcularTotalCarrito()
        btnComprar.removeAttribute("disabled")
        activarClickBotonesEliminar()
    } else {
        validarCarritoVacio()
    }
}

// FUNCION PRINCIPAL
cargarCarritoDeCompras()

// EVENTOS
btnVolver.addEventListener("click", ()=> location.href = "index.html" )

btnComprar.addEventListener("click", ()=> {
    Swal.fire({
        title: 'Confirmación de compra',
        text: '¿Desea confirmar la compra actual?',
        icon: 'question',
        showConfirmButton: true,
        confirmButtonText: 'Aceptar',
        showCancelButton: true,
        cancelButtonText: 'Cancelar'
    }).then((result)=> {
        if (result.isConfirmed === true) {
            mostrarMensaje("🛍️ Gracias por elegirnos!", "success", 3500)
            carrito.length = 0
            localStorage.removeItem("carrito")
            btnComprar.setAttribute("disabled", "true")
            setTimeout(()=> btnVolver.click(), 4000)
        }
    })
})