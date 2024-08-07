import CartModel from "../fs/data/cart.model.js"; 

 class CartManager {
  async crearCarrito() {
    try {
      const nuevoCarrito = new CartModel({ products: [] });
      await nuevoCarrito.save();
      return nuevoCarrito;
    } catch (error) {
      console.log("Error al crear carrito", error);
      throw error;
    }
  }

  async getCarritoById(cartId) {
    try {
      const carrito = await CartModel.findById(cartId).populate("products.product").lean();

      if (!carrito) {
        throw new Error(`No existe un carrito con el id ${cartId}`);
      }
      return carrito;
    } catch (error) {
      console.error("Error al obtener el carrito por ID", error);
      throw error;
    }
  }

  async obtenerCarritos() {
    try {
      const carts = await CartModel.find();
      return carts;
    } catch (error) {
      console.log("Error para obtener los carritos", error);
      throw error;
    }
  }

  async agregarProductoAlCarrito(cartId, productId, quantity = 1) {
    try {
      const carrito = await this.getCarritoById(cartId);
      const existeProducto = carrito.products.find(
        (item) => item.product.toString() === productId
      );

      if (existeProducto) {
        existeProducto.quantity += quantity;
      } else {
        carrito.products.push({ product: productId, quantity });
      }
      // Marcar la propiedad "products" como modificada antes de guardar
      carrito.markModified("products");
      await carrito.save();
      return carrito;
    } catch (error) {
      console.error("Error al agregar producto al carrito", error);
      throw error;
    }
  }

  async eliminarProductoDelCarrito(cartId, productId) {
    try {
      const carrito = await this.getCarritoById(cartId);
      carrito.products = carrito.products.filter(
        (item) => item.product._id.toString() !== productId
      );
      carrito.markModified("products");
      await carrito.save(); // Save changes after filtering
      return carrito;
    } catch (error) {
      console.log("No se pudo eliminar el producto del carrito", error);
      throw error;
    }
  }

  async actualizarCarrito(cartId, products) {
    try {
      const carrito = await this.getCarritoById(cartId);
      carrito.products = products;
      carrito.markModified("products");
      await carrito.save();
      return carrito;
    } catch (error) {
      console.log("Error al actualizar el carrito", error);
      throw error;
    }
  }

  async actualizarCantidad(cartId, productId, quantity) {
    try {
      // Obtener el carrito por ID
      const carrito = await this.getCarritoById(cartId);

      // Buscar el producto en el carrito
      const producto = carrito.products.find(
        (item) => item.product._id.toString() === productId
      );

      // Verificar si el producto existe en el carrito
      if (producto) {
        producto.quantity = quantity;
        carrito.markModified("products");
        await carrito.save();
        return carrito;
      } else {
        throw new Error(`Producto con id ${productId} no encontrado en el carrito`);
      }
    } catch (error) {
      console.error("Error al actualizar la cantidad", error);
      throw error;
    }
  }

  async eliminarProductosDelCarrito(cartId) {
    try {
      const carrito = await this.getCarritoById(cartId);
      carrito.products = [];
      carrito.markModified("products");
      await carrito.save();
      return carrito;
    } catch (error) {
      console.log("No se pudieron eliminar todos los productos del carrito", error);
      throw error;
    }
  }
}

export default CartManager;
// class CartManager {
//   async crearCarrito() {
//     try {
//       const nuevoCarrito = new CartModel({ products: [] });
//       await nuevoCarrito.save();
//       return nuevoCarrito;
//     } catch (error) {
//       console.log("Error al crear carrito", error);
//       throw error;
//     }
//   }

//   async getCarritoById(cartId) {
//     try {
//       const carrito = await CartModel.findById(cartId).populate(
//         "products.product"
//       );

//       if (!carrito) {
//         throw new Error(`No existe un carrito con el id ${cartId}`);
//       }
//       return carrito;
//     } catch (error) {
//       console.error("Error al obtener el carrito por ID", error);
//       throw error;
//     }
//   }

//   async obtenerCarritos() {
//     try {
//       const carts = await CartModel.find();
//       return carts;
//     } catch (error) {
//       console.log("Error para obtener los carritos");
//     }
//   }

//   async agregarProductoAlCarrito(cartId, productId, quantity = 1) {
//     try {
//       const carrito = await this.getCarritoById(cartId);
//       const existeProducto = carrito.products.find(
//         (item) => item.product.toString() === productId
//       );

//       if (existeProducto) {
//         existeProducto.quantity += quantity;
//       } else {
//         carrito.products.push({ product: productId, quantity });
//       }
//       // marcar la propiedad "products" como modificada antes de guardar
//       carrito.markModified("products");
//       await carrito.save();
//       return carrito;
//     } catch (error) {
//       console.error("Error al agregar producto al carrito", error);
//       throw error;
//     }
//   }
//   //eliminar producto de algun carrito:
//   async eliminarProductoDelCarrito(cartId, productId) {
//     try {
//       const carrito = await this.getCarritoById(cartId);
//       carrito.products = carrito.products.filter(
//         (item) => item.product._idtoString() !== productId
//       );
//       carrito.markModified("products");
//     } catch (error) {
//       console.log("No se pudo eliminar el product del carrito");
//       throw error;
//     }
//   }
//   //actualizar carrito:
//   async actualizarCarrito(cartId, products) {
//     try {
//       const carrito = await this.getCarritoById(cartId);
//       carrito.products = products;
//       carrito.markModified("products");
//       await carrito.save();
//     } catch (error) {
//       console.log("Error al actualizar el carrito", error);
//       throw error;
//     }
//   }
// async actualizarCantidad(cartId, productId, quantity) {
//   try {
//     // Obtener el carrito por ID
//     const carrito = await this.getCarritoById(cartId);

//     // Buscar el producto en el carrito
//     const producto = carrito.products.find(
//       (item) => item.product._id.toString() === productId
//     );

//     // Verificar si el producto existe en el carrito
//     if (producto) {
//       producto.quantity = quantity;
//       carrito.markModified("products");
//       await carrito.save();
//       return carrito;
//     } else {
//       throw new Error(`Producto con id ${productId} no encontrado en el carrito`);
//     }
//   } catch (error) {
//     console.error("Error al actualizar la cantidad", error);
//     throw error;
//   }
// }

//   // vaciar carrito:
//   async eliminarProductosDelCarrito(cartId) {
//     try {
//       const carrito = await this.getCarritoById(cartId);
//       carrito.products = [];

//       carrito.markModified("products");
//       await carrito.save();
//       return carrito;
//     } catch (error) {
//       console.log(
//         "no se pudieron eliminar todos los productos del carrito",
//         error
//       );
//       throw error;
//     }
//   }
// }

// export default CartManager;
// import CartModel from "../fs/data/cart.model.js";
// import ProductModel from "../fs/data/product.model.js";


