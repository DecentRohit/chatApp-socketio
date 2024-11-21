const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  name : String ,
  message : String ,
 timestamps : Date


})

const Chat = mongoose.model('Chat' , chatSchema);

module.exports = Chat;