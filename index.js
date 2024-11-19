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

app.listen(process.env.port , function(){
    console.log("Server is listening at port 3000")
})

