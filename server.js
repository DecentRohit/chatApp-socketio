const dotenv = require('dotenv')
dotenv.config();
const {connectUsingMongoose } = require('./config/mongoose');
const express = require('express');
const app = express();
const cors = require('cors');
const {Server }= require('socket.io')
const {getdb } = require('./config/mongoose');
const Chat = require('./schema/chatSchema')
const PORT = process.env.PORT;
const http = require('http');
const { timeStamp } = require('console');
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
    
io.on('connection', (socket)=>{
    console.log("Connection is established");

    socket.on('join' , (username)=>{
        socket.user = username;
      

        socket.broadcast.emit('userJoined' , username)
        Chat.find().sort({ timestamp: 1 }).limit(50)
        .then(messages => {
            socket.emit('load_messages', messages);
        }).catch(err => {
            console.log(err);
        })
    })
    socket.on('message' ,(msg) =>{
    let userDetails = {
        name : socket.user ,
        message : msg ,
        timestamp : new Date()
    }
    const newChat = new Chat(userDetails);
    newChat.save();
   
    socket.broadcast.emit('newMsg' , userDetails)
       
    } )

    socket.on('disconnect', ()=>{
          
        console.log("Connection is disconnected");
    })
});


// Start the server
server.listen(PORT , ()=>{
    connectUsingMongoose();
    console.log("Server is listening at port 3000")
})


