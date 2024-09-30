async function gerarHashSenha(senha){
    const encoder = new TextEncoder();
    const data = encoder.encode(senha);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}


function lePerfil(){
    let strDados = localStorage.getItem('db')
    let objDados = {};

    if(strDados && strDados != "undefined" && strDados != "null")
        objDados = JSON.parse(strDados);

    return objDados;
}


function salvaDados(dados){
    localStorage.setItem('db', JSON.stringify (dados));
}


async function validarLogin(){
    let objDados = lePerfil();
    let email = document.getElementById('floatingInput').value;
    let senha = document.getElementById('floatingPassword').value;

    let usuario = objDados.login ? objDados.login.find(item => item.email === email) : null;

    if(!usuario){
        alert('Login ou senha inválidos.');
        return;
    }

    let senhaHash = await gerarHashSenha(senha);

    if (usuario.password === senhaHash) {
        alert('Login realizado com sucesso!');
        localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
        
        window.location.href = 'perfil.html'
    } else {
        alert('Login ou senha inválidos.');
    }
}

document.getElementById('signIn').addEventListener('click', function(event) {
    event.preventDefault();
    validarLogin();
});