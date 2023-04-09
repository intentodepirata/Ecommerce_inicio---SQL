let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let session = JSON.parse(sessionStorage.getItem("session")) || [];
document.addEventListener("DOMContentLoaded", () => {
  pintarCarritoFinal();
  sumarTotal();
  agregarDireccion();
  mostrardirecciones();
  mostrarTarjetaSeleccionada()
  crearPedido();
});

function mostrarTarjetaSeleccionada(){
  const tarjetaDiv = document.getElementById('tarjetaDiv')
  if(session.length <1 || !session.usuario.tarjeta_id){
    return
  }
  fetch(`http://localhost:8000/api/v1/tarjeta/id/${session.usuario.tarjeta_id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json', 'Authorization': 'Bearer ' + session.token
    }
  })
  .then((response) => response.json())
  .then((data) => {
console.log(data)
    tarjetaDiv.innerHTML = ` 
    <label class="tarjeta selected" for="tarjeta">
        <input type="radio" name="tarjeta" id="tarjeta_id${data[0].id}" value="${data[0].id}" checked />
        ${data[0].tipo} **** ${data[0].numero.slice(-4)}
    </label>`


  })
}
function mostrardirecciones() {

  const direccionesDiv = document.getElementById("direcciones");

  fetch(`http://localhost:8000/api/v1/direccion/${session.usuario.id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + session.token,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      for (const direccion of data) {
        direccionesDiv.innerHTML += ` 
          <label class="direccion" for="direccion">
              <input type="radio" name="direccion"  value="${direccion.id}"  />
             Calle: ${direccion.calle} ${direccion.numero}, ${direccion.provincia}, ${direccion.codigo_postal}
          </label>`;
      }
      direccionesDiv.innerHTML += `    <div class="botones">
      
      <button id="direccionButton" class="btn">Seleccionar esta direccion</button>
      <button onclick="mostrarFormDireccion()"  class="btnClaro select direcciones">Nueva Direccion de Envio</button>
      </div>`;
      direccionSelected();
      waitForElement("#direccionButton").then(() => {
        document
          .querySelector("#direccionButton")
          .addEventListener("click", () => {
            setDireccion();
          });
      });
    });

  function waitForElement(selector) {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (document.querySelector(selector)) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });
  }
}

function setDireccion() {
  const selectedOption = document.querySelector(
    'input[name="direccion"]:checked'
  ).value;
  session.usuario.direccion_id = parseInt(selectedOption);
  sessionStorage.setItem("session", JSON.stringify(session));
  console.log(session);
}

function direccionSelected() {
  const labels = document.querySelectorAll(".direccion");
  labels.forEach((label) => {
    label.addEventListener("click", () => {
      // Eliminar la clase "selected" de todos los elementos
      labels.forEach((label) => {
        label.classList.remove("selected");
      });
      // Agregar la clase "selected" al elemento seleccionado
      label.classList.add("selected");
    });
  });
}

console.log(session);

function mostrarFormDireccion() {
  const formDiv = document.getElementById("ocultar");
  formDiv.classList.toggle("none");
}

function agregarDireccion() {
  const mostrarAlertaError = document.getElementById("alertaErrorDireccion");
  const mostrarAlertaExito = document.getElementById("alertaExitoDireccion");

  const formDireccion = document.getElementById("direccionForm");
  const nombreInput = document.getElementById("nombre");
  const apellidosInput = document.getElementById("apellidos");
  const emailInput = document.getElementById("email");
  let usuario_id;
  let email;
  let nombre;
  let apellidos;
 
    nombreInput.value = session.usuario.nombre;
    apellidosInput.value = session.usuario.apellidos;
    emailInput.value = session.usuario.email;
    usuario_id = session.usuario.id;
    email = emailInput.value;
    nombre = nombreInput.value;
    apellidos = apellidosInput.value;
  
  formDireccion.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(formDireccion);

    const telefono = formData.get("telefono");
    const calle = formData.get("calle");
    const numero = formData.get("numero");
    const extra = formData.get("extra");
    const ciudad = formData.get("ciudad");
    const provincia = formData.get("provincia");
    const codigo_postal = formData.get("codigo-postal");
    const pais = formData.get("pais");

    const data = {
      usuario_id,
      telefono,
      calle,
      numero,
      extra,
      ciudad,
      provincia,
      codigo_postal,
      pais,
      nombre,
      apellidos,
      email,
    };
    console.log(JSON.stringify(data));

    fetch("http://localhost:8000/api/v1/direccion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + session.token,
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          let mostrarAlerta = mostrarAlertaError;
          mostrarAlerta.classList.remove("none");
          setTimeout(() => {
            mostrarAlerta.classList.add("none");
          }, 3000);
          console.log(data);
          throw new Error("Error al crear modelo");
        }

        mostrarAlerta = mostrarAlertaExito;
        mostrarAlerta.classList.remove("none");
        setTimeout(() => {
          mostrarAlerta.classList.add("none");
        }, 3000);
        setTimeout(() => {
          location.reload();
        }, 2000);

        console.log(data);
      });
  });
}

