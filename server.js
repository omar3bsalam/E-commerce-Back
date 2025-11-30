const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

dotenv.config();

// الاتصال بقاعدة البيانات
connectDB();

const app = express();

// إعدادات CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes الأساسية
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/users', require('./routes/users'));

// Route للصحة
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'E-commerce API is working!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Route الأساسي
app.get('/', (req, res) => {
  res.json({ 
    message: '🛍️ E-commerce Backend API',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products', 
      orders: '/api/orders',
      users: '/api/users',
      health: '/api/health'
    }
  });
});

// Route لاختبار البيانات
app.get('/api/test-data', async (req, res) => {
  try {
    const Product = require('./models/Product');
    const products = await Product.find().limit(5);
    
    res.json({
      success: true,
      productsCount: await Product.countDocuments(),
      sampleProducts: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// معالجة 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`
  });
});

// معالجة الأخطاء
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

// استخدام بورت مختلف لتجنب التعارض
const PORT = process.env.PORT || 5003;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`🌐 Health: http://localhost:${PORT}/api/health`);
  console.log(`📊 Test Data: http://localhost:${PORT}/api/test-data`);
  
  // تشغيل seed data بعد بدء السيرفر
  setTimeout(async () => {
    try {
      const seedDatabase = require('./seeds/products');
      await seedDatabase();
    } catch (error) {
      console.log('⚠️ Seed data not available:', error.message);
    }
  }, 2000);
});