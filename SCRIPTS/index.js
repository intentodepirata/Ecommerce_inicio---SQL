
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let session = JSON.parse(sessionStorage.getItem("session")) || [];

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".carousel-container").forEach((carousel) => {
    insertNumbers(carousel);

    carousel.querySelector(".prev").addEventListener("click", (e) => {
      minusItem(carousel);
    });

    carousel.querySelector(".next").addEventListener("click", () => {
      plusItem(carousel);
    });

    setInterval(() => {
      plusItem(carousel);
    }, 5000);

    insertDots(carousel);

    carousel.querySelectorAll(".dot").forEach((dot) => {
      dot.addEventListener("click", (e) => {
        let item = Array.prototype.indexOf.call(
          e.target.parentNode.children,
          e.target
        );

        showItems(carousel, item);
      });
    });
    showItems(carousel, 0);
  });
  sliderCards();
  sliderCards2();
  mostrarCarrito();
  actualizarCarrito();
  bienvenido();

  logout();
  mostrarPantallas();
  mostrarBaterias();
});

function insertNumbers(carousel) {
  const length = carousel.querySelectorAll(".item").length;
  for (let i = 0; i < length; i++) {
    const nmbr = document.createElement("div");
    nmbr.classList.add("numbertext");
    nmbr.innerText = i + 1 + " / " + length;

    carousel.querySelectorAll(".item")[i].append(nmbr);
  }
}

function insertDots(carousel) {
  const dots = document.createElement("div");
  dots.classList.add("dots");

  carousel.append(dots);

  carousel.querySelectorAll(".item").forEach((elem) => {
    const dot = document.createElement("div");
    dot.classList.add("dot");

    carousel.querySelector(".dots").append(dot);
  });
}

function plusItem(carousel) {
  let item = currentItem(carousel);

  carousel
    .querySelectorAll(".item")
    [item].nextElementSibling.classList.contains("item")
    ? showItems(carousel, item + 1)
    : showItems(carousel, 0);
}

function minusItem(carousel) {
  let item = currentItem(carousel);

  carousel.querySelectorAll(".item")[item].previousElementSibling != null
    ? showItems(carousel, item - 1)
    : showItems(carousel, carousel.querySelectorAll(".item").length - 1);
}

function currentItem(carousel) {
  return [...carousel.querySelectorAll(".item")].findIndex(
    (item) => item.style.display == "block"
  );
}

function showItems(carousel, item) {
  if (carousel.querySelectorAll(".item")[currentItem(carousel)] != undefined)
    carousel.querySelectorAll(".item")[currentItem(carousel)].style.display =
      "none";
  carousel.querySelectorAll(".item")[item].style.display = "block";

  if (carousel.querySelector(".dot.active") != null)
    carousel.querySelector(".dot.active").classList.remove("active");
  carousel.querySelectorAll(".dot")[item].classList.add("active");
}
function sliderCards() {
  let slider = null;
  let isDown = false;
  let startX;
  let scrollLeft;
  try {
    slider = document.querySelector(".cards");
  } catch (error) {
    console.error("No se encontró el elemento con clase .cards");
  }

  if (slider) {
    isDown = false;

    slider.addEventListener("mousedown", (e) => {
      isDown = true;

      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener("mouseleave", (_) => {
      isDown = false;
    });

    slider.addEventListener("mouseup", (_) => {
      isDown = false;
    });

    slider.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const SCROLL_SPEED = 3;
      const walk = (x - startX) * SCROLL_SPEED;
      slider.scrollLeft = scrollLeft - walk;
    });
  }
}

// carousel cards 2
function sliderCards2() {
  let slider2 = null;
  let isDown = false;
  let startX;
  let scrollLeft;
  try {
    slider2 = document.querySelector(".cards2");
  } catch (error) {
    console.error("No se encontró el elemento con clase .cards2");
  }

  if (slider2) {
    slider2.addEventListener("mousedown", (e) => {
      isDown = true;

      startX = e.pageX - slider2.offsetLeft;
      scrollLeft = slider2.scrollLeft;
    });

    slider2.addEventListener("mouseleave", (_) => {
      isDown = false;
    });

    slider2.addEventListener("mouseup", (_) => {
      isDown = false;
    });

    slider2.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider2.offsetLeft;
      const SCROLL_SPEED = 3;
      const walk = (x - startX) * SCROLL_SPEED;
      slider2.scrollLeft = scrollLeft - walk;
    });
  }
}

function mostrarCarrito() {
  if (carrito.length >= 1) {
    document.getElementById("numerito").style = " ";
  }
}

function actualizarCarrito() {
  window.document.getElementById("numerito").innerText = carrito.length;
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

  window.document.getElementById("numerito").innerText = carrito.length;

  mostrarCarrito();
  console.log(window.document.getElementById("numerito").innerText);
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
    // localStorage.removeItem("carrito");
  });
}

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
// prevBtn.addEventListener("click", mostrarTestimonioAnterior);
// nextBtn.addEventListener("click", mostrarTestimonioSiguiente);

// mostrarTestimonio();
setInterval(() => {
  mostrarTestimonioSiguiente();
}, 8000);

function mostrarPantallas() {
  const pantallasDiv = document.getElementById("seccion-pantallas");
  fetch("http://localhost:8000/api/v1/productos/categoria/1", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      for (const producto of data) {
        pantallasDiv.innerHTML += `

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



          `;
      }
    });
}
function mostrarBaterias() {
  const bateriasDiv = document.getElementById("seccion-baterias");
  fetch("http://localhost:8000/api/v1/productos/categoria/2", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      for (const producto of data) {
        bateriasDiv.innerHTML += `

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



          `;
      }
    });
}
