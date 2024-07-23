import express from "express";
const router = express.Router();

import CartManager from "../dao/db/cart-manager-db.js";
const cartManager = new CartManager();

// Ruta para crear un carrito y añadir productos
router.post("/", async (req, res) => {
  try {
    const nuevoCarrito = await cartManager.crearCarrito();
    res.json(nuevoCarrito);
  } catch (error) {
    console.log("No se ha podido crear el carrito", error);
    res.status(500).json({
      error: "Error del servidor",
    });
  }
});

// Ruta que da los productos dentro de un carrito:
router.get("/:cid", async (req, res) => {
  const cId = req.params.cid;
  try {
    const carrito = await cartManager.getCarritoById(cId);
    res.json(carrito.products);
  } catch (error) {
    console.log("No se pudo obtener el carrito", error);
    res.status(500).json({
      error: "Error del server",
    });
  }
});

//Ruta para agregar productos a distintos carritos:
router.post('/:cid/product/:pid', async (req,res) =>{
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.body.quantity || 1;
  try {
    const actualizarCarrito = await cartManager.agregarProductoAlCarrito(cartId,productId,quantity);
    res.json(actualizarCarrito.products)
  } catch (error) {
    console.log('No se pudo agregar productos al carrito', error)
    res.status(500).json({ error: 'Error del server'});
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;

  try {
      const actualizarCarrito = await cartManager.eliminarProductoDelCarrito(cartId, productId);
      if (actualizarCarrito) {
          res.json(actualizarCarrito.products);
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
      const actualizarCarrito = await cartManager.actualizarCarrito(cartId, productos);
      if (actualizarCarrito) {
          res.json(actualizarCarrito.products);
      } else {
          res.status(404).json({ error: "Carrito no encontrado" });
      }
  } catch (error) {
      console.error("Error al actualizar el carrito", error);
      res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.delete("/:cid", async (req, res) => {
  const cartId = req.params.cid;

  try {
      const actualizarCarrito = await cartManager.eliminarTodosLosProductos(cartId);
      if (actualizarCarrito) {
          res.json(actualizarCarrito.products);
      } else {
          res.status(404).json({ error: "Carrito no encontrado" });
      }
  } catch (error) {
      console.error("Error al eliminar todos los productos del carrito", error);
      res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Ruta que no está definida, da un aviso
router.get("*", (req, res) => {
  return res.status(404).send("Ruta no definida");
});

export default router;
