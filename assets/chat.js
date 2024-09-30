window.onload = function() {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    const chatKey = localStorage.getItem('currentChat'); 
    const messagesList = document.getElementById('messages-list');
    const messageForm = document.getElementById('message-form');
    const messageInput = document.getElementById('message-input');

    function loadMessages(firstLoading = true) {
        const messages = JSON.parse(localStorage.getItem(chatKey)) || [];
        messagesList.innerHTML = ''; 
        messages.forEach(message => {
            const li = document.createElement('li');
            li.textContent = `${message.sender}: ${message.text}`;
            messagesList.appendChild(li);
        });
        
        messagesList.scrollTop = messagesList.scrollHeight; 

        if(firstLoading) 
            markMessagesAsRead(messages);     
    }

    function markMessagesAsRead(messages) {
        const updatedMessages = messages.map(message => {
            if (!message.lida) {
                message.lida = true; 
            }
            return message;
        });

        localStorage.setItem(chatKey, JSON.stringify(updatedMessages));
    }

    messageForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const message = {
            sender: usuarioLogado.nomeVoluntario || usuarioLogado.nomeONG,
            text: messageInput.value,
            timestamp: new Date().toISOString(),
            lida: false
        };

        const messages = JSON.parse(localStorage.getItem(chatKey)) || [];
        messages.push(message);
        localStorage.setItem(chatKey, JSON.stringify(messages));

        loadMessages(false); 
        messageInput.value = ''; 
    });

    loadMessages();     
};

function backHome() {
    window.location.href = 'perfil.html'
} 
