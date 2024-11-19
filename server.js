const app = require('./index'); // Import the app from index.js
const dotenv = require('dotenv');
const {connectUsingMongoose } = require('./config/mongoose');


// Load environment variables from a `.env` file if available
dotenv.config();

// Set the port
const PORT = 3200;

// Start the server
app.listen(PORT , function(){
    connectUsingMongoose();
    console.log("Server is listening at port 3200")
})
