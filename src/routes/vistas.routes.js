import { Router } from "express";
import { getProducts} from './products.routes.js';

const router = Router();

router.get('/', (req, res) => {
  const products = getProducts();
  res.render('home', {products});
});

router.get('/realTimeProducts', (req, res) => {
  res.render('realTimeProducts');
});

export default router;

