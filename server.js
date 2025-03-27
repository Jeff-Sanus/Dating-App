const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from DatingApp backend!');
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
