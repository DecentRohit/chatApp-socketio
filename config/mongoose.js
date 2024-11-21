const mongoose = require('mongoose');
const dotenv = require('dotenv')
dotenv.config();

const Url = process.env.Url;
let client;
const connectUsingMongoose = async ()=>{
    try{
        await  mongoose.connect(Url).then(clientInstance =>{
            client=clientInstance;
            console.log("connected using mongoose")
        })
    
 }catch(err){
        console.log(err)
        console.log("failed to connect using mongoose")
      
 }
 }
 const getdb = ()=>{
    return client.db(); //db.collection('name') will lead to particular collection
 }
 module.exports = { connectUsingMongoose, getdb };