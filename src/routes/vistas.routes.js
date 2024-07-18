import { Router } from "express";

const router = Router();

router.get('/products', async (req, res) => {
 
  res.render('home', {products});
});

router.get('/realTimeProducts',async (req, res) => {
  res.render('realTimeProducts');
});

export default router;

