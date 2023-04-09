
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let session =
  JSON.parse(sessionStorage.getItem("session")) || [];

  document.addEventListener("DOMContentLoaded", () => {
   
   mostrarCarritoFinal()
   sliderCards3()
   
  
   sumarTotal()
   mostrarRecientes()
})

function sumarTotal(){
window.document.getElementById('precioTotal').innerHTML =`${sumarPrecios(carrito)}<span class="h3">€</span>`
} 


function sumarPrecios(carrito) {
  let total = 0;
  for (const producto of carrito) {
    total += producto.precio * producto.cantidad;
  }
  return total.toFixed(2);
}
function mostrarCarritoFinal(){

   window.document.querySelector(".total-unidades").innerHTML = `(${carrito.length})`;
  console.log(carrito)

  
  document.getElementById('carritoFinal').innerHTML = ''
  
    for( item of carrito){
      document.getElementById('carritoFinal').innerHTML += `          <div class="card-carrito">
      <a href="/detallesProducto.html?id=${item.producto_id}"><img  src="../assets/images/${item.imagen}" alt="${item.nombre}"/></a>
      
      <div class="card-resumen">
        <h4 class="no-margin">${item.nombre}</h4>
  
        <div class="precio">
        ${item.precio}<span>€</span>
        </div>
  
      </div>
  
      <div class="card-cantidad">
        <span class="item-menos" onclick="restarProducto(${item.producto_id})" >-</span>
        <span class="item-number">${item.cantidad}</span>
        <span class="item-mas" onclick="sumarProducto(${item.producto_id})">+</span>
      </div>
  
        <div>
          <button class="btn claro" onclick='borrarProducto(${item.producto_id})'>Eliminar</button>
        </div>
    </div>`
    }
 
  
}

function restarProducto(producto_id) {
  // Buscar el producto en el arreglo
  const producto = carrito.find(p => p.producto_id === producto_id);

  // Verificar si hay suficientes unidades para restar
  if (producto.cantidad > 1) {
    // Restar una unidad
    producto.cantidad--;
    localStorage.setItem('carrito', JSON.stringify(carrito));
    // Actualizar la interfaz de usuario
    location.reload();
  }
}
function sumarProducto(producto_id) {
  // Buscar el producto en el arreglo
  const producto = carrito.find(p => p.producto_id === producto_id);

    // Restar una unidad
    producto.cantidad++;
    localStorage.setItem('carrito', JSON.stringify(carrito));
    // Actualizar la interfaz de usuario
    location.reload();
  
}



function borrarProducto(id){
  const nuevosProductos = carrito.filter(producto => producto.producto_id !== id 
    );
    localStorage.setItem('carrito', JSON.stringify(nuevosProductos));
    location.reload();
  }
  



function agregarCarrito(id, precio, nombre, imagen) {
  let encontrado = false;
  for (let i = 0; i < carrito.length; i++) {
    if (carrito[i].producto_id === id) {
      carrito[i].cantidad += 1;
      encontrado = true;
      break;
    }
  }
  if (!encontrado) {
    carrito.push({
      producto_id: id,
      nombre: nombre,
      imagen: imagen,
      precio: precio,
      cantidad: 1,
    });
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));

  console.table(JSON.parse(localStorage.getItem("carrito")));
  mostrarCarritoFinal()
  location.reload();

}

// function eliminarDelCarrito() {
//   const elementosClaros = document.querySelectorAll('.claro');

//   elementosClaros.forEach(elemento => {
//     elemento.addEventListener('click', () => {
//       carrito.splice(0, 1);
//       localStorage.setItem("carrito", JSON.stringify(carrito)); 
    
//       location.reload();
//     });
   
//   });
  
// }

function sliderCards3(){
let slider3 = null;
let isDown = false;
let startX;
let scrollLeft;
try {
  slider3 = document.querySelector(".cards3");
} catch (error) {
  console.error("No se encontró el elemento con clase .cards3");
}

if (slider3) {
  slider3.addEventListener("mousedown", (e) => {
    isDown = true;

    startX = e.pageX - slider3.offsetLeft;
    scrollLeft = slider3.scrollLeft;
  });

  slider3.addEventListener("mouseleave", (_) => {
    isDown = false;
  });

  slider3.addEventListener("mouseup", (_) => {
    isDown = false;
  });

  slider3.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider3.offsetLeft;
    const SCROLL_SPEED = 3;
    const walk = (x - startX) * SCROLL_SPEED;
    slider3.scrollLeft = scrollLeft - walk;
  });
}
}

function mostrarRecientes(){
  const recientesDiv = document.getElementById('producto-recientes')
  fetch("http://localhost:8000/api/v1/productos", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        for( const producto of data){
          recientesDiv.innerHTML += `

          <div class="card">
          <img src="../assets/images/${producto.imagen}" alt="A12" />
  
          <div class="contenido">
            <h4 class="h6">${producto.nombre}</h4>
  
            <div class="precio">
              ${producto.precio} <span>€</span>
            </div>
  
            <div class="rating h6">
              <span>★★★</span>★★
            </div>
            <p>${producto.descripcion}</p>
  
            <div class="botones">
              <button   class="btn comprar" type="button" onclick="agregarCarrito(${producto.id},${producto.precio},'${producto.nombre}','${producto.imagen}')">Añadir a carrito</button>
              <a class="btnClaro" href="detallesProducto.html?id=${producto.id}&model=${producto.modelos_id}" >Ver</a>
            </div>
  
          </div>



          `
        }
        })

}
