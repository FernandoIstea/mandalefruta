// VARIABLES
const carrito = []

const precioTotal = document.querySelector('table tfoot td#totalPrice span')
const btnComprar = document.querySelector('button#btnBuy')
const btnRetornar = document.querySelector('button#btnReturn')
const tableBody = document.querySelector('table tbody#tableBody')

// LÓGICA
function recuperarCarrito() {
    const recuperarCarrito = JSON.parse(localStorage.getItem('shoppingKart'))

    if (Array.isArray(recuperarCarrito)) {
        carrito.push(...recuperarCarrito)
    }
}

function calcularTotalCarrito() {
    if (carrito.length > 0) {
        precioTotal.textContent = carrito.reduce((acc, prod)=> acc + prod.precio, 0).toFixed(2) || 0.00
    }
}

function crearFilaCarrito(prod) {
    return `<tr>
                <td id="pImagen">${prod.imagen}</td>
                <td id="nombre">${prod.nombre}</td>
                <td id="price">$ ${prod.precio.toFixed(2)}</td>
                <td id="delButton" 
                    data-codigo="${prod.id}"
                    title="Clic para eliminar">
                    ⛔️
                </td>
            </tr>`
}

function mostrarToast(mensaje, estilo) {
    ToastIt.now({
        style: estilo,
        message: mensaje,
        close: true,
    })
}

function mostrarCarrito() {
    if (carrito.length > 0) {
        tableBody.innerHTML = ''
        carrito.forEach((prod)=> {
            tableBody.innerHTML += crearFilaCarrito(prod)
        })
        calcularTotalCarrito()
        btnComprar.removeAttribute('disabled')
    }
}

function eliminarBadge() {
    navigator.clearAppBadge()
}

// FUNCIÓN PRINCIPAL
recuperarCarrito()
mostrarCarrito()

// EVENTOS
btnRetornar.addEventListener('click', ()=> location.href = 'index.html')

btnComprar.addEventListener('click', ()=> {
    Swal.fire({
        title: "Finalizar compra",
        text: "¿Confirmas la compra actual?",
        icon: 'question',
        showCancelButton: true,
        showConfirmButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Confirmar'
    }).then((result)=> {
        if (result.isConfirmed) {
            localStorage.removeItem('shoppingKart')
            carrito.length = 0
            mostrarToast('🛍️ Compra finalizada. Muchas gracias!', 'success')
            eliminarBadge()
            setTimeout(() => btnRetornar.click(), 2500)
        }
    })
})

window.addEventListener('offline', ()=> {
    mostrarToast('Perdiste conexión a Internet.', 'error')
    btnComprar.setAttribute('disabled', 'true')
    btnRetornar.setAttribute('disabled', 'true')
})

window.addEventListener('online', ()=> {
    mostrarToast('Estás conectado nuevamente a Internet.', 'info')
    btnComprar.removeAttribute('disabled')
    btnRetornar.removeAttribute('disabled')
})