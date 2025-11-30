const User = require('../models/User');
const Product = require('../models/Product');
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { 
        name, 
        phone, 
        address 
      },
      { 
        new: true, 
        runValidators: true 
      }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('cart.product', 'name price featuredImage inventory sku');

    const cartItems = user.cart.map(item => ({
      _id: item._id,
      product: item.product,
      quantity: item.quantity,
      addedAt: item.addedAt
    }));

    res.json({
      success: true,
      data: cartItems
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

    const product = await Product.findOne({ 
      _id: productId, 
      isActive: true 
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (product.inventory.trackQuantity && product.inventory.quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.inventory.quantity} items available in stock`
      });
    }

    const user = await User.findById(req.user._id);
    await user.addToCart(productId, quantity);

    const updatedUser = await User.findById(req.user._id)
      .populate('cart.product', 'name price featuredImage inventory sku');

    res.json({
      success: true,
      message: 'Product added to cart successfully',
      data: updatedUser.cart
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

    const user = await User.findById(req.user._id);
    const cartItem = user.cart.find(
      item => item.product.toString() === productId
    );

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in cart'
      });
    }

    const product = await Product.findById(productId);
    if (product.inventory.trackQuantity && product.inventory.quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.inventory.quantity} items available in stock`
      });
    }

    await user.updateCartItem(productId, quantity);

    const updatedUser = await User.findById(req.user._id)
      .populate('cart.product', 'name price featuredImage inventory sku');

    res.json({
      success: true,
      message: 'Cart updated successfully',
      data: updatedUser.cart
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user._id);
    await user.removeFromCart(productId);

    const updatedUser = await User.findById(req.user._id)
      .populate('cart.product', 'name price featuredImage inventory sku');

    res.json({
      success: true,
      message: 'Product removed from cart successfully',
      data: updatedUser.cart
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    await user.clearCart();

    res.json({
      success: true,
      message: 'Cart cleared successfully',
      data: []
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('wishlist', 'name price featuredImage category brand averageRating');

    res.json({
      success: true,
      data: user.wishlist
    });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    const product = await Product.findOne({ 
      _id: productId, 
      isActive: true 
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const user = await User.findById(req.user._id);
    
    if (user.wishlist.includes(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Product already in wishlist'
      });
    }

    user.wishlist.push(productId);
    await user.save();

    const updatedUser = await User.findById(req.user._id)
      .populate('wishlist', 'name price featuredImage category brand averageRating');

    res.json({
      success: true,
      message: 'Product added to wishlist successfully',
      data: updatedUser.wishlist
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user._id);
    user.wishlist = user.wishlist.filter(
      id => id.toString() !== productId
    );

    await user.save();

    const updatedUser = await User.findById(req.user._id)
      .populate('wishlist', 'name price featuredImage category brand averageRating');

    res.json({
      success: true,
      message: 'Product removed from wishlist successfully',
      data: updatedUser.wishlist
    });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getCartSummary = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('cart.product', 'name price inventory');

    let totalItems = 0;
    let totalPrice = 0;
    let inStockItems = 0;

    for (const item of user.cart) {
      totalItems += item.quantity;
      
      const itemTotal = item.product.price * item.quantity;
      totalPrice += itemTotal;

      if (!item.product.inventory.trackQuantity || item.product.inventory.quantity >= item.quantity) {
        inStockItems += item.quantity;
      }
    }

    res.json({
      success: true,
      data: {
        totalItems,
        totalPrice: parseFloat(totalPrice.toFixed(2)),
        inStockItems,
        outOfStockItems: totalItems - inStockItems
      }
    });
  } catch (error) {
    console.error('Get cart summary error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};