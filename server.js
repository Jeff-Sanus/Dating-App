require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the uploads directory
app.use('/uploads', express.static('uploads'));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
  })
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Ensure uploads directory exists
const uploadDir = 'uploads/profile_pictures/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + Date.now() + ext);
  }
});

const upload = multer({ storage: storage });

// Upload profile picture endpoint
app.post('/upload-profile-picture', upload.single('profilePicture'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }
  
  // In a real-world app, you would update the user's profile in the database here.
  // For now, we return the URL of the uploaded image.
  const fileUrl = `${req.protocol}://${req.get('host')}/${req.file.path}`;
  res.json({
    message: 'Profile picture uploaded successfully!',
    profilePic: fileUrl
  });
});

// Import and use auth routes
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