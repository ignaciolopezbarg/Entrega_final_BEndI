import ProductModel from "../models/product.model.js";

class ProductManager {
  async addProduct({ title, description, price, img, code, stock, category }) {
    try {
      if (!title || !description || !price || !code || !stock || !category) {
        console.log("Todos los campos son requeridos");
        return;
      }
      //Cambiamos metodo validacion
      const existeProducto = await ProductModel.findOne({ code: code });
      if (existeProducto) {
        console.log("El codigo debe ser unico");
        return;
      }
      const newProduct = new ProductModel({
        title,
        description,
        price,
        img,
        code,
        stock,
        category,
        status: true,
      });
      await newProduct.save();
    } catch (error) {
      console.log("Error al agregar producto", error);
      throw error;
    }
  }
  async getProducts() {
    try {
      const arrayProductos = await ProductModel.find();
      return arrayProductos;
    } catch (error) {
      console.log("Error al obtener los productos", error);
      throw error;
    }
  }

  async getProductbyId(id) {
    try {
      const buscado = await ProductModel.findById(id);
      if (!buscado) {
        console.log("no se encontro el producto con ese id");
        return null;
      } else {
        console.log("producto encontrado con exito");
        return buscado;
      }
    } catch (error) {
      console.log("Error al obtener producto por id", error);
      throw error;
    }
  }
  async updateProduct(id, productoActualizado) {
    try {
      const producto = await ProductModel.findByIdAndUpdate(
        id,
        productoActualizado
      );
      if (!producto) {
        console.log("no se ha podido actualizar el producto");
        return null;
      } else {
        console.log("producto actualizado con exito");
        return producto;
      }
    } catch (error) {
      console.log("Error al actualizar el producto", error);
      throw error;
    }
  }
  async deleteProduct(id) {
    try {
      const eliminado = await ProductModel.findByIdAndDelete(id);
      if (!eliminado) {
        console.log("no se pudo eliminar el producto");
        return null;
      } else {
        console.log("se elimino el producto con exito");
        return eliminado;
      }
    } catch (error) {
      console.log("Error al eliminar el producto", error);
      throw error;
    }
  }
}
export default ProductManager;