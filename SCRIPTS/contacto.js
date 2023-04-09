
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let session =
  JSON.parse(sessionStorage.getItem("session")) || [];


document.addEventListener("DOMContentLoaded", () => {
    mostrarCarrito()
    actualizarCarrito()
    bienvenido()
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
  

  function logout() {
    const loginButton = document.getElementById("loginButton")
    loginButton.addEventListener('click',()=>{
      sessionStorage.removeItem("session");
       // localStorage.removeItem("carrito");
    })
    
  
  }