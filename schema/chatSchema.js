const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  name : String ,
  message : String ,



},
{ timestamps: true

})

export const chatModel = mongoose.model('Chat' , chatSchema);