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
    let email, password;

    if (userType === "ong") {
      email = document.getElementById("emailONG").value;
      password = document.getElementById("passwordONG").value;
    } else if (userType === "voluntario") {
      email = document.getElementById("emailVoluntario").value;
      password = document.getElementById("passwordVoluntario").value;
    } 

    if (password.length < 8) {
      alert("A senha deve ter no mínimo 8 caracteres.");
      return;
    }

    let users = JSON.parse(localStorage.getItem("db")) || { login: [] };

    if (users.login.some((user) => user.email === email)) {
      alert("Este email já está cadastrado.");
      return;
    }

    let senhaHash = await gerarHashSenha(password);
    let newUser = { email, password: senhaHash, userType};

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

    users.login.push(newUser);
    localStorage.setItem("db", JSON.stringify(users));

    alert("Cadastro realizado com sucesso!");
    window.location.href = "login.html";
  });

async function gerarHashSenha(senha) {
  const encoder = new TextEncoder();
  const data = encoder.encode(senha);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
