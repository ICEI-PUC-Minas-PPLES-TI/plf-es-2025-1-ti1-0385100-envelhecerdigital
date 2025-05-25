const API_URL = "http://localhost:3000/jogos";


function displayMessage(msg) {
    document.getElementById("msg").innerHTML =
        `<div class="alert alert-warning">${msg}</div>`;
}

// Exibe todos os jogos na tabela
function exibeJogos(nome = "", tipo = "", destaque = "") {
    fetch(API_URL)
        .then(res => res.json())
        .then(jogos => {
            let tabela = document.getElementById("table-jogos");
            tabela.innerHTML = "";

            jogos.reverse().forEach(jogo => {
                // Converte os valores para comparação
                const nomeMatch = !nome || jogo.nome.toLowerCase().includes(nome.toLowerCase());
                const tipoMatch = !tipo || jogo.tipo === tipo;
                const destaqueMatch = destaque === "" || jogo.destaques === (destaque === "1");

                if (nomeMatch && tipoMatch && destaqueMatch) {
                    tabela.innerHTML += `
                        <tr>
                            <td>${jogo.id}</td>
                            <td>${jogo.nome}</td>
                            <td>${jogo.imagem}</td>
                            <td>${jogo.urlJogo}</td>
                            <td>${jogo.tipo}</td>
                            <td>${jogo.destaques ? 'Sim' : 'Não'}</td>
                            <td>${jogo.habilidades}</td>
                            <td>${jogo.descricao}</td>
                        </tr>`;
                }
            });
        })
        .catch(() => displayMessage("Erro ao carregar os jogos."));
}


// Insere novo jogo
function insertJogo(jogo) {
    fetch(API_URL)
        .then(res => res.json())
        .then(jogos => {
            const jogoExistente = jogos.find(j => j.nome.toLowerCase() === jogo.nome.toLowerCase() && j.urlJogo === jogo.urlJogo);
            if (jogoExistente) {
                displayMessage("Este jogo já está cadastrado.");
                document.getElementById("title").scrollIntoView({ behavior: 'smooth' });
            } else {
                fetch(API_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(jogo)
                })
                .then(res => {
                    if (res.ok) {
                        displayMessage("Jogo inserido com sucesso.");
                        exibeJogos();
                        limparFormulario();
                        document.getElementById("title").scrollIntoView({ behavior: 'smooth' });
                    } else {
                        throw new Error("Erro ao inserir jogo.");
                    }
                })
                .catch(() => {
                    displayMessage("Erro ao inserir jogo.");
                    document.getElementById("title").scrollIntoView({ behavior: 'smooth' });
                });
            }
        })
        .catch(() => displayMessage("Erro ao inserir jogo."), document.getElementById("title").scrollIntoView({ behavior: 'smooth' }));
}

// Altera jogo existente
function updateJogo(id, jogo) {
    fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jogo)
    })
    .then(() => {
        displayMessage("Jogo alterado com sucesso.");
        exibeJogos();
    })
    .catch(() => displayMessage("Erro ao alterar jogo."), document.getElementById("title").scrollIntoView({ behavior: 'smooth' }));
}

// Exclui jogo
function deleteJogo(id) {
    fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    })
    .then(() => {
        displayMessage("Jogo removido com sucesso.");
        exibeJogos();
    })
    .catch(() => displayMessage("Erro ao excluir jogo."), document.getElementById("title").scrollIntoView({ behavior: 'smooth' }));
}

// Coleta os dados do formulário
function obterDadosFormulario() {
    return {
        nome: document.getElementById("inputNome").value,
        imagem: document.getElementById("inputImagem").value,
        urlJogo: document.getElementById("inputURLJogo")?.value,
        tipo: document.getElementById("inputTipo").value,
        destaques: document.getElementById("inputDestaques").value === "1",
        habilidades: document.getElementById("inputHabilidades").value,
        descricao: document.getElementById("inputDesc").value
    };
}

// Limpa o formulário
function limparFormulario() {
    document.getElementById("form-jogo").reset();
    document.getElementById("inputId").value = "";
}

// Inicializa os eventos da interface
document.addEventListener('DOMContentLoaded', () => {
    exibeJogos();

    document.getElementById("btnInsert").addEventListener("click", () => {
        const jogo = obterDadosFormulario();
         if (!jogo.nome.trim() || !jogo.imagem.trim() || !jogo.tipo.trim() || !jogo.habilidades.trim() || !jogo.descricao.trim() || !jogo.urlJogo) {
            displayMessage("Preencha todos os campos");
            return;
        }
        insertJogo(jogo);
        limparFormulario();
    });

    document.getElementById("btnUpdate").addEventListener("click", () => {
        const id = document.getElementById("inputId").value;
        if (!id) return displayMessage("Selecione um jogo para alterar.");
        const jogo = obterDadosFormulario();
        updateJogo(id, jogo);
        limparFormulario();
    });

    document.getElementById("btnDelete").addEventListener("click", () => {
        const id = document.getElementById("inputId").value;
        if (!id) return displayMessage("Selecione um jogo para excluir.");
        deleteJogo(id);
        limparFormulario();
    });

    document.getElementById("btnClear").addEventListener("click", limparFormulario);

    document.querySelector("#table-jogos").addEventListener("click", (event) => {
        if (event.target.tagName === "TD") {
            const linha = event.target.parentElement;
            const colunas = linha.querySelectorAll("td");
            document.getElementById("inputId").value = colunas[0].innerText;
            document.getElementById("inputNome").value = colunas[1].innerText;
            document.getElementById("inputImagem").value = colunas[2].innerText;
            document.getElementById("inputURLJogo").value = colunas[3].innerText;
            document.getElementById("inputTipo").value = colunas[4].innerText;
            document.getElementById("inputDestaques").value = colunas[5].innerText === "Sim" ? "1" : "2";
            document.getElementById("inputHabilidades").value = colunas[6].innerText;
            document.getElementById("inputDesc").value = colunas[7].innerText;

            document.getElementById("title").scrollIntoView({ behavior: 'smooth' });
        }
    });

    // Oculta a mensagem após 5 segundos
    const msgElement = document.getElementById("msg");
    if (msgElement) {
        const observer = new MutationObserver(() => {
            setTimeout(() => {
                const alerta = msgElement.querySelector(".alert");
                if (alerta) {
                    alerta.style.transition = "opacity 0.5s";
                    alerta.style.opacity = 0;
                    setTimeout(() => alerta.remove(), 500);
                }
            }, 5000);
        });
        observer.observe(msgElement, { childList: true });
    }
});

//Chama a função de exibir passando parametros para filtrar
document.getElementById("btnSearch").addEventListener("click", (event) => {
    event.preventDefault();
    nome = document.getElementById("filtroNome").value;
    tipo = document.getElementById("filtroTipo").value;
    destaque = document.getElementById("filtroDestaques").value;
    exibeJogos(nome, tipo, destaque)

});
