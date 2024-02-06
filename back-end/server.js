const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS)
app.use(express.json()); // Parse JSON request bodies

// MongoDB connection URI
//@URI must be placed into .env file so that it dosent get published when commiting to github repository
const URI = "mongodb://mongo:27017/my_database";//@Place the URI of Your MongoDBConnection "mongodb://username:password@localhost:Port/"

// Route handling
app.use("/api", taskRoutes); // All the Api URLs specified in the taskRoutes component will be proceeded by /api

// Connect to MongoDB, for code optimisation it can be a function called from a file example: db.js
mongoose.connect(URI)//@takes the URI as a parameter
  .then(() => {//@ Callback to execute after connection is established
    console.log("Connected to MongoDB");
    // Start the server once connected to the database
    app.listen(3001, () => { //@Port and a Callback Function
      console.log(`Server is running on port 3001`);
    });
  })
  .catch((error) => {//@callback to manage the exception after connection rejected
    console.error('Error connecting to MongoDB:', error);
  });

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to my Task Management API');//message displayed on the default route
});
