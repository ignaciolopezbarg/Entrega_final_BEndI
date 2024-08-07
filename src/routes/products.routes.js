import express from "express";
import mongoose from "mongoose";
import ProductManager from "../dao/db/product-manager-db.js";
import ProductModel from "../dao/fs/data/product.model.js";

const router = express.Router();
const productManager = new ProductManager();
// const { ObjectId } = mongoose.Types;

// router.get("/:pid", async (req, res) => {
//   const id = req.params.pid;

//   // Validación del ID usando Mongoose
//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(400).json({ error: "ID de producto no válido" });
//   }

//   try {
//     const producto = await ProductModel.findById(id);
//     if (!producto) {
//       return res.status(404).json({ error: "Producto no encontrado" });
//     }
//     res.json(producto);
//   } catch (error) {
//     console.error("Error al buscar el producto por id", error);
//     res.status(500).json({ error: "Error del servidor" });
//   }
// });

//   Ruta para obtener todos los productos con paginación
router.get("/", async (req, res) => {

  const page = parseInt(req.query.page) || 1;
  const limit = 2;

  try {
    const options = {
      page: page,
      limit: limit,
      lean: true,
    };

    const listadoProductos = await ProductModel.paginate({}, options);
    console.log(
      "Productos obtenidos:",
      JSON.stringify(listadoProductos, null, 2)
    );

    const totalPages = listadoProductos.totalPages;
    const prevPage = listadoProductos.hasPrevPage
      ? listadoProductos.prevPage
      : null;
    const nextPage = listadoProductos.hasNextPage
      ? listadoProductos.nextPage
      : null;
    const prevLink = prevPage ? `/products?page=${prevPage}` : null;
    const nextLink = nextPage ? `/products?page=${nextPage}` : null;

    res.render("home", {
      products: listadoProductos.docs,
      hasPrevPage: listadoProductos.hasPrevPage,
      hasNextPage: listadoProductos.hasNextPage,
      prevPage,
      nextPage,
      currentPage: listadoProductos.page,
      totalPages,
      prevLink,
      nextLink,
    });
  } catch (error) {
    console.error("Error al buscar los productos", error);
    res
      .status(500)
      .render("error", { message: "No nos pudimos conectar a la BD" });
  }
});

// Ruta para obtener productos con paginación, límite, filtro y ordenamiento
router.get("/", async (req, res) => {
  try {
    const { limit = 2, page = 10, sort, query } = req.query;
    const filter = {};

    if (query) {
      const queryObject = JSON.parse(query);
      Object.assign(filter, queryObject);
    }

    const sortOption =
      sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : {};
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 2),
      sort: sortOption,
    };

    const result = await productManager.getProducts(filter, options);

    const response = {
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.hasPrevPage ? result.prevPage : null,
      nextPage: result.hasNextPage ? result.nextPage : null,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage
        ? `/api/products?limit=${limit}&page=${result.prevPage}&sort=${sort}&query=${query}`
        : null,
      nextLink: result.hasNextPage
        ? `/api/products?limit=${limit}&page=${result.nextPage}&sort=${sort}&query=${query}`
        : null,
    };

    res.json(response);
  } catch (error) {
    console.error("Error al buscar los productos", error);
    res.status(500).json({
      error: "Error del server",
    });
  }
});

// Ruta para obtener un producto por ID
router.get("/:pid", async (req, res) => {
  const id = req.params.pid;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "ID de producto no válido" });
  }

  try {
    const producto = await ProductModel.findById(id);
    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(producto);
  } catch (error) {
    console.error("Error al buscar el producto por id", error);
    res.status(500).json({ error: "Error del servidor" });
  }
});

router.get("/:pid", async (req, res) => {
  const id = req.params.pid;
});

// Ruta para cargar un nuevo producto
router.post("/", async (req, res) => {
  const nuevoProducto = req.body;
  try {
    await productManager.addProduct(nuevoProducto);
    res.status(200).json({
      message: "Se cargó un nuevo producto",
    });
  } catch (error) {
    console.error("Error al cargar el nuevo producto", error);
    res.status(500).json({
      error: "Error del server",
    });
  }
});

// Ruta para modificar un producto por ID
router.put("/:pid", async (req, res) => {
  const productId = req.params.pid;
  const newInfo = req.body;

  // Validación del ID
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ error: "ID de producto no válido" });
  }

  try {
    await productManager.updateProduct(productId, newInfo);
    res.json({
      message: "Producto actualizado con éxito",
    });
  } catch (error) {
    console.error("Error al actualizar el producto", error);
    res.status(500).json({
      error: "Error del server",
    });
  }
});

///////////////////////////////////////////////////////////
const products = await ProductModel.find({ category: "sports" })
  .sort({ price: 1 })
  .limit(2)
  .skip(0);
console.log("Productos encontrados:", products);
//////////////////////////////////////////////////////////////////////////

// Ruta para eliminar un producto por ID
router.delete("/:pid", async (req, res) => {
  const id = req.params.pid;

  // Validación del ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "ID de producto no válido" });
  }

  try {
    await productManager.deleteProduct(id);
    res.json({
      message: "Producto eliminado con éxito",
    });
  } catch (error) {
    console.error("Error al eliminar el producto", error);
    res.status(500).json({
      error: "Error del server",
    });
  }
});

export default router;
