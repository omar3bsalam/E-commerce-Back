const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');


exports.createOrder = async (req, res) => {
  try {
    console.log(' Create order request received:', {
      user: req.user ? req.user._id : 'No user',
      itemsCount: req.body.items ? req.body.items.length : 0
    });

    const { 
      items, 
      shippingAddress, 
      paymentMethod = 'credit_card', 
      shippingMethod = 'standard',
      notes 
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      console.log(' No items in order');
      return res.status(400).json({
        success: false,
        message: 'Order items are required'
      });
    }

    if (!shippingAddress || !shippingAddress.name || !shippingAddress.street || !shippingAddress.city || !shippingAddress.country) {
      console.log(' Incomplete shipping address');
      return res.status(400).json({
        success: false,
        message: 'Complete shipping address is required'
      });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      console.log(' Processing item:', item);
      
      if (!item.product || !item.quantity) {
        return res.status(400).json({
          success: false,
          message: 'Each item must have product and quantity'
        });
      }

      const product = await Product.findById(item.product);
      
      if (!product) {
        console.log(' Product not found:', item.product);
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.product}`
        });
      }

      if (!product.isActive) {
        return res.status(400).json({
          success: false,
          message: `Product is no longer available: ${product.name}`
        });
      }

      if (product.inventory.trackQuantity && product.inventory.quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.inventory.quantity}, Requested: ${item.quantity}`
        });
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.featuredImage || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop'
      });

      console.log(' Item validated:', product.name, 'Qty:', item.quantity, 'Price:', product.price);
    }

    const shippingCost = calculateShippingCost(shippingMethod, totalAmount);
    const taxAmount = calculateTax(totalAmount, shippingAddress.country);

    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9).toUpperCase();
    const orderNumber = `ORD-${timestamp}-${random}`;

    console.log(' Order calculations:', {
      totalAmount,
      shippingCost,
      taxAmount,
      finalTotal: totalAmount + shippingCost + taxAmount
    });

    const orderData = {
      orderNumber,
      user: req.user._id,
      items: orderItems,
      totalAmount,
      shippingAddress,
      billingAddress: shippingAddress,
      paymentMethod,
      shippingMethod,
      shippingCost,
      taxAmount,
      notes,
      paymentStatus: 'pending',
      orderStatus: 'pending',
      estimatedDelivery: calculateEstimatedDelivery(shippingMethod)
    };

    console.log(' Creating order with data:', orderData);

    const order = new Order(orderData);
    await order.save();

    console.log(' Order created successfully:', order.orderNumber);

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (product && product.inventory.trackQuantity) {
        product.inventory.quantity -= item.quantity;
        await product.save();
        console.log(' Updated inventory for:', product.name, 'New quantity:', product.inventory.quantity);
      }
    }

    try {
      await User.findByIdAndUpdate(req.user._id, { cart: [] });
      console.log(' Cleared user cart');
    } catch (cartError) {
      console.log(' Could not clear cart:', cartError.message);
    }

    const populatedOrder = await Order.findById(order._id)
      .populate('items.product', 'name sku featuredImage');

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: populatedOrder
    });

  } catch (error) {
    console.error(' Create order error:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Failed to create order: ' + error.message
    });
  }
};
exports.getUserOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    let query = { user: req.user._id };
    
    if (status) {
      query.orderStatus = status;
    }

    const orders = await Order.find(query)
      .populate('items.product', 'name featuredImage sku')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      count: orders.length,
      data: orders,
      pagination: {
        current: Number(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('items.product', 'name description featuredImage sku brand');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, trackingNumber } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.orderStatus = orderStatus;
    
    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }

    if (orderStatus === 'shipped') {
      order.estimatedDelivery = calculateEstimatedDelivery(order.shippingMethod);
    }

    await order.save();

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (!['pending', 'confirmed'].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage'
      });
    }

    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product && product.inventory.trackQuantity) {
        product.inventory.quantity += item.quantity;
        await product.save();
      }
    }

    order.orderStatus = 'cancelled';
    await order.save();

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const calculateShippingCost = (method, orderAmount) => {
  const shippingRates = {
    standard: orderAmount > 50 ? 0 : 5.99,
    express: 12.99,
    priority: 24.99
  };

  return shippingRates[method] || shippingRates.standard;
};

const calculateTax = (amount, country) => {
  const taxRates = {
    'USA': 0.08,
    'Canada': 0.13,
    'UK': 0.20
  };

  const taxRate = taxRates[country] || 0.10;
  return parseFloat((amount * taxRate).toFixed(2));
};

const calculateEstimatedDelivery = (shippingMethod) => {
  const deliveryDays = {
    standard: 7,
    express: 3,
    priority: 1
  };

  const days = deliveryDays[shippingMethod] || 7;
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + days);
  
  return deliveryDate;
};