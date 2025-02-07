const socket = io.connect('http://localhost:3000')
const msgArea = document.getElementById('msgArea')
const typeMsg = document.getElementById('typedMsg')
const sendBtn = document.getElementById('sent')
const sidebar = document.getElementById("sidebar");
const toggleBtn = document.getElementById("toggle-btn");
let username;
let mydp;
function submitName() {
  const nameInput = document.getElementById('nameInput').value.trim();
  console.log(nameInput);
  if (nameInput) {

    const selectedImage = document.getElementById('selectedImage');
    mydp = selectedImage.src;

    // Hide the popup and show the main content
    document.getElementById('popup').style.display = 'none';
    document.getElementById('content').style.display = 'block';
    const userName = nameInput;
    username = userName;


    const newP = document.createElement('p');
    // Set the text content of the p element
    newP.textContent = `Chat name : ${userName}`;
    msgArea.appendChild(newP)

    socket.emit('join', { userName, mydp })
  } else {
    alert('Name cannot be empty. Please try again.');
  }
}




toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("expanded"); // Toggles the expanded class
});


sendBtn.addEventListener('submit', (event) => {
  event.preventDefault()
  const input = typeMsg.value.trim();
  if (!input) {

    alert("cannot send empty message!");
  }
  socket.emit('message', typeMsg.value)
  const newP = document.createElement('div');
  newP.id = "mine"
  newP.innerHTML = `${typeMsg.value} <br> <span style="font-size: 9px">${new Date().toLocaleTimeString()}</span>`;
  const img = document.createElement("img");
  img.src = mydp; // Set the source of the image
 newP.appendChild(img)
  msgArea.appendChild(newP);
  // Select all elements with the same id
  const divs = document.querySelectorAll("#mine");

  // // Select the last one
  // const lastDiv = divs[divs.length - 1];
  // const img = document.createElement("img");
  // img.src = mydp; // Set the source of the image

  // // Insert the <img> before the <div>
  // lastDiv.parentNode.insertBefore(img, lastDiv);
  // msgArea.appendChild(dp)
  socket.emit('stopTyping');
  msgArea.scrollTop = msgArea.scrollHeight;
  typeMsg.value = "";
})
socket.on('load_messages', (messages) => {
  const ul = document.getElementById("online");

  messages.forEach(message => {
    const messageElement = document.createElement("div");
    messageElement.id = "old";
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
  newP.textContent = `${data.user} has joined the chat`;
  msgArea.appendChild(newP)
  const count = document.getElementById("onlineCount");
  count.textContent = data.live.length;
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
  const count = document.getElementById("onlineCount");
  count.textContent = users.length;
});
socket.on('newMsg', (data) => {
  console.log(data)
  const { name, message, avatar } = data;

  const dp = document.createElement('img');
  dp.src = avatar
  const newP = document.createElement('p');
  newP.id = "other"
  // Set the text content of the p element
  newP.innerHTML = `<span id="name">${name} </span> : ${message} <span style="font-size: 9px"> <br>${new Date().toLocaleTimeString()}</span>`;
   newP.appendChild(dp)
  msgArea.appendChild(newP)
  msgArea.scrollTop = msgArea.scrollHeight;
})
socket.on('userLeft', (data) => {
  const newP = document.createElement('p');
  newP.id = "left";
  // Set the text content of the p element
  newP.textContent = `${data.user} has left the chat`;
  msgArea.appendChild(newP)

  const left = document.getElementById(data.user)
  left.remove();
  const count = document.getElementById("onlineCount");
  count.textContent = data.live.length;


})


const messageInput = document.getElementById('typedMsg');
const typingIndicator = document.getElementById('typingIndicator');

// Emit typing event when user types
messageInput.addEventListener('input', () => {
  if (messageInput.value.trim()) {
    socket.emit('typing', username);
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