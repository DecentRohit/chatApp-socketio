import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  name : String ,
  message : String ,
 timestamp : Date


})

const Chat = mongoose.model('Chat' , chatSchema);

export default Chat;