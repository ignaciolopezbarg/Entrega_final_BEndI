import express from "express";

const router = express.Router();

import ProductManager from "../dao/db/product-manager-db.js";
const productManager = new ProductManager();

//Ruta para traer los productos cuando se carguen al servidor
router.get("/", async (req, res) => {
  try {
    const limit = req.query.limit;
    const products = await productManager.getProducts();
    if (limit) {
      res.json(products.slice(0, limit));
    } else {
      res.json(products);
    }
  } catch (error) {
    console.log("error al obtener los productos", error);
    res.status(500).json({ error: "error del server" });
  }
});

//Ruta para traer los productos con paginacion, limite, filtro y ordenamiento:
router.get('/', async (req,res) => {
  try {
    const { limit = 3, page = 1, sort,query } = req.query;
    const filter = [];

    if(query){
      const queryObject = JSON.parse(query);
      Object.assign(filter, queryObject);  
    }
    const sortOption = sort === 'asc' ? {price:1} : sort ==='desc' ? {price:-1} : {};
    const options ={
      page: parseInt(page,5),
      limit: parseInt(limit, 3),
      sort: sortOption
    };

    const result = await productManager.getProducts(filter, options);

    const response = {
      status: 'success',
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.hasPrevPage ? result.hasPrevPage : null,
      nextPage: result.hasNextPage ? result.nextPage : null,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? `/api/products?limit=${limit}&page=${result.prevPage}&sort={$sort}&query={$query}` : null,
      nextLink: result.hasNextPage ? `/api/products?limit=${limit}&page=${result.nextPage}&sort={$sort}&query={$query}` : null
    };

    res.json(response);
  } catch (error) {
    console.log('error al buscar los productos', error)
    res.status(500).json({
      error : 'error del server'
    });
  }
})



//Ruta para cargar un producto por id
router.get("/pid", async (req, res) => {
  const id = req.params.pid;

  try {
    const producto = await productManager.getProductbyId(id);
    if (!producto) {
      return res.json({
        error: "Producto no encontrado",
      });
    }
    res.json(producto);
  } catch (error) {
    console.log("Error al buscar el producto por id", error);
    res.status(500).json({
      error: "Error en el servidor",
    });
  }
});

//Ruta para cargar un nuevo producto:
router.post("/", async (req, res) => {
  const nuevoProducto = req.body;
  try {
    await productManager.addProduct(nuevoProducto);
    res.status(200).json({
      message: "Se cargo un nuevo producto",
    });
  } catch (error) {
    console.log("Error al cargar el nuevo producto", error);
    res.status(500).json({
      error: "Error del server",
    });
  }
});

//ruta para modificacion de algun producto por id:
router.put("/:id",async (req, res) => {
  const productId = req.params.pid;
  const newInfo = req.body;

try {
  await productManager.updateProduct(id,newInfo);
  res.json({
    message: 'Producto actualizado con exito'
  });
} catch (error) {
  console.log('Error al actualizar el producto', error)
  res.status(500).json({
    error: 'Error del server'
  })
}
});

//ruta para eliminar algun producto:

router.delete("/:pid", async (req, res) => {
  const id = req.params.pid;

try {
  await productManager.deleteProduct(id);
  res.json({
    message: 'Producto eliminado con exito'
  });
} catch (error) {
  console.log('Error al eliminar el producto', error)
  res.status(500).json({
    error: 'Error del server'
  });
}
});

// Ruta que no está definida, da un aviso:
router.get("*", (req, res) => {
  res.status(404).send("Ruta no definida");
});

export default router;
