const dotenv = require('dotenv')
dotenv.config();
const { connectUsingMongoose } = require('./config/mongoose');
const express = require('express');
const app = express();
const cors = require('cors');
const { Server } = require('socket.io')
const { getdb } = require('./config/mongoose');
const Chat = require('./schema/chatSchema')
const PORT = process.env.PORT;
const http = require('http');
const { timeStamp } = require('console');
const path = require('path');


// Start the server
const server = app.listen(PORT, () => {
    connectUsingMongoose();
    console.log("Server is listening at port 3000")
})



app.use(cors({ origin: '*', methods: ['GET', 'POST'] }));

// Define routes (if needed)
app.get('/', (req, res) => {
    res.send("<h1>Server is up and runnig, Start Chatting by opening UI.html in web browser<h1>")
});
const onlineUsers = new Map(); // Keep track of online users
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log("Connection is established" , socket.id);
    

    socket.on('join', (username) => {
        onlineUsers.set(socket.id, username);
        socket.user = username;
       
        const live = Array.from(onlineUsers.values());
        console.log(live)
       const data = { username , live}

        socket.broadcast.emit('userJoined', data)
        Chat.find().sort({ timestamp: 1 }).limit(50)
            .then(messages => {
                socket.emit('load_messages', messages);
            }).catch(err => {
                console.log(err);
            })
            socket.emit("updateOnline", Array.from(onlineUsers.values()));
    })
    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', data); // Broadcast to all except the sender
    });

    socket.on('stopTyping', () => {
        socket.broadcast.emit('stopTyping');
    });
    socket.on('message', (msg) => {
        let userDetails = {
            name: socket.user,
            message: msg,
            timestamp: new Date()
        }
        const newChat = new Chat(userDetails);
        newChat.save();

        socket.broadcast.emit('newMsg', userDetails)

    })

    socket.on('disconnect', () => {
        onlineUsers.delete(socket.id);
        socket.emit("updateOnline", Array.from(onlineUsers.values()));
        socket.broadcast.emit('userLeft', socket.user)

        console.log("Connection is disconnected");
    })
});





