
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let session =
  JSON.parse(sessionStorage.getItem("session")) || [];

addEventListener("DOMContentLoaded", (event) => {
  login() 
  registro()
  bienvenido()
  logout()
  mostrarCarrito();
  actualizarCarrito()
});

function login() {
  const form = document.querySelector("#login-form");
  

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const mostrarAlertaError = document.getElementById("alertaError");
    const mostrarAlertaExito = document.getElementById("alertaExito");
    const email = form.email.value;
    const password = form.password.value;

    try {
      const response = await fetch("http://localhost:8000/api/v1/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        form.email.value = ''
        form.password.value = ''
        let mostrarAlerta = mostrarAlertaError;
        mostrarAlerta.classList.remove("none");
        setTimeout(() => {
          mostrarAlerta.classList.add("none");
        }, 5000);
        throw new Error("Error al iniciar sesión");
      }
      mostrarAlerta = mostrarAlertaExito;
      alertaExito.classList.remove("none");
      setTimeout(() => {
        alertaExito.classList.add("none");
      }, 1000);
      setTimeout(() => {
        window.location.href = "/index.html";
      }, 1000);
      const data = await response.json();
      console.log("Respuesta de la API:", data);

      // Guardar la respuesta en sessionStorage
      sessionStorage.setItem("session", JSON.stringify(data));

      // Si la respuesta es exitosa, redirigir al usuario a la página de inicio
      window.location.href = "/index.html";
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  });
}

function registro() {
  const form2 = document.querySelector('#register-form')
  form2.addEventListener('submit', async (event)=>{
    event.preventDefault()
   
    const inputNombre = document.getElementById("inputNombre");
    const inputApellidos = document.getElementById("inputApellidos");
    const inputEmail = document.getElementById("inputEmail");
    const inputPassword = document.getElementById("inputPassword");
    const mostrarAlertaErrorRegistro = document.getElementById(
      "alertaErrorRegistro"
    );
    const mostrarAlertaExitoRegistro = document.getElementById(
      "alertaExitoRegistro"
    );

    if (
      !inputNombre.value ||
      !inputApellidos.value||
      !inputEmail.value ||
      !inputPassword.value
    ) {
      inputNombre.value = ''
      inputApellidos.value= ''
      inputEmail.value = ''
      inputPassword.value = ''
      mostrarAlertaErrorRegistro.classList.remove("none");
      setTimeout(() => {
        mostrarAlertaErrorRegistro.classList.add("none");
      }, 5000);
      return;
    }
    const nombre = inputNombre.value 
    const apellidos =  inputApellidos.value
    const email = inputEmail.value
    const password = inputPassword.value
    console.log( {nombre,apellidos,email,password})
    try{
  const response = await fetch('http://localhost:8000/api/v1/user/register',{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({nombre:nombre,apellidos:apellidos, email:email, password:password})
  })     

  if(!response.ok){
    inputNombre.value = ''
    inputApellidos.value = ''
    inputEmail.value = ''
    inputPassword.value = ''
    mostrarAlertaErrorRegistro.classList.remove("none");
    setTimeout(() => {
      mostrarAlertaErrorRegistro.classList.add("none");
    }, 5000);
    throw new Error("Error al Registrarse");
   
  }
  const data = await response.json();
  console.log("Respuesta de la API:", data);
  inputNombre.value = ''
  inputApellidos.value = ''
  inputEmail.value = ''
  inputPassword.value = ''

  mostrarAlertaExitoRegistro.classList.remove("none");
  setTimeout(() => {
    mostrarAlertaExitoRegistro.classList.add("none");
  }, 5000);

    }
    catch (error) {
      console.error("Error al iniciar sesión:", error);
    }



  })


}


function bienvenido(){
  const loginButton = document.getElementById("loginButton");
  const bienvenido = document.getElementById("bienvenido");
  console.table(session);
 
  
  if (session.usuario) {
    loginButton.innerText = "Logout";
    bienvenido.innerText = `Bienvenido: ${session.usuario.nombre}`;
  }
}

function logout() {
  const loginButton = document.getElementById("loginButton")
  loginButton.addEventListener('click',()=>{
    sessionStorage.removeItem("session");
    localStorage.removeItem("carrito");
  })
  

}

function mostrarCarrito() {
  if (carrito.length >= 1) {
    document.getElementById("numerito").style = " ";
  }
}

function actualizarCarrito() {
  window.document.getElementById("numerito").innerText = carrito.length;
}
