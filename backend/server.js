const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const usedGroceryRequests = require('./routes/usedGroceryRequests');

// Import route files
const userRoutes = require('./routes/users');
const groceryRequestsRouter = require('./routes/groceryRequests');
const stockRoutes = require('./routes/stocks');
const mealsRoutes = require('./routes/meals');

// Load environment variables
dotenv.config({ path: path.join(__dirname, 'config/config.env') });

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend/build')));

// Connect to MongoDB
mongoose
  .connect(process.env.DB_LOCAL_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// API Routes
app.use('/api/users', userRoutes); // User routes
app.use('/api/grocery-requests', groceryRequestsRouter); // Grocery requests routes
app.use('/api/stocks', stockRoutes); // Stock routes
app.use('/api/meals', mealsRoutes); // Meals routes
app.use('/api/used-grocery-requests', usedGroceryRequests);

// Catch-all for serving frontend (React)
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
});

// Start the server
const PORT =  3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
