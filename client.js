const socket = io.connect('http://localhost:3000/')
const names = prompt('Enter name')
const msgArea = document.getElementById('msgArea')
// const msgArea = document.getElementById('msgArea')
// const msgArea = document.getElementById('msgArea')
// const msgArea = document.getElementById('msgArea')

socket.emit('join', names)
socket.on('broadcast', (data) => {
    // Create a new p element
    const newP = document.createElement('p');

    // Set the text content of the p element
    newP.textContent = `${data} has joined the chat`;
    msgArea.appendChild(newP)
})