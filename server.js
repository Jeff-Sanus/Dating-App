const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Import and use routes
const userRoutes = require('./src/routes/userRoutes');
app.use('/api', userRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Hello from DatingApp backend!');
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});


const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));
