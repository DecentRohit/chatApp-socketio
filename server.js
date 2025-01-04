import dotenv from 'dotenv'
dotenv.config();
import { connectUsingMongoose, getdb } from './config/mongoose.js';
import express from 'express';
const app = express();
import cors from 'cors';
import { Server } from 'socket.io';
import Chat from './schema/chatSchema.js';
import path from 'path';
const PORT = process.env.PORT;

// Start the server
const server = app.listen(PORT, () => {
    connectUsingMongoose();
    console.log("Server is listening at port 3000")
})


app.use(cors({ origin: '*', methods: ['GET', 'POST'] }));


// Handle the form submission and show the main page
app.get('/', (req, res) => {


    res.send(` <h1>Hello, User!</h1>
                <p>Welcome to the main page.</p>
                <h3>Server is up and runnig,open UI.html to start chatting<h3>`
            );
});

const onlineUsers = new Map(); // Keep track of online users
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log("Connection is established", socket.id);


    socket.on('join', (username) => {
        onlineUsers.set(socket.id, username);
        socket.user = username;

        const live = Array.from(onlineUsers.values());
        console.log(live)
        const data = { username, live }

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



