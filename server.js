const express = require('express');
const mongoose = require('mongoose');
const path = require('path'); // Import the path module
const cors = require('cors');
require('dotenv').config(); // Load environment variables

const app = express();

// Allow all origins for CORS
app.use(cors());  

// Middleware to serve uploaded files and QR codes
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/qrcodes', express.static(path.join(__dirname, 'qrcodes')));

// Middleware to parse JSON
app.use(express.json());

// Serve the HTML file
app.use('/frontend', express.static(path.join(__dirname, 'frontend')));

app.get('/html', (req, res) => {
  const filePath = path.join(__dirname, 'frontend', 'index.html'); // Adjust the path as needed
  res.sendFile(filePath);
});

// Import the router
const fileRoutes = require('./routers/filerouter'); // Adjust the path as needed
app.use('/api/files', fileRoutes); // Use the router for file routes

const indexrouter = require('./routers/webnavrouter');
app.use('/api/index', indexrouter);

const downloadRouter = require('./routers/downloadrouter');
app.use('/api/download',downloadRouter);

const aboutRouter = require('./routers/aboutrouter');
app.use('/api/about',aboutRouter);

const contactRouter = require('./routers/contactrouter');
app.use('/api/contact',contactRouter);


// MongoDB connection
const mongoURI = process.env.MONGO_URI; // Access MONGO_URI from .env
mongoose.connect(mongoURI)
  .then(() => console.log('Connected successfully to MongoDB Atlas'))
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1); // Exit the process if the connection fails
  });

// Start the server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server running at http://127.0.0.1:${PORT}/`);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
