import { urlProductos, armarFilaHTML, 
         mostrarMensaje } from "./utils.js"
 
const dialog = document.querySelector("dialog")
const btnNuevo = document.querySelector("button.btn-nuevo")
const btnGuardar = document.querySelector("button#btnGuardar")
const btnEliminar = document.querySelector("button#btnEliminar")
const inputId = document.querySelector("input#inputId")
const inputImagen = document.querySelector("input#inputImagen")
const inputNombre = document.querySelector("input#inputNombre")
const inputPrecio = document.querySelector("input#inputPrecio")
const selectCategoria = document.querySelector("select#selectCategoria")
const tableBody = document.querySelector("table tbody#tableBody")
let operacion = "" // (n = nuevo - e = editar)
const productos = []

function activarEventosClickEditar() {
    const botonesEditar = document.querySelectorAll("td#editButton")

    botonesEditar.forEach((boton)=> {
        boton.addEventListener("click", ()=> {
            let productoSeleccionado = productos.find((producto)=> producto.id === boton.dataset.codigo )

            inputId.value = productoSeleccionado.id
            inputImagen.value = productoSeleccionado.imagen
            inputNombre.value = productoSeleccionado.nombre 
            inputPrecio.value = productoSeleccionado.precio 
            selectCategoria.value = productoSeleccionado.categoria 

            operacion = "e"
            btnEliminar.setAttribute("hidden", "true")
            btnGuardar.removeAttribute("hidden")
            dialog.showModal()

        })
    })
}

function activarEventosClickEliminar() {
    const botonesEliminar = document.querySelectorAll("td#delButton")

    botonesEliminar.forEach((boton)=> {
        boton.addEventListener("click", ()=> {
            let productoAeliminar = productos.find((producto)=> producto.id === boton.dataset.codigo )

            inputId.value = productoAeliminar.id
            inputImagen.value = productoAeliminar.imagen
            inputNombre.value = productoAeliminar.nombre 
            inputPrecio.value = productoAeliminar.precio 
            selectCategoria.value = productoAeliminar.categoria 

            btnEliminar.removeAttribute("hidden")
            btnGuardar.setAttribute("hidden", "true")

            dialog.showModal()
        })
    })
}

function obtenerProductos() {
    fetch(urlProductos)
    .then((response)=> response.json() )
    .then((data)=> {
        productos.length = 0
        productos.push(...data)
    } )
    .then(()=> {
        if (productos.length > 0) {
            let filas = ""
            productos.forEach((prod)=> filas += armarFilaHTML(prod) )
            tableBody.innerHTML = filas

            activarEventosClickEditar()
            activarEventosClickEliminar()
        } else {
            throw new Error("Error al obtener los productos.")
        }
    })
    .catch((error)=> console.error(error))
}

// Función principal
obtenerProductos()

// EVENTOS
btnNuevo.addEventListener("click", ()=> {
    operacion = "n"

    inputId.value = ""
    inputImagen.value = ""
    inputNombre.value = ""
    inputPrecio.value = "" 
    selectCategoria.value = ""

    btnEliminar.setAttribute("hidden", "true")
    btnGuardar.removeAttribute("hidden")

    dialog.showModal()
})

btnGuardar.addEventListener("click", ()=> {
    if (operacion === 'n') { // nuevo producto

        const nuevoProducto = {
            nombre: inputNombre.value.trim(),
            imagen: inputImagen.value,
            precio: parseFloat(inputPrecio.value),
            categoria: selectCategoria.value 
        }

        const opciones = {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(nuevoProducto)
        }

        fetch(urlProductos, opciones)
        .then((response)=> response.json())
        .then((data)=> {
            inputId.value = data.id 
            mostrarMensaje("Producto dado de alta.", "success")
            obtenerProductos()
        })
        .catch((error)=> {
            mostrarMensaje("Error en alta de producto.", "error")
        })

    } else { // modificando producto existente

        const productoAmodificar = {
            nombre: inputNombre.value.trim(),
            imagen: inputImagen.value,
            precio: parseFloat(inputPrecio.value),
            categoria: selectCategoria.value 
        }

        const opciones = {
            method: 'PUT',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(productoAmodificar)
        }

        let productId = inputId.value 
        let URL = urlProductos + "/" + productId

        fetch(URL, opciones)
        .then((response)=> response.json())
        .then((data)=> {
            mostrarMensaje("Producto modificado exitosamente.", "info")
            obtenerProductos()
        })
        .catch((error)=> {
            mostrarMensaje("Error al modificar producto.", "error")
        })
    }
})

btnEliminar.addEventListener("click", ()=> {
    let productId = inputId.value 
    let URL = `${urlProductos}/${productId}`

    const opciones = {
            method: 'DELETE',
            headers: { 'content-type': 'application/json' },
    }

    fetch(URL, opciones)
    .then((response)=> response.json())
    .then((data)=> {
        mostrarMensaje("Producto eliminado exitosamente.", "alert")
        obtenerProductos()
    })
    .catch((error)=> {
        mostrarMensaje("Error al eliminar producto.", "error")
    })

})