import express from "express";

const router = express.Router();

import ProductManager from "../dao/db/product-manager-db.js";
import ProductModel from "../dao/fs/data/product.model.js";
const productManager = new ProductManager();



router.get('/', async(req, res) => {
  console.log("Accediendo a la ruta /products");
  const page = parseInt(req.query.page) || 1;
  const limit = 2;

  try {
    const options = {
      page: page,
      limit: limit,
      lean: true
    };

    const listadoProductos = await ProductModel.paginate({}, options);
    console.log("Productos obtenidos:", JSON.stringify(listadoProductos, null, 2));

    const totalPages = listadoProductos.totalPages;
    const prevPage = listadoProductos.hasPrevPage ? listadoProductos.prevPage : null;
    const nextPage = listadoProductos.hasNextPage ? listadoProductos.nextPage : null;
    const prevLink = prevPage ? `/products?page=${prevPage}` : null;
    const nextLink = nextPage ? `/products?page=${nextPage}` : null;

    res.render('home', {
      products: listadoProductos.docs,
      hasPrevPage: listadoProductos.hasPrevPage,
      hasNextPage: listadoProductos.hasNextPage,
      prevPage,
      nextPage,
      currentPage: listadoProductos.page,
      totalPages,
      prevLink,
      nextLink
    });
  }
  catch(error) {
    console.error('Error al buscar los productos', error);
    res.status(500).render('error', { message: 'No nos pudimos conectar a la BD' });
  }
});


//Ruta para traer los productos con paginacion, limite, filtro y ordenamiento:
router.get('/', async (req,res) => {
  try {
    const { limit = 10, page = 1, sort,query } = req.query;
    const filter = {};

    if(query){
      const queryObject = JSON.parse(query);
      Object.assign(filter, queryObject);  
    }
    const sortOption = sort === 'asc' ? { price: 1 } : sort ==='desc' ? { price: -1} : {};
    const options ={
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
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
      prevLink: result.hasPrevPage ? `/api/products?limit=${limit}&page=${result.prevPage}&sort=${sort}&query=${query}` : null,
      nextLink: result.hasNextPage ? `/api/products?limit=${limit}&page=${result.nextPage}&sort=${sort}&query=${query}` : null
        };
      
    res.json(response);
  } catch (error) {
    console.log('error al buscar los productos', error)
    res.status(500).json({
      error : 'error del server'
    });
  }
});



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
  await productManager.updateProduct(productId,newInfo);
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
