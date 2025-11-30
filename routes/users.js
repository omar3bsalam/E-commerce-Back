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

// Apply auth middleware to all routes
router.use(auth);

// Profile routes
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// Cart routes
router.get('/cart', getCart);
router.post('/cart', addToCart);
router.put('/cart/:productId', updateCartItem);
router.delete('/cart/:productId', removeFromCart);
router.delete('/cart', clearCart);
router.get('/cart/summary', getCartSummary);

// Wishlist routes
router.get('/wishlist', getWishlist);
router.post('/wishlist', addToWishlist);
router.delete('/wishlist/:productId', removeFromWishlist);

module.exports = router;