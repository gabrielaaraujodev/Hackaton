async function gerarHashSenha(senha) {
    const encoder = new TextEncoder();
    const data = encoder.encode(senha);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function validarLogin(){
    let email = document.getElementById('floatingInput').value;
    let senha = document.getElementById('floatingPassword').value;

    let senhaHash = await gerarHashSenha(senha);

    
    // Envia uma requisição POST para o backend para validar o login
    const response = await fetch("https://sql10.freemysqlhosting.net/api/Login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email,
            password: senhaHash
        })
    });

    if (response.ok) {
        const data = await response.json();
        if (data.message === "Login bem-sucedido") {
            alert("Login realizado com sucesso!");

            window.location.href = 'perfil.html';
        } else {
            alert("Login ou senha inválidos.");
        }
    } else {
        alert("Erro ao tentar fazer login.");
    }
} 

document.getElementById('signIn').addEventListener('click', function(event) {
    event.preventDefault();
    validarLogin();
});
