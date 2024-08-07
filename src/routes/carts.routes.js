import express from "express";
import CartManager from "../dao/db/cart-manager-db.js";
import mongoose from "mongoose";
const router = express.Router();
const cartManager = new CartManager();

// Ruta para crear un carrito y añadir productos
router.post("/", async (req, res) => {
  try {
    const nuevoCarrito = await cartManager.crearCarrito();
    res.json(nuevoCarrito);
  } catch (error) {
    console.error("No se ha podido crear el carrito", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

//ruta para visualizar el carrito
router.get("/", async (req, res) => {
  try {
    const cart = await cartManager.obtenerCarritos();
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error al listar los carritos", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Ruta que da los productos dentro de un carrito:
router.get("/:cid", async (req, res) => {
   const cartId = req.params.cid;
  
 if(!mongoose.Types.ObjectId.isValid(cartId)){
  return res.status(400).json({ error: "ID de carrito no válido" });
 }

  try {
    // console.log(`Buscando carrito con ID: ${cartId}`)
    const carrito = await cartManager.getCarritoById(cartId);
  //  console.log(`Carrito encontrado: ${JSON.stringify(carrito,null,2)}`)
   
   if (!carrito) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }
    res.json(carrito.prodsAgregado);
  } catch (error) {
    console.error("No se pudo obtener el carrito", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.body.quantity || 1;

  if (!ObjectId.isValid(cartId)) {
    return res.status(400).json({ error: "CID de carrito no válido" });
  }

  try {
    const carritoActualizado = await cartManager.agregarProductoAlCarrito(cartId, productId, quantity);
    if (carritoActualizado) {
      res.json(carritoActualizado.prodsAgregado);
    } else {
      res.status(404).json({ error: "Carrito o producto no encontrado" });
    }
  } catch (error) {
    console.error("No se pudo agregar productos al carrito", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }}
)
router.delete("/:cid/products/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;

  try {
    const carritoActualizado = await cartManager.eliminarProductoDelCarrito(
      cartId,
      productId
    );
    if (carritoActualizado) {
      res.json(carritoActualizado.products);
    } else {
      res.status(404).json({ error: "Carrito o producto no encontrado" });
    }
  } catch (error) {
    console.error("Error al eliminar producto del carrito", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.put("/:cid", async (req, res) => {
  const cartId = req.params.cid;
  const productos = req.body.products;

  try {
    const carritoActualizado = await cartManager.actualizarCarrito(
      cartId,
      productos
    );
    if (carritoActualizado) {
      res.json(carritoActualizado.products);
    } else {
      res.status(404).json({ error: "Carrito no encontrado" });
    }
  } catch (error) {
    console.error("Error al actualizar el carrito", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.put("/:cid/products/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.body.quantity;

  try {
    const carritoActualizado = await cartManager.actualizarCantidad(
      cartId,
      productId,
      quantity
    );
    if (carritoActualizado) {
      res.json(carritoActualizado.products);
    } else {
      res.status(404).json({ error: "Carrito o producto no encontrado" });
    }
  } catch (error) {
    console.error("Error al cambiar cantidades en el carrito", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.delete("/:cid", async (req, res) => {
  const cartId = req.params.cid;

  try {
    const carritoActualizado = await cartManager.eliminarTodosLosProductos(cartId);
    if (carritoActualizado) {
      res.json(carritoActualizado.products);
    } else {
      res.status(404).json({ error: "Carrito no encontrado" });
    }
  } catch (error) {
    console.error("Error al eliminar todos los productos del carrito", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
})
  
export default router;
