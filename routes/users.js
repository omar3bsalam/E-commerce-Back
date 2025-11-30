const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  getCartSummary
} = require('../controllers/userController');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);

router.get('/cart', getCart);
router.post('/cart', addToCart);
router.put('/cart/:productId', updateCartItem);
router.delete('/cart/:productId', removeFromCart);
router.delete('/cart', clearCart);
router.get('/cart/summary', getCartSummary);

router.get('/wishlist', getWishlist);
router.post('/wishlist', addToWishlist);
router.delete('/wishlist/:productId', removeFromWishlist);

module.exports = router;