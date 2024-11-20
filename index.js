const dotenv = require('dotenv')
dotenv.config();
const {connectUsingMongoose } = require('./config/mongoose');
const express = require('express');
const app = express();
const cors = require('cors');
const {Server }= require('socket.io')
const {getdb } = require('./config/mongoose');
const PORT = process.env.PORT;
const http = require('http')
const server = http.createServer(app);



// const corOptions = {
//     origin : '*' ,
//     metthods : ['GET' , 'POST']
// }
// app.use(cors(corOptions));

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    }
});
    
io.on('connect', (socket)=>{
    console.log("Connection is established");

    socket.on('disconnect', ()=>{
        console.log("Connection is disconnected");
    })
});


// Start the server
server.listen(PORT , ()=>{
    connectUsingMongoose();
    console.log("Server is listening at port 3000")
})


