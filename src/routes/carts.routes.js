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
  const productId = req.body.quantity || 1;
  try {
    const actualizarCarrito = await cartManager.agregarProductoAlCarrito(cartId,productId,quantity);
    res.json(actualizarCarrito.products)
  } catch (error) {
    console.log('No se pudo agregar productos al carrito', error)
    res.status(500).json({ error: 'Error del server'});
  }
});

// Ruta que no está definida, da un aviso
router.get("*", (req, res) => {
  return res.status(404).send("Ruta no definida");
});

export default router;
