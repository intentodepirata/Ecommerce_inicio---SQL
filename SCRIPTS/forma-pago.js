let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let session = JSON.parse(sessionStorage.getItem("session")) ;

document.addEventListener("DOMContentLoaded", () => {

    if(session){
        addTarjeta()
        mostrarTarjetas()
        tarjetaSelected()
    }
 
})

function addTarjeta(){
    const formTarjeta = document.getElementById('form-tarjeta');
    const mostrarAlertaError = document.getElementById("alertaErrorTarjeta");

    const mostrarAlertaExito = document.getElementById("alertaExitoTarjeta");


    formTarjeta.addEventListener('submit', (event) => {
      event.preventDefault();

    //   id, usuario_id, nombre_en_tarjeta, numero, vencimiento_mes, vencimiento_anio, cvv
      const formData = new FormData(formTarjeta);
      let usuario_id
      if(session){
         usuario_id = session.usuario.id

      }
      const numero = formData.get('tarjeta');
      const nombre_en_tarjeta = formData.get('titular');
      const vencimiento_mes = formData.get('caducidadMes');
      const vencimiento_anio = formData.get('caducidadAnio');
      const cvv = formData.get('cvv');
      const tipo = formData.get('tipo');
    
      const data = {
        usuario_id,
        numero,
        nombre_en_tarjeta,
        vencimiento_mes,
        vencimiento_anio,
        cvv,
        tipo
      };

      console.log(JSON.stringify(data))
   
    
      fetch('http://localhost:8000/api/v1/tarjeta', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 'Authorization': 'Bearer ' + session.token
        },
        body: JSON.stringify(data)
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
          location.reload()
        }, 3000);
        console.log(data);
  
      });
         
    });
    
}


function mostrarTarjetas(){
  if(session.length <1){
    return
  }
const tarjetasForm = document.getElementById('tarjetaForm')

fetch(`http://localhost:8000/api/v1/tarjeta/${session.usuario.id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json', 'Authorization': 'Bearer ' + session.token
    }
  })
  .then((response) => response.json())
  .then((data) => {
    for(const tarjeta of data){
        tarjetasForm.innerHTML += ` 
        <label class="tarjeta" for="tarjeta">
            <input type="radio" name="tarjeta" id="tarjeta_id${tarjeta.id}" value="${tarjeta.id}" />
            ${tarjeta.tipo} **** ${tarjeta.numero.slice(-4)}
        </label>`

    }
    tarjetasForm.innerHTML +=`    <a href="../finalizar-compra.html"><button id="payButton" class="btn">Pagar con esta tarjeta</button></a>`
    tarjetaSelected()
    waitForElement("#payButton").then(() => {
      document.querySelector("#payButton").addEventListener("click", () => {
        setTarjeta();
      });
    });

  })
  
  
}

function waitForElement(selector) {
  return new Promise(resolve => {
    const interval = setInterval(() => {
      if (document.querySelector(selector)) {
        clearInterval(interval);
        resolve();
      }
    }, 100);
  });
}

function setTarjeta(){

  const selectedOption = document.querySelector('input[name="tarjeta"]:checked').value;
  session.usuario.tarjeta_id =parseInt(selectedOption) ;
  sessionStorage.setItem("session", JSON.stringify(session));
  console.log(session)
;
}


function tarjetaSelected(){
    const labels = document.querySelectorAll(".tarjeta");
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