const socket = io.connect('http://localhost:3000')
const msgArea = document.getElementById('msgArea')
const typeMsg = document.getElementById('typedMsg')
const sendBtn = document.getElementById('sent')
// const msgArea = document.getElementById('msgArea')
// const msgArea = document.getElementById('msgArea')
// const msgArea = document.getElementById('msgArea')

const username = prompt('Enter name')
const newP = document.createElement('p');
     // Set the text content of the p element
    newP.textContent = `Welcome ${username}`;
    msgArea.appendChild(newP)

socket.emit('join', username)

sendBtn.addEventListener('click' , (event)=>{
    event.preventDefault()
    socket.emit('message', typeMsg.value)
    const newP = document.createElement('p');
    // Set the text content of the p element
   newP.textContent = `YOU : ${typeMsg.value} : ${new Date().toLocaleTimeString()}`;
   msgArea.appendChild(newP)
    typeMsg.value="";
})
socket.on('load_messages' ,  (msgArray)=>{
  msgArray.forEach(message => {
    const messageElement = document.createElement("div");
    messageElement.innerText = new Date(message.timestamps).toDateString() + "-" + message.name + ":" + message.message;
    msgArea.appendChild(messageElement);
    
  });
})

socket.on('userJoined', (data) => {
    // Create a new p element
    const newP = document.createElement('p');
     // Set the text content of the p element
    newP.textContent = `${data} has joined the chat`;
    msgArea.appendChild(newP)
})
socket.on('newMsg', (data) => {
    // Create a new p element
 
    const {name , message } = data;
   
    // const time = stringtime.isoString.slice(11, 19)
 
    const newP = document.createElement('p');
     // Set the text content of the p element
    newP.textContent = `${name} : ${message} : ${new Date().toLocaleTimeString()}`;
 
    msgArea.appendChild(newP)
})