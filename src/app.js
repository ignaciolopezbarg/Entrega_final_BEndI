import express from "express";
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import productsRouter, { getProducts,deleteProduct,guardarProducts} from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.routes.js";
import viewsRouter from "./routes/vistas.routes.js";
import './db.connection.js';

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./src/public'));


// Motores de Plantilla
app.engine('.hbs', engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views','./src/views');


app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use('/',viewsRouter);

const httpServer = app.listen(PORT, () => 
    console.log(`Server listening on port: ${PORT}`));

const io = new Server(httpServer);

io.on ('connection', async (socket) => {
    console.log('Se conecto un cliente')

//desde el servidor enviamos el array de productos al front
socket.emit('products', await getProducts())
//recibimos el pedido para eliminar producto desde el cliente
socket.on('eliminarProducto', async (id) => {
    deleteProduct(id);
    //se envia la nueva lista al cliente:
    io.sockets.emit('products',await getProducts());
})
//se agregan products por el form
socket.on('guardarProducts', async (product) => {
    const products = await getProducts();
    const id = products.length > 0 ? products[products.length - 1].id + 1 : 1;
    const newProduct = { id, ...product };
    products.push(newProduct);
    guardarProducts(products);
    io.sockets.emit('products', await getProducts());
  });
  
// se actualiza la vista

})
