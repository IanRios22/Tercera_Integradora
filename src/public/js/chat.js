// simulamos la conexion de un cliente.
const socket = io();

let userEmail = document.getElementById('userEmail').textContent
let chatBox = document.getElementById('chatBox'); //chatBox es el id de un elemento html <input> de la vista en handlebars

//chatBox input
chatBox.addEventListener('keyup', evt => {
    if (evt.key === 'Enter') {
        if (chatBox.value.trim().length > 0) {
            //.emit "message" desde el cliente al servidor
            socket.emit("message", { user: userEmail, message: chatBox.value });
            chatBox.value = ""; //reset del input.
        }
    }
});

//Socket, funcion para mostrar el chat a todos.
//el socket del cliente, espera 'messageLogs' desde el servidor.
socket.on('messageLogs', messageCollection => {
    let log = document.getElementById('messageLogs'); //capturamos el elemento de html <p>
    let messages = "";
    messageCollection.forEach(message => {
        messages = messages + `${message.user} dice: ${message.message} </br>`;
    });
    log.innerHTML = messages;
});