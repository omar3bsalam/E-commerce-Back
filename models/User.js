const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  address: {
    street: String,
    city: String,
    country: String,
    zipCode: String
  },
  phone: String,
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  cart: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity cannot be less than 1'],
      default: 1
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Update cart method
userSchema.methods.addToCart = async function(productId, quantity = 1) {
  const existingItemIndex = this.cart.findIndex(
    item => item.product.toString() === productId.toString()
  );

  if (existingItemIndex > -1) {
    this.cart[existingItemIndex].quantity += quantity;
  } else {
    this.cart.push({
      product: productId,
      quantity: quantity
    });
  }

  return await this.save();
};

// Remove from cart method
userSchema.methods.removeFromCart = async function(productId) {
  this.cart = this.cart.filter(
    item => item.product.toString() !== productId.toString()
  );
  
  return await this.save();
};

// Update cart item quantity method
userSchema.methods.updateCartItem = async function(productId, quantity) {
  const cartItem = this.cart.find(
    item => item.product.toString() === productId.toString()
  );

  if (cartItem) {
    cartItem.quantity = quantity;
  }

  return await this.save();
};

// Clear cart method
userSchema.methods.clearCart = async function() {
  this.cart = [];
  return await this.save();
};

module.exports = mongoose.model('User', userSchema);