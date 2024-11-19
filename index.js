const dotenv = require('dotenv')
dotenv.config();
const express = require('express');
const app = express();
const cors = require('cors');
const connectUsingMongoose  = require('./config/mongoose');
const port = 3200;

const corOptions = {
    origin : '*' ,
    metthods : ['GET' , 'POST']
}
app.use(cors(corOptions));

app.use('/' , (req,res)=>{
    res.send("Index.js")
})

app.listen(port , function(){
    connectUsingMongoose();
    console.log("Server is listening at port 3200")
})

