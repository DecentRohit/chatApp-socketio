const socket = io.connect('http://localhost:3000')
const msgArea = document.getElementById('msgArea')
const typeMsg = document.getElementById('typedMsg')
const sendBtn = document.getElementById('sent')
const sidebar = document.getElementById("sidebar");
const toggleBtn = document.getElementById("toggle-btn");

toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("expanded"); // Toggles the expanded class
});


const username = prompt('Enter name')
const newP = document.createElement('p');
// Set the text content of the p element
newP.textContent = `Chat name : ${username}`;
msgArea.appendChild(newP)

socket.emit('join', username)



sendBtn.addEventListener('submit', (event) => {
  event.preventDefault()
  const input = typeMsg.value.trim();
  if (!input) {
     
      alert("cannot send empty message!");
  }
  socket.emit('message', typeMsg.value)
  const newP = document.createElement('span');
  // Set the text content of the p element
  newP.id = "mine"
  newP.innerHTML = `${typeMsg.value} <br> <span style="font-size: 9px">${new Date().toLocaleTimeString()}</span>`;
  
  msgArea.appendChild(newP)
  socket.emit('stopTyping');
  msgArea.scrollTop = msgArea.scrollHeight;
  typeMsg.value = "";
})
socket.on('load_messages', (messages) => {
  const ul = document.getElementById("online");

  messages.forEach(message => {
    const messageElement = document.createElement("div");
    messageElement.id="old";
    messageElement.innerHTML = `<span style="font-size: 9px">${new Date(message.timestamp).toDateString()}</span > 
                               - <span id="name">${message.name} </span> :
                                <span id="oldermsg">${message.message}</span>`
    msgArea.appendChild(messageElement);
    const ul = document.getElementById("online");
  



  });
})

socket.on('userJoined', (data) => {
  // Create a new p element
  const newP = document.createElement('p');
  newP.id = "join";
  // Set the text content of the p element
  newP.textContent = `${data.username} has joined the chat`;
  msgArea.appendChild(newP)

  const ul = document.getElementById("online");
  ul.innerHTML = '';
  data.live.forEach((user) => {
     // Create a new li element
  const li = document.createElement("li");
  li.textContent = user;
  li.id = user;
  
  // Append the li to the ul
  ul.appendChild(li);
  
  })
  msgArea.scrollTop = msgArea.scrollHeight;
  
})
socket.on('updateOnline', (users) => {
  const ul = document.getElementById("online");
  ul.innerHTML = '';
  users.forEach((user) => {
     // Create a new li element
  const li = document.createElement("li");
  li.textContent = user;
  li.id = user;
  
  // Append the li to the ul
  ul.appendChild(li);
  });
});
socket.on('newMsg', (data) => {
  // Create a new p element

  const { name, message } = data;

  // const time = stringtime.isoString.slice(11, 19)

  const newP = document.createElement('p');
  newP.id = "other"
  // Set the text content of the p element
  newP.innerHTML = `<span id="name">${name} </span> : ${message} <span style="font-size: 9px"> <br>${new Date().toLocaleTimeString()}</span>`;

  msgArea.appendChild(newP)
  msgArea.scrollTop = msgArea.scrollHeight;
})
socket.on('userLeft', (data) => {
  console.log("userleft" ,data)
  const newP = document.createElement('p');
  newP.id = "left";
  // Set the text content of the p element
  newP.textContent = `${data} has left the chat`;
  msgArea.appendChild(newP)
  
const left = document.getElementById(data)
left.remove();

})


const messageInput = document.getElementById('typedMsg');
const typingIndicator = document.getElementById('typingIndicator');

// Emit typing event when user types
messageInput.addEventListener('input', () => {
  if (messageInput.value.trim()) {
    socket.emit('typing' , username);
  } else {
    socket.emit('stopTyping');
  }
});
socket.on('typing', (data) => {
  typingIndicator.innerText = `${data} is typing`
  typingIndicator.style.display = 'block';
});

// Hide typing indicator when someone stops typing
socket.on('stopTyping', () => {
  typingIndicator.style.display = 'none';
});
// Emit stopTyping when the user stops typing
messageInput.addEventListener('blur', () => {
  socket.emit('stopTyping');
});
socket.on('disconnect', () => {
  console.log('You have been disconnected from the server.');
});