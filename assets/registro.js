document.getElementById("userType").addEventListener("change", function () {
  let userType = this.value;
  let ongFields = document.getElementById("ongFields");
  let voluntarioFields = document.getElementById("voluntarioFields");

  if (userType === "ong") {
    ongFields.style.display = "block";
    voluntarioFields.style.display = "none";
  } else if (userType === "voluntario") {
    ongFields.style.display = "none";
    voluntarioFields.style.display = "block";
  } else {
    ongFields.style.display = "none";
    voluntarioFields.style.display = "none";
  }
});

document
  .getElementById("registroForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    let userType = document.getElementById("userType").value;
    let email = userType === "ong" ? document.getElementById("emailONG").value : document.getElementById("emailVoluntario").value;
    let password = userType === "ong" ? document.getElementById("passwordONG").value : document.getElementById("passwordVoluntario").value;

    if (password.length < 8) {
      alert("A senha deve ter no mínimo 8 caracteres.");
      return;
    }

    const emailExists = await verificarEmailExistente(email);

    if (emailExists) {
      alert("Este email já está cadastrado.");
      return;
    }

    let senhaHash = await gerarHashSenha(password);

    let newUser = { email, password: senhaHash, userType };

    if (userType === "ong") {
      newUser.nomeONG = document.getElementById("nomeONG").value;
      newUser.cnpj = document.getElementById("cnpj").value;
      newUser.endereco = document.getElementById("enderecoONG").value;
    } else if (userType === "voluntario") {
      newUser.nomeVoluntario = document.getElementById("nomeVoluntario").value;
      newUser.cpf = document.getElementById("cpfVoluntario").value;
      newUser.registroConselho = document.getElementById("registroConselho").value;
      newUser.areaAtuacao = document.getElementById("areaAtuacao").value;
    }

    try {
      const response = await fetch("https://sql10.freemysqlhosting.net/api/Registrar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        alert("Cadastro realizado com sucesso!");
        window.location.href = "login.html";
      } else {
        const errorData = await response.json();
        alert(`Erro no cadastro: ${errorData.error || 'Erro desconhecido'}`);
      }
    } catch (error) {
      alert("Erro ao conectar com o servidor.");
    }
  });

async function gerarHashSenha(senha) {
  const encoder = new TextEncoder();
  const data = encoder.encode(senha);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function verificarEmailExistente(email) {
  const response = await fetch(`https://sql10.freemysqlhosting.net/api/check-email?email=${email}`);
  if (response.ok) {
    const result = await response.json();
    return result.exists;
  }
  return false;
}
