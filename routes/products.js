const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory
} = require('../controllers/productController');
const auth = require('../middleware/auth');

router.get('/', getAllProducts);

router.get('/category/:category', getProductsByCategory);

router.get('/:id', getProduct);

router.post('/', auth, createProduct);

router.put('/:id', auth, updateProduct);

router.delete('/:id', auth, deleteProduct);

module.exports = router;