const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getOrder,
  updateOrderStatus,
  cancelOrder
} = require('../controllers/orderController');
const auth = require('../middleware/auth');

router.post('/', auth, createOrder);

router.get('/', auth, getUserOrders);

router.get('/:id', auth, getOrder);

router.put('/:id/cancel', auth, cancelOrder);

router.put('/:id/status', auth, updateOrderStatus);

module.exports = router;