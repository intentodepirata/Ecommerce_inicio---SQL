let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let session = JSON.parse(sessionStorage.getItem("session")) || [];
document.addEventListener("DOMContentLoaded", () => {
  mostrarPedidos();
  mostrarCarrito()
  actualizarCarrito()
  bienvenido()
  logout()
  mostrarDetallePedido()
});

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

function mostrarPedidos() {
  const misPedidosDiv = document.getElementById("misPedidos");


  fetch(`http://localhost:8000/api/v1/pedido/user/${session.usuario.id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + session.token,
    },
  })
    .then((response) => response.json())
    .then((data) => {
        for(const pedido of data){
            misPedidosDiv.innerHTML+=`
      <a onclick="mostrarDetallePedido()" href="/mis-pedidos.html?id=${pedido.id}"><div class="mispedidos-total">
        <div>Pedido N°: ${pedido.id}</div>
        <div>Fecha: ${pedido.fecha}</div>
  
        
        <div class="precio h3">${pedido.total}<span class="h3">€</span></div>
      </div></a>
      
    `;
            
        }





      console.log(data);
    });
}


function mostrarDetallePedido(){
    const params = new URLSearchParams(window.location.search)
    console.log(params.get('id')) 
    const misPedidosDetalleDiv = document.getElementById("mis-pedidos-detalle");
    const misDireccionDiv = document.getElementById("mis-pedidos-direccion");

    fetch(`http://localhost:8000/api/v1/pedido/userjoin/${params.get('id')}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + session.token,
        },
      })
      .then((response) => response.json())
      .then(data =>{ 
        
                const pedidosAgrupados = data.reduce((acumulador, pedido) => {
            const pedidoExistente = acumulador.find(p => p.id === pedido.id);
            if (pedidoExistente) {
              pedidoExistente.fecha = pedido.fecha;
              pedidoExistente.cantidad = pedido.cantidad;
              pedidoExistente.calle = pedido.calle;
              pedidoExistente.numero = pedido.numero;
              pedidoExistente.ciudad = pedido.ciudad;
              pedidoExistente.codigo_postal = pedido.codigo_postal;
              pedidoExistente.provincia = pedido.provincia;
              pedidoExistente.total = pedido.total;
              pedidoExistente.productos.push({
                nombre: pedido.nombre_producto,
                imagen: pedido.imagen,
                cantidad: pedido.cantidad,
                precio: pedido.precio_producto,
                producto_id: pedido.producto_id
              });
            } else {
              acumulador.push({
                id: pedido.id,
                fecha: pedido.fecha,
                productos: [{
                  nombre: pedido.nombre_producto,
                  imagen: pedido.imagen,
                  cantidad: pedido.cantidad,
                  precio: pedido.precio_producto,
                  producto_id: pedido.producto_id
                }],
                cantidad: pedido.cantidad,
                total: pedido.total,
                calle: pedido.calle,
                numero: pedido.numero,
                ciudad: pedido.ciudad,
                codigoPostal: pedido.codigo_postal,
                provincia: pedido.provincia
              });
            }
            return acumulador;
          }, []);
          
          console.log(pedidosAgrupados);

          


for (const pedido of pedidosAgrupados) {
    
    const productosHtml = pedido.productos.map((producto) => 
    
    `
    
 
    <div class="carrito-contenedor">
    
      <div class="card-carrito">
        <a href="/detallesProducto.html?id=${producto.producto_id}">
          <img src="../assets/images/${producto.imagen}" alt="${producto.nombre}">
        </a>
    
        <div class="card-resumen">
          <h4 class="no-margin">${producto.nombre}</h4>
    
          <div class="precio">
          ${producto.precio}<span>€</span>
          </div>
        </div>
    
        <div class="card-cantidad">
          <span class="item-number">${producto.cantidad}</span>
        </div>
    
      </div>
    </div>
    
    `).join('') 
  
    const pedidoHtml = `
      <div class="mispedidos-total-detalle">
        <div>Pedido N°: ${pedido.id}</div>
        <div>Fecha: ${pedido.fecha}</div>
  
        
        <div>Dirección:</div>
        <p>Calle ${pedido.calle}, ${pedido.numero}, ${pedido.ciudad}, ${pedido.codigoPostal}, ${pedido.provincia}</p>
        <div class="precio h3">${pedido.total}<span class="h3">€</span></div>
    </div>
      
    `;
  
    misPedidosDetalleDiv.insertAdjacentHTML("beforeend", productosHtml);
    misDireccionDiv.insertAdjacentHTML("beforeend", pedidoHtml);
  }
        
        
        
        
        
        
        console.log(data)})
}