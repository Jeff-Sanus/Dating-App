require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const multer   = require('multer');
const path     = require('path');
const fs       = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// 1. CORS
app.use(cors());

// 2. Log all incoming requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} → ${req.method} ${req.url}`);
  next();
});

// 3. JSON body parser
app.use(express.json());

// 4. Serve uploaded files
app.use('/uploads', express.static('uploads'));

// 5. MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser:    true,  // deprecated but harmless
    useUnifiedTopology: true,  // deprecated but harmless
  })
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// 6. Ensure upload directory exists
const uploadDir = 'uploads/profile_pictures/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 7. Multer setup
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });

// 8. Upload endpoint
app.get('/upload-profile-picture', (req, res) => {
  res.status(405).send('Method Not Allowed. Use POST to upload files.');
});
app.post(
  '/upload-profile-picture',
  upload.single('profilePicture'),
  (req, res) => {
    console.log('POST /upload-profile-picture route reached');
    if (!req.file) {
      console.error('No file was uploaded');
      return res.status(400).json({ message: 'No file uploaded.' });
    }
    const fileUrl = `${req.protocol}://${req.get('host')}/${req.file.path}`;
    console.log('File uploaded successfully at:', fileUrl);
    return res.json({
      message:    'Profile picture uploaded successfully!',
      profilePic: fileUrl,
    });
  }
);

// 9. Auth routes
const authRoutes = require('./src/routes/authRoutes');
app.use('/auth', authRoutes);

// 10. Root
app.get('/', (req, res) => {
  res.send('Hello from DatingApp backend!');
});

// 11. Error handler (last middleware)
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 12. Start listening on all interfaces
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server is listening on http://0.0.0.0:${port}`);
});