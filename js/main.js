// IMPORTS

// DOM: enlaces y variables globales
const categorias = []
const productos = []

const URLproductos = 'https://68114faa3ac96f7119a42ff7.mockapi.io/productos'
 
const container = document.querySelector('div.card-container')
const buttonCarrito = document.querySelector('div.shoping-cart')
const inputSearch = document.querySelector('input#inputSearch')
const seccionCategorias = document.querySelector('article.categories')

function recuperarCarrito() {
    return JSON.parse(localStorage.getItem('shoppingKart')) ?? []
}

const carrito = recuperarCarrito()

// LÓGICA
function crearCardHTML(producto) {
    return `<div class="card">
                <div class="product-image">${producto.imagen}</div>
                <div class="product-name">${producto.nombre}</div>
                <div class="product-price">$ ${producto.precio}</div>
                <div class="buy-button"><button id="buttonComprar" data-codigo="${producto.id}">COMPRAR</button></div>
            </div>`
}

function crearCardError() {
    return `<div class="card-error">
                <div class="error-title">
                    <h3>Se ha producido un error inesperado.</h3>
                    <div class="emoji-error">🔌</div>
                    <h4>Por favor, intenta acceder nuevamente en unos instantes.</h4>
                    <p>No estamos pudiendo cargar el listado de productos para tu compra.</p>
                    <div class="emoji-error">
                        <span>🥑</span>
                        <span>🍉</span>
                        <span>🍋‍🟩</span>
                        <span>🍏</span>
                    </div>
                </div>
            </div>`
}

function mostrarToast(mensaje, estilo) {
    ToastIt.now({
        style: estilo,
        message: mensaje,
        close: true,
    })
}

function agregarEventosClick() {
    const botonesComprar = document.querySelectorAll('button#buttonComprar')
    if (botonesComprar.length > 0) {
        botonesComprar.forEach((boton)=> {
            boton.addEventListener('click', ()=> {
                let productoElegido = productos.find((producto)=> producto.id ===  boton.dataset.codigo )
                if (productoElegido !== undefined) {
                    carrito.push(productoElegido)
                    let mensaje = `'${productoElegido.nombre}' agregado al carrito`
                    mostrarToast(mensaje, 'success')
                    setearBadge()
                    guardarCarrito()
                } else {
                    alert(' No se encontró el producto.')
                }
            })
        })
    }
}

function guardarCarrito() {
    // Operador lógico AND
    carrito.length > 0 && localStorage.setItem('shoppingKart', JSON.stringify(carrito))



    // if (carrito.length > 0) {
    //     localStorage.setItem('shoppingKart', JSON.stringify(carrito))
    // }
}

function setearBadge() {
    carrito.length > 0 && navigator.setAppBadge(carrito.length)
}

// function recuperarCarrito() {
//     const recuperarCarrito = JSON.parse(localStorage.getItem('shoppingKart'))

//     if (Array.isArray(recuperarCarrito)) {
//         carrito.push(...recuperarCarrito)
//         setearBadge()
//     }
// }

async function obtenerProductos() {
    try {
         const response = await fetch(URLproductos)
         if (response.status === 200) {
            const data = await response.json()
            productos.push(...data)
            cargarProductos(productos)   
         } else {
            throw new Error('Error al obtener los datos.')
         }
    } catch (error) {
        container.innerHTML = crearCardError()
    }
}

function cargarProductos(arrayProductos) {
    if (arrayProductos.length > 0) {
        let cardsProductos = ''

        arrayProductos.forEach((producto)=> {
            cardsProductos += crearCardHTML(producto)
        })
        container.innerHTML = cardsProductos
        agregarEventosClick()
    }
}

// EVENTOS
buttonCarrito.addEventListener('click', ()=> {
    carrito.length > 0 && navigator.onLine ? location.href = "checkout.html" 
                                           : mostrarToast('Agrega al menos un producto al carrito.', 'alert')
})

inputSearch.addEventListener('search', ()=> {
    let valor = inputSearch.value.trim().toLowerCase()
    let pe = productos.filter((producto)=> producto.nombre.toLowerCase().includes(valor) )
    pe.length > 0 ? cargarProductos(pe) : mostrarToast('🔎 No se encontraron coincidencias.', 'alert')
})

// FUNCIÓN PRINCIPAL
obtenerProductos()
recuperarCarrito()