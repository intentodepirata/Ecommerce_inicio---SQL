const params = new URLSearchParams(window.location.search)
console.log(params.get('model')) 
// console.log(params.get('id'))
const url = `http://localhost:8000/api/v1/productos/${params.get('id')}`
let cantidad = 1

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let session =
  JSON.parse(sessionStorage.getItem("session")) || [];


document.addEventListener("DOMContentLoaded", () => {
    mostrarCarrito()
    actualizarCarrito()
    bienvenido()
    mostrarProducto()
   
    logout() 
   
})

function mostrarCarrito(){
  if (carrito.length >=1) {
    document.getElementById("numerito").style = " ";
  }
}
  
  function actualizarCarrito(){
      window.document.getElementById("numerito").innerText = carrito.length;
  }
  
  function bienvenido() {
    const loginButton = document.getElementById("loginButton");
    const bienvenido = document.getElementById("bienvenido");
    console.table(session);
  
    if (session.usuario) {
      loginButton.innerText = "Logout";
      bienvenido.innerText = `Bienvenido: ${session.usuario.nombre}`;
    } 
    if (typeof session.usuario !== 'undefined' && session.usuario.admin == 1){
      bienvenido.href = "/admin.html"
      bienvenido.innerText = `Bienvenido Admin: ${session.usuario.nombre}`;
    }
  
  }
  

// function logout() {
//   const loginButton = document.getElementById("loginButton");
//   loginButton.addEventListener("click", () => {
//     sessionStorage.removeItem("session");
//     sessionStorage.removeItem("carrito");
//   });
// }


  const testimonios = document.querySelectorAll(".testimonio");
const prevBtn = document.querySelector(".prevTestimonio");
const nextBtn = document.querySelector(".nextTestimonio");
let activeIndex = 0;

function mostrarTestimonio() {
  testimonios.forEach((testimonio) => testimonio.classList.remove("active"));
  testimonios[activeIndex].classList.add("active");
}
function mostrarTestimonioAnterior() {
  activeIndex--;
  if (activeIndex < 0) {
    activeIndex = testimonios.length - 1;
  }
  mostrarTestimonio();
}
function mostrarTestimonioSiguiente() {
  activeIndex++;
  if (activeIndex >= testimonios.length) {
    activeIndex = 0;
  }
  mostrarTestimonio();
}

setInterval(() => {
  mostrarTestimonioSiguiente();
}, 8000);



function mostrarProducto(){
  const productDiv = document.querySelector('.product-info')
  fetch(url ,{
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
  .then(response => response.json())
  .then(data => { console.log(data[0])
    const producto = data[0]

    productDiv.innerHTML =
    ` <img
    src="../assets/images/${producto.imagen}"
    alt="${producto.nombre}" />
    <div class="product-content">
    <div id="nav-detalles" class="nav-detalle">
  
    </div>
    <h2 class="no-margin">${producto.nombre}</h2>
    <p class="no-margin">${producto.descripcion}
    </p>
    <div class="precio h3">
      ${producto.precio}<span>€</span>
    </div>
    
    
    <div class="card-cantidad">
      <span class="item-menos" onclick="restar()">-</span>
      <span id='detalleCantidad' class="item-number">${cantidad}</span>
      <span class="item-mas-detalle" onclick="sumar()">+</span>
      <button   class="btn-detalle" type="button" onclick="agregarCarrito(${producto.id},${producto.precio},'${producto.nombre}','${producto.imagen}', ${cantidad})">Añadir a carrito</button></div>
    <div class="garantia-texto">
    
      <img src="/assets/icons/shield-tick.svg" alt="shield tick">
      <p>Incluye <span>2 años</span> de garantía</p>
    </div>
    </div>`
  })
 .then(data=>{
  mostrarNavDetalle()
 }) 
}

function mostrarNavDetalle(){
  // const navDetalle = document.getElementById('nav-detalles')
  
  fetch(`http://localhost:8000/api/v1/modelo/marca/${params.get('model')}` ,{
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
  .then(response => response.json())
  .then(data =>{
    const navDetalle = document.getElementById('nav-detalles') 
    console.log(data)
    navDetalle.innerHTML =`
    <p class="no-margin">${data[0].marca}</p>
    <img src="../assets/icons/arrowslim-right.svg" alt="flecha">
    <p class="no-margin">${data[0].modelo}</p>
    `


    
  })


}

function sumar(){
  cantidad++
  let detalleCantidad = document.getElementById('detalleCantidad')
  detalleCantidad.innerHTML = cantidad
  console.log(cantidad)
}
function restar(){

  if(cantidad>1){

    cantidad--
  }
  let detalleCantidad = document.getElementById('detalleCantidad')
  detalleCantidad.innerHTML = cantidad
  console.log(cantidad)
}

function agregarCarrito(id, precio, nombre, imagen,cantidad) {
  let encontrado = false;
  for (let i = 0; i < carrito.length; i++) {
    if (carrito[i].producto_id === id) {
      carrito[i].cantidad += cantidad;
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
      cantidad: cantidad,
    });
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));

  console.table(JSON.parse(localStorage.getItem("carrito")));
  
  window.document.getElementById("numerito").innerText = carrito.length;

  mostrarCarrito();
  console.log(window.document.getElementById("numerito").innerText);
  

}
function logout() {
  const loginButton = document.getElementById("loginButton");
  loginButton.addEventListener("click", () => {
    sessionStorage.removeItem("session");
    // localStorage.removeItem("carrito");
  });
}