function crearPedido() {
  const finalizarCompra = document.getElementById("finalizarCompra");
  finalizarCompra.addEventListener("click", () => {
    const mostrarAlertaError = document.getElementById("alertaErrorPedido");
    const mostrarAlertaError2 = document.getElementById("alertaErrorPedido2");
    const mostrarAlertaExito = document.getElementById("alertaExitoPedido");
    if (session.length < 1) {
      let mostrarAlerta = mostrarAlertaError2;
      mostrarAlerta.classList.remove("none");
      setTimeout(() => {
        mostrarAlerta.classList.add("none");
        window.location.href = "/login.html";
      }, 3000);
      return;
    }

    const usuario_id = session.usuario.id;
    const total = carrito.total;
    const direccion_id = session.usuario.direccion_id;
    const tarjeta_id = session.usuario.tarjeta_id;
    const data = {
      usuario_id,
      total,
      direccion_id,
      tarjeta_id,
    };
    if (!direccion_id || !tarjeta_id || carrito.length == 0) {
      let mostrarAlerta = mostrarAlertaError;
      mostrarAlerta.classList.remove("none");
      setTimeout(() => {
        mostrarAlerta.classList.add("none");
      }, 3000);
      return;
    }

    // console.log(JSON.stringify(data));

    fetch("http://localhost:8000/api/v1/pedido", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + session.token,
      },
    })
      .then((response) => response.json())
      

      .then((data) => {
        
          if (data.error) {
            let mostrarAlerta = mostrarAlertaError;
            mostrarAlerta.classList.remove("none");
            setTimeout(() => {
              mostrarAlerta.classList.add("none");
            }, 3000);
            return
          }
  
          mostrarAlerta = mostrarAlertaExito;
          mostrarAlerta.classList.remove("none");
          setTimeout(() => {
            mostrarAlerta.classList.add("none");
          }, 3000);
          setTimeout(() => {
            localStorage.removeItem("carrito");
            window.location.href = "../index.html";
          }, 3000);
  
          console.log(data);
        
        const pedido_id = data.data;

        carrito.forEach((producto) => {
          const producto_id = producto.producto_id;
          const cantidad = producto.cantidad;
          const precio_producto = producto.precio;
          fetch("http://localhost:8000/api/v1/pedidoproducto", {
            method: "POST",
            body: JSON.stringify({
              pedido_id,
              producto_id,
              cantidad,
              precio_producto,
            }),
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + session.token,
            },
          });
        });

        console.log(data);
      })


  });
}

function sumarTotal() {
  window.document.querySelector("#totalPrecio").innerHTML = `${sumarPrecios(
    carrito
  )}<span class="h3"> €</span>`;
}

function sumarPrecios(carrito) {
  let total = 0;
  for (const producto of carrito) {
    total += producto.precio * producto.cantidad;
  }
  carrito.total = parseFloat(total.toFixed(2));
  localStorage.setItem("carrito", JSON.stringify(carrito));

  return total.toFixed(2);
}

function restarProducto(producto_id) {
  // Buscar el producto en el arreglo
  const producto = carrito.find((p) => p.producto_id === producto_id);

  // Verificar si hay suficientes unidades para restar
  if (producto.cantidad > 1) {
    // Restar una unidad
    producto.cantidad--;
    localStorage.setItem("carrito", JSON.stringify(carrito));
    // Actualizar la interfaz de usuario
    location.reload();
  }
}

function sumarProducto(producto_id) {
  // Buscar el producto en el arreglo
  const producto = carrito.find((p) => p.producto_id === producto_id);

  // Restar una unidad
  producto.cantidad++;
  localStorage.setItem("carrito", JSON.stringify(carrito));
  // Actualizar la interfaz de usuario
  location.reload();
}

function pintarCarritoFinal() {
  console.log(carrito);

  for (item of carrito) {
    document.getElementById(
      "resumenDiv"
    ).innerHTML += `        <div class="card-resumen-finalizar">
          <div class="card-resumen">
            <h4 class="no-margin">${item.nombre}</h4>
            <div class="precio">
              ${item.precio} <span>€</span>
            </div>
          </div>

          <div class="card-cantidad">
            <span class="item-menos" onclick="restarProducto(${item.producto_id})">-</span>
            <span class="item-number">${item.cantidad}</span>
            <span class="item-mas" onclick="sumarProducto(${item.producto_id})">+</span>
          </div>
        </div>`;
  }
}
