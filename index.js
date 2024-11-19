const dotenv = require('dotenv')
dotenv.config();
const express = require('express');
const app = express();
const cors = require('cors');
const Server = require('socket.io')
const {getdb } = require('./config/mongoose');
const server = http.createServer(app);



const corOptions = {
    origin : '*' ,
    metthods : ['GET' , 'POST']
}
app.use(cors(corOptions));

const io = new Server(server , {
    cors :   {
        origin : '*' ,
    metthods : ['GET' , 'POST']
    }
    })
    
    io.on('connection' , (Socket)=>{
        console.log("connected")
        Socket.on('disconnect' , ()=> console.log("disconnected"))
    })

app.use('/' , (req,res)=>{
    res.send("Index.js")
})

module.exports =app;

