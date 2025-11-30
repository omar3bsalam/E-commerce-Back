const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot be more than 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  comparePrice: {
    type: Number,
    min: [0, 'Compare price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: ['electronics', 'home', 'sports', 'media', 'pets', 'automotive', 'office', 'toys', 'furniture','fashion']
  },
  subcategory: String,
  brand: String,
  sku: {
    type: String,
    unique: true,
    sparse: true
  },
  slug: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true
  },
  images: [{
    url: String,
    alt: String
  }],
  featuredImage: String,
  inventory: {
    quantity: {
      type: Number,
      default: 0,
      min: [0, 'Quantity cannot be negative']
    },
    trackQuantity: {
      type: Boolean,
      default: true
    },
    allowOutOfStockPurchase: {
      type: Boolean,
      default: false
    }
  },
  attributes: [{
    name: String,
    value: String
  }],
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      maxlength: [1000, 'Review comment cannot be more than 1000 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ price: 1 });
productSchema.index({ 'inventory.quantity': 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ slug: 1 });

productSchema.methods.updateAverageRating = function() {
  if (this.reviews.length === 0) {
    this.averageRating = 0;
    this.reviewCount = 0;
    return;
  }

  const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
  this.averageRating = (totalRating / this.reviews.length).toFixed(1);
  this.reviewCount = this.reviews.length;
};

productSchema.methods.isInStock = function() {
  if (!this.inventory.trackQuantity) return true;
  return this.inventory.quantity > 0 || this.inventory.allowOutOfStockPurchase;
};

productSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);