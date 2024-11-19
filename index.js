const dotenv = require('dotenv')
dotenv.config();
const express = require('express');
const app = express();
const cors = require('cors');



const corOptions = {
    origin : '*' ,
    metthods : ['GET' , 'POST']
}
app.use(cors(corOptions));

app.use('/' , (req,res)=>{
    res.send("Index.js")
})

module.exports =app;

