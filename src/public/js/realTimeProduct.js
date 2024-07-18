const socket = io();
console.log("control funcionamiento");
// En consola del navegador y en terminal avisa si se conecto alguien
socket.on("products", (data) => {
  renderProductos(data);
});

//Funcion para renderizar los productos:
const renderProductos = (data) => {
  const contenedorProductos = document.getElementById("contenedorProductos");
  contenedorProductos.innerHTML = "";

  data.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add('card')
    card.innerHTML = ` <p> Id: ${item.id} </p>
                      <p> Nombre: ${item.title} </p>
                      <p> Descripcion: ${item.description} </p>
                      <p> Precio: $${item.price} </p>
                      <p> Stock: ${item.stock} </p>
                      <p> Code: ${item.code} </p>
                      <button> Eliminar </button> `;

    contenedorProductos.appendChild(card);
    //funcionalidad al boton eliminar:
    card.querySelector("button").addEventListener("click", () => {
      eliminarProducto(item.id);
    });
  });
};
const eliminarProducto = (id) => {
  socket.emit("eliminarProducto", id);
};
//Incorporar products con el form
document.getElementById("btnEnviar").addEventListener("click", () => {
  guardarProduct();
});

const guardarProduct = () => {
  const product = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    price: document.getElementById("price").value,
    img: document.getElementById("img").value,
    stock: document.getElementById("stock").value,
    category: document.getElementById("category").value,
    code: document.getElementById("code").value,
  };
  socket.emit("guardarProducts", product);
};


  const limpiarFormulario = () => {
    (document.getElementById("title").value = ""),
      (document.getElementById("description").value = ""),
      (document.getElementById("price").value = ""),
      (document.getElementById("img").value = ""),
      (document.getElementById("stock").value = ""),
      (document.getElementById("category").value = ""),
      (document.getElementById("code").value = "");
  }
      document.getElementById("btnLimpiar").addEventListener("click", limpiarFormulario);
        
  

    
