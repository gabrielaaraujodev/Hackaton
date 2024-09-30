window.onload = function() {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    const dbString = localStorage.getItem('db'); 

    db = JSON.parse(dbString);

    const perfis = db.login;
    const cardsContainer = document.getElementById('cardsContainer');

    const isONG = usuarioLogado.nomeONG ? true : false; 

    perfis.forEach(perfil => {
        if (perfil.email !== usuarioLogado.email) {
            if (isONG) {
                if (perfil.nomeVoluntario) {
                    const card = document.createElement('div');
                    card.className = 'col-md-4 mb-4';
                    card.innerHTML = `
                        <div class="card h-100">
                            <img src="${perfil.image}" class="card-img-top" alt="${perfil.nomeVoluntario}">
                            <div class="card-body">
                                <h5 class="card-title">${perfil.nomeVoluntario}</h5>
                                <p class="card-text">${perfil.bio || 'Sem descrição'}</p>
                                <a href="match.html" class="btn btn-primary" onclick="setSelectedProfile('${perfil.email}')">Ver Perfil</a>
                            </div>
                        </div>
                    `;
                    cardsContainer.appendChild(card);
                }
            } else {
                if (perfil.nomeONG) {
                    const card = document.createElement('div');
                    card.className = 'col-md-4 mb-4';
                    card.innerHTML = `
                        <div class="card h-100">
                            <img src="${perfil.image}" class="card-img-top" alt="${perfil.nomeONG}">
                            <div class="card-body">
                                <h5 class="card-title">${perfil.nomeONG}</h5>
                                <p class="card-text">${perfil.bio || 'Sem descrição'}</p>
                                <a href="match.html" class="btn btn-primary" onclick="setSelectedProfile('${perfil.email}')">Ver Perfil</a>
                            </div>
                        </div>
                    `;
                    cardsContainer.appendChild(card);
                }
            }
        }
    });
};

function setSelectedProfile(email) {
    console.log('Setting selected profile for email:', email);
    const db = JSON.parse(localStorage.getItem('db'));
    const perfis = db.login || [];
    const perfilSelecionado = perfis.find(perfil => perfil.email === email);

    if (perfilSelecionado) {
        localStorage.setItem('selectedProfile', JSON.stringify(perfilSelecionado));
    }
}
