const user = JSON.parse(localStorage.getItem('usuarioLogado'));

if(!user) {
    window.location.href = 'login.html';
}

$(document).ready(function () {
    loadPostsFromLocalStorage();
    loadProfileFromLocalStorage();

    if(user.nomeONG) {
        $('#minhas-ONGs-tab').text('Voluntários');
        $('#vol').text('Saiba os voluntários que deram Match em você !');
    } else {
        $('#minhas-ONGs-tab').text('ONGs');
        $('#vol').text('Saiba as ONGs que deram Match em você !');
    }

    $('#postContent').on('input', function () {
        var currentLength = $(this).val().length;
        $('#charCount').text(currentLength + '/300');
    });

    $('#postForm').submit(function (event) {
        event.preventDefault();
        var postContent = $('#postContent').val();
        var postDate = new Date().toLocaleString();
        if (postContent) {
            var postHtml = '<div class="card"><div class="card-body"><p>' + postContent +
                '</p><p><small>' + postDate + '</small></p></div></div>';
            $('#postsList').prepend(postHtml);
            $('#postContent').val('');
            $('#charCount').text('0/300');
            savePostToLocalStorage(postHtml);
        }
    });

    function savePostToLocalStorage(post) {
        const key = `posts#${user.email}`;
        
        var posts = JSON.parse(localStorage.getItem(key)) || [];
        posts.push(post);
        localStorage.setItem(key, JSON.stringify(posts));
    }

    function loadPostsFromLocalStorage() {
        const key = `posts#${user.email}`;
        var posts = JSON.parse(localStorage.getItem(key)) || [];
        posts.forEach(function (post) {
            $('#postsList').prepend(post);
        });
    }

    $('#editProfileForm').submit(function (event) {
        event.preventDefault();
        var newName = $('#editProfileName').val();
        var newBio = $('#editProfileBio').val();
        var newImageFile = $('#editProfileImage')[0].files[0];
        if (newName) {
            $('#profileName').text(newName);
        }
        if (newBio) {
            $('#bioText').text(newBio);
        }
        if (newImageFile) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#profileImage').attr('src', e.target.result);
                saveProfileToLocalStorage(newName, newBio, e.target.result);
            };
            reader.readAsDataURL(newImageFile);
        }

        $('#editProfileName').val('');
        $('#editProfileBio').val('');
        $('#bioCharCount').text('0/150');
    });

    $('#editProfileBio').on('input', function () {
        var currentLength = $(this).val().length;
        $('#bioCharCount').text(currentLength + '/150');
    });

    $('#editBioButton').click(function () {
        $('#editar-perfil-tab').click();
    });

    function saveProfileToLocalStorage(name, bio, image) {
        let user = JSON.parse(localStorage.getItem('usuarioLogado'));
        let users = JSON.parse(localStorage.getItem('db'));
        let userRef = users.login.find((x) => x.email === user.email);

        userRef.nomeVoluntario = name;
        userRef.bio = bio;
        userRef.image = image;

        localStorage.setItem('db', JSON.stringify(users));
        localStorage.setItem('usuarioLogado', JSON.stringify(userRef));

    }

    function loadProfileFromLocalStorage() {
        let user = JSON.parse(localStorage.getItem('usuarioLogado'));

        if (user.nomeVoluntario) {
            $('#profileName').text(user.nomeVoluntario);
        }
        if (user.bio) {
            $('#bioText').text(user.bio);
        }
        if (user.image) {
            $('#profileImage').attr('src', user.image);
        }

        const db = JSON.parse(localStorage.getItem('db'));
        const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
        const perfilLogado = db.login.find(item => item.email === usuarioLogado.email);

        if (usuarioLogado) {
            $('#profileName').text(usuarioLogado.userType === 'ong' ? usuarioLogado.nomeONG : usuarioLogado.nomeVoluntario);
            $('#editProfileName').val(usuarioLogado.userType === 'ong' ? usuarioLogado.nomeONG : usuarioLogado.nomeVoluntario);
            $('#editProfileBio').val(usuarioLogado.bio || "");
            $('#tipoUsuario').text(usuarioLogado.userType === 'ong' ? "ONG" : "Voluntário");

            const notificationsList = $('#notificationsList');
            notificationsList.empty(); 
            
            let mensagemCount = 0;
          
            const messageKeys = Object.keys(localStorage).filter(key => {

                if(usuarioLogado.userType === "ong" && key.startsWith(`${usuarioLogado.email}`))
                    return true;
                else if(usuarioLogado.userType === "voluntario" && key.endsWith(`-${usuarioLogado.email}`))
                    return true;
                return  false                
            });


            messageKeys.forEach(key => {
                const mensagens = JSON.parse(localStorage.getItem(key));

                if (mensagens && mensagens.length > 0) {
                    const unreadMessages = mensagens.filter(msg => !msg.lida).length;

                    if (unreadMessages > 0) {
                        mensagemCount += unreadMessages;

                        const remetente = mensagens[0].sender; 
                        const li = $('<li></li>');

                        const link = $('<a></a>').text(remetente).attr('href', '#').css('cursor', 'pointer');

                        link.on('click', function(event) {
                            event.preventDefault();
                            localStorage.setItem('currentChat', key); 
                            window.location.href = 'chat.html'; 
                    });

                    li.append(link).append(` enviou ${unreadMessages} novas mensagens.`);
                    notificationsList.append(li);
                    }
                }
            });

            $('#messageCount').text(mensagemCount > 0 ? mensagemCount : '');

            const notificacoes = perfilLogado.notificacoes || [];
            const notificationList = $('<ul></ul>');

            if (notificacoes.length > 0) {
                notificacoes.forEach(notificacao => {
                    const li = $('<li></li>');
                    const link = $('<a></a>').text(notificacao.de).attr('href', '#');
    
                    link.on('click', function (event) {
                        event.preventDefault();
                        const perfilCurtido = db.login.find(item => item.email === notificacao.email);
    
                        if (perfilCurtido) {
                            localStorage.setItem('selectedProfile', JSON.stringify(perfilCurtido));
                            window.location.href = 'match.html'; 
                        }
                    });
    
                    li.append(link).append(` curtiu você em ${new Date(notificacao.data).toLocaleString()}`);
                    notificationList.append(li);
                });
                $('#minhas-ONGs').append(notificationList);
            } else {
                $('#minhas-ONGs').append('<p>Sem notificações.</p>');
            }
        }
    }   
});