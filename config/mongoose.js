const mongoose = require('mongoose');
const dotenv = require('dotenv')
dotenv.config();

const Url = process.env.Url;
const connectUsingMongoose = async ()=>{
    try{
        await  mongoose.connect(Url)
     console.log("connected using mongoose")
 }catch(err){
        console.log(err)
        console.log("failed to connect using mongoose")
      
 }
 }
module.exports = connectUsingMongoose;