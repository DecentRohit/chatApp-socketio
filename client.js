const socket = io.connect('http://localhost:3000/')
const msgArea = document.getElementById('msgArea')
const typeMsg = document.getElementById('typedMsg')
const sendBtn = document.getElementById('sent')
// const msgArea = document.getElementById('msgArea')
// const msgArea = document.getElementById('msgArea')
// const msgArea = document.getElementById('msgArea')

const names = prompt('Enter name')

sendBtn.addEventListener('click' , ()=>{
    socket.emit('message', typeMsg.value)
    typeMsg.value="";
})

socket.emit('join', names)
socket.on('broadcast', (data) => {
    // Create a new p element
    const newP = document.createElement('p');

    // Set the text content of the p element
    newP.textContent = `${data} has joined the chat`;
    msgArea.appendChild(newP)
})