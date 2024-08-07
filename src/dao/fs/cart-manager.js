
import CartModel from '../models/cart.model.js';

class CartManager {
  async crearCarrito() {
    try {
      const nuevoCarrito = new CartModel();
      await nuevoCarrito.save();
      return nuevoCarrito;
    } catch (error) {
      console.error("Error al crear el carrito:", error);
      throw error;
    }
  }

  async obtenerCarritos() {
    try {
      const carritos = await CartModel.find();
      return carritos;
    } catch (error) {
      console.error("Error al obtener los carritos:", error);
      throw error;
    }
  }

  async getCarritoByCid(cid) {
    try {
      const carrito = await CartModel.findOne({ cid }).populate('prodsAgregado.product');
      return carrito;
    } catch (error) {
      console.error("Error al obtener el carrito por CID:", error);
      throw error;
    }
  }

  async agregarProductoAlCarrito(cid, productId, quantity) {
    try {
      const carrito = await CartModel.findOne({ cid });
      if (!carrito) throw new Error("Carrito no encontrado");

      const productIndex = carrito.prodsAgregado.findIndex(p => p.product.toString() === productId);
      if (productIndex >= 0) {
        carrito.prodsAgregado[productIndex].quantity += quantity;
      } else {
        carrito.prodsAgregado.push({ product: productId, quantity });
      }

      await carrito.save();
      return carrito;
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error);
      throw error;
    }
  }

  async eliminarProductoDelCarrito(cid, productId) {
    try {
      const carrito = await CartModel.findOne({ cid });
      if (!carrito) throw new Error("Carrito no encontrado");

      carrito.prodsAgregado = carrito.prodsAgregado.filter(p => p.product.toString() !== productId);
      await carrito.save();
      return carrito;
    } catch (error) {
      console.error("Error al eliminar producto del carrito:", error);
      throw error;
    }
  }

  async actualizarCarrito(cid, productos) {
    try {
      const carrito = await CartModel.findOne({ cid });
      if (!carrito) throw new Error("Carrito no encontrado");

      carrito.prodsAgregado = productos;
      await carrito.save();
      return carrito;
    } catch (error) {
      console.error("Error al actualizar el carrito:", error);
      throw error;
    }
  }

  async actualizarCantidad(cid, productId, quantity) {
    try {
      const carrito = await CartModel.findOne({ cid });
      if (!carrito) throw new Error("Carrito no encontrado");

      const productIndex = carrito.prodsAgregado.findIndex(p => p.product.toString() === productId);
      if (productIndex >= 0) {
        carrito.prodsAgregado[productIndex].quantity = quantity;
        await carrito.save();
      } else {
        throw new Error("Producto no encontrado en el carrito");
      }

      return carrito;
    } catch (error) {
      console.error("Error al actualizar la cantidad en el carrito:", error);
      throw error;
    }
  }

  async eliminarTodosLosProductos(cid) {
    try {
      const carrito = await CartModel.findOne({ cid });
      if (!carrito) throw new Error("Carrito no encontrado");

      carrito.prodsAgregado = [];
      await carrito.save();
      return carrito;
    } catch (error) {
      console.error("Error al eliminar todos los productos del carrito:", error);
      throw error;
    }
  }
}

export default CartManager;
