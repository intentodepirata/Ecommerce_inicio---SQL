let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let session = JSON.parse(sessionStorage.getItem("session")) || [];

document.addEventListener("DOMContentLoaded", () => {

  isAdmin()
  mostrarCarrito();
  actualizarCarrito();
  bienvenido();
  producto();
  mostrarProductos();
  mostrarOptionsMarcas();
  marca();
  modelo();
  mostrarOptionsModelos() 
 

});

function isAdmin(){
  if(!session || !session.usuario || session.usuario.admin != 1){
    window.location.href = '/index.html'
    console.log("No estás autorizado para acceder a esta sección");
  } else {
    console.log("Bienvenido al panel de administración");
  }
}

function imageUpload(){
  const imagen = document.getElementById('imagenProducto').files[0]
  const formData = new FormData()
  formData.append('imagen', imagen)

  fetch('http://localhost:8000/subir-imagen', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    console.log(data)
    // Aquí puedes añadir el código para guardar el nombre de la imagen en la base de datos
  })
  .catch(error => console.error(error))
}
function producto() {
  const form = document.getElementById("admin-form");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const mostrarAlertaError = document.getElementById("alertaErrorProducto");
    const mostrarAlertaExito = document.getElementById("alertaExitoProducto");
    const nombre = document.getElementById("nombreProducto").value;
    const precio = document.getElementById("precioProducto").value;
    const descripcion = document.getElementById("descripcionProducto").value;
    const categoria_id = document.getElementById("categoriaProducto").value;
    const cantidad = document.getElementById("cantidadProducto").value;
    const rating = document.getElementById("ratingProducto").value;
    const referencia = document.getElementById("referenciaProducto").value;
    const modelos_id = document.getElementById("modelos_id").value;
    const imagenInput = document.getElementById("imagenProducto")
    const imagen = imagenInput.files[0].name; // obtenemos el nombre de la imagen seleccionada

    const data = {
      nombre,
      precio,
      descripcion,
      categoria_id,
      cantidad,
      rating,
      referencia,
      modelos_id,
      imagen,
    };
    // console.log(JSON.stringify(data));

    fetch("http://localhost:8000/api/v1/productos/", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
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
        console.log(data)
        throw new Error("Error al crear modelo");
      }
      imageUpload()

      mostrarAlerta = mostrarAlertaExito;
      mostrarAlerta.classList.remove("none");
      setTimeout(() => {
        mostrarAlerta.classList.add("none");
      }, 3000);
      setTimeout(() => {
        window.location.reload()
      }, 1000);
      console.log(data);

    });
  });

}

function mostrarCarrito() {
  if (carrito.length >= 1) {
    document.getElementById("numerito").style = " ";
  }
}

function actualizarCarrito() {
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
  const loginButton = document.getElementById("loginButton");
  loginButton.addEventListener("click", () => {
    sessionStorage.removeItem("session");
   
  });
}

function mostrarProductos() {
  const listadoProductos = document.getElementById("listado-Productos");

  fetch("http://localhost:8000/api/v1/productos/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      for (const producto of data) {
        listadoProductos.innerHTML += `
          <tr>
          <td>${producto.id}</td>
          <td>${producto.nombre}</td>
          <td>${producto.descripcion}</td>
          <td>${producto.precio}€</td>
          <td><img src="../assets/images/${producto.imagen}" alt="imagen producto" ></td>
          <td>${producto.categoria_id}</td>
          <td>${producto.cantidad}</td>
          <td>${producto.rating}</td>
          <td>${producto.referencia}</td>
          <td>${producto.modelos_id}</td>
          <td></td>
          <td class="acciones-boton">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-edit" width="32" height="32" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffbf00" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M9 7h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />
          <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />
          <line x1="16" y1="5" x2="19" y2="8" />
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-trash" width="32" height="32" viewBox="0 0 24 24" stroke-width="1.5" stroke="#CA054C" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <line x1="4" y1="7" x2="20" y2="7" />
        <line x1="10" y1="11" x2="10" y2="17" />
        <line x1="14" y1="11" x2="14" y2="17" />
        <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
        <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
      </svg>
      </td>
        </tr>
          `;
      }

      
    });
}

function mostrarOptionsMarcas() {
  const marcaOptions = document.getElementById("marcaModelo");
  marcaOptions.innerHTML = `
    <option value="" disabled selected>Marcas</option>`;
  fetch("http://localhost:8000/api/v1/marca/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      for (const marca of data) {
        marcaOptions.innerHTML += `
        <option value="${marca.id}">${marca.marca}</option>
        
        
        `;
      }
    });
}
function mostrarOptionsModelos() {
  const modelosOptions = document.getElementById("modelos_id");
  modelosOptions.innerHTML = `
    <option value="" disabled selected>Modelos</option>`;
  fetch("http://localhost:8000/api/v1/modelo/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      for (const modelo of data) {
        modelosOptions.innerHTML += `
        <option value="${modelo.id}">${modelo.modelo}</option>
        
        
        `;
      }
    });
}

function marca() {
  const form = document.getElementById("marca-form");
  const mostrarAlertaError = document.getElementById("alertaErrorMarca");
  const mostrarAlertaExito = document.getElementById("alertaExitoMarca");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const marca = document.getElementById("nombreMarca").value;

    const data = {
      marca,
    };

    console.log(JSON.stringify(data));

    fetch("http://localhost:8000/api/v1/marca", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
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
          console.log(data);
          throw new Error("Error al crear modelo");
        }

        mostrarAlerta = mostrarAlertaExito;
        mostrarAlerta.classList.remove("none");
        setTimeout(() => {
          mostrarAlerta.classList.add("none");
        }, 3000);
        setTimeout(() => {
          window.location.reload()
        }, 1000);
   
        console.log(data)
      }
      
      );
  });
  // location.reload()
  // marca.value = "";
}

function modelo() {
  const form = document.getElementById("modelo-form");
  const mostrarAlertaError = document.getElementById("alertaErrorModelo");
  const mostrarAlertaExito = document.getElementById("alertaExitoModelo");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const modelo = document.getElementById("nombreModelo").value;
    const marcas_id = document.getElementById("marcaModelo").value;
    const descripcion_modelo =
      document.getElementById("descripcionModelo").value;

    const data = {
      modelo,
      marcas_id,
      descripcion_modelo,
    };
    console.log(JSON.stringify(data));

    fetch("http://localhost:8000/api/v1/modelo/", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
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
          console.log(data)
          throw new Error("Error al crear modelo");
        }

        mostrarAlerta = mostrarAlertaExito;
        mostrarAlerta.classList.remove("none");
        setTimeout(() => {
          mostrarAlerta.classList.add("none");
        }, 3000);
        setTimeout(() => {
          window.location.reload()
        }, 1000);


        console.log(data);
      });
  });

  
}
