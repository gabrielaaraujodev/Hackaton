document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('dislike-button').addEventListener('click', function() {
      window.location.href = 'cards.html'; 
  });
});


document.getElementById('profile-icon').addEventListener('click', () => {
  window.location.href = 'perfil.html';
});

window.onload = function() {
  const db = JSON.parse(localStorage.getItem('db'));
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
  const perfilEmail = JSON.parse(localStorage.getItem('selectedProfile')).email;
  const perfil = db.login.find(item => item.email === perfilEmail);

  if (perfil) {
    document.getElementById('foto').style.backgroundImage = `url('${perfil.image}')`;
    document.getElementById('nomePerfil').innerText = perfil.nomeVoluntario || perfil.nomeONG;
    document.getElementById('tipo').innerText = perfil.nomeVoluntario ? 'Voluntário' : 'ONG';
    document.getElementById('biografia').innerText = perfil.bio || 'Sem descrição';

    if (perfil.matches && Array.isArray(perfil.matches) && perfil.matches.includes(usuarioLogado.email)) {
      const commentsIcon = document.getElementById('comments-icon');
      commentsIcon.style.color = 'blue'; 
      attachChatEvent(commentsIcon, usuarioLogado.email, perfil.email);
    }
  }
};

document.getElementById('like-button').addEventListener('click', function () {
  
  const email = JSON.parse(localStorage.getItem('selectedProfile')).email;
  const db = JSON.parse(localStorage.getItem('db'));
  const perfil = db.login.find(item => item.email === email);
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

  if (perfil) {
    
    const userEmail = usuarioLogado.email;

    const notificacao = {
      tipo: 'like',
      de: usuarioLogado.nomeVoluntario || usuarioLogado.nomeONG,
      para: perfil.nomeVoluntario || perfil.nomeONG,
      data: new Date().toISOString(),
      email: userEmail
    };

    const hasLikedBack = perfil.notificacoes?.some(notificacao => 
        notificacao.tipo === 'like' && notificacao.email === userEmail
    );

    if (hasLikedBack) {
        alert('Você já deu like para este usuário.');
        return;
    }

    const recebedor = db.login.find(item => item.email === perfil.email);

    if (recebedor) {
      recebedor.notificacoes = recebedor.notificacoes || [];
      recebedor.notificacoes.push(notificacao);

      localStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado)); 
      localStorage.setItem('db', JSON.stringify(db));

      const commentsIcon = document.getElementById('comments-icon'); 

      if (checkIfLikedBack(perfil)) {
        changeChatIconColor(userEmail, perfil.email,commentsIcon);
        alert("Oba! O chat foi liberado.");
        attachChatEvent(commentsIcon, usuarioLogado.email, perfil.email);
      } else {
        alert("Seu match foi enviado");
      }
    }
  }
});

function checkIfLikedBack(perfilCurtido) {
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
  const db = JSON.parse(localStorage.getItem('db'));
  const usuarioCurtido = db.login.find(item => item.email === perfilCurtido.email);

  return usuarioLogado.notificacoes && usuarioCurtido.notificacoes.some(not => 
      not.tipo === 'like' && not.email === usuarioLogado.email
  );
}

function changeChatIconColor(userEmail1, userEmail2, commentsIcon) {
  const db = JSON.parse(localStorage.getItem('db'));
  const user1 = db.login.find(item => item.email === userEmail1);
  const user2 = db.login.find(item => item.email === userEmail2);

  if (user1 && user2) {
      commentsIcon.style.color = 'blue'; 

      user1.matches = user1.matches || [];
      user2.matches = user2.matches || [];
      
      if (!user1.matches.includes(userEmail2)) {
          user1.matches.push(userEmail2);
      }
      if (!user2.matches.includes(userEmail1)) {
          user2.matches.push(userEmail1);
      }

      localStorage.setItem('db', JSON.stringify(db));
  }
}

function attachChatEvent(icon, userEmail, perfilEmail) {
  icon.addEventListener('click', function() {
      const chatKey = [userEmail, perfilEmail].sort().join('-');
      localStorage.setItem('currentChat', chatKey);
      window.location.href = 'chat.html'; 
  });
}