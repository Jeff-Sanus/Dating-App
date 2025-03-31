require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
  })
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Import and use auth routes
// Routes defined in ./src/routes/authRoutes.js will be available under /auth
const authRoutes = require('./src/routes/authRoutes');
app.use('/auth', authRoutes);

// Example root route
app.get('/', (req, res) => {
  res.send('Hello from DatingApp backend!');
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server is listening on port ${port}`);
});