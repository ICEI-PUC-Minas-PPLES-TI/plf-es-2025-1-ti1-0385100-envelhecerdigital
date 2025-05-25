
const comentariosContainer = document.querySelector('.comentario-conteiner-recente section');
const form = document.querySelector('.comentario-form');

function criarComentarioElemento(comentario) {
  let divComentario = document.createElement('div');
  divComentario.classList.add('comentario-item');

  let paragrafo = document.createElement('p');
  paragrafo.classList.add('comentario-p-recente');
  paragrafo.textContent = 'Jogo: ' + comentario.jogo + ' | Nota: ' + comentario.nota + ' | Comentário: ' + comentario.comentario;

  let botaoExcluir = document.createElement('button');
  botaoExcluir.textContent = 'Excluir';
  botaoExcluir.style.marginLeft = '10px';
  botaoExcluir.style.backgroundColor = '#ff4c4c';
  botaoExcluir.style.border = 'none';
  botaoExcluir.style.color = 'white';
  botaoExcluir.style.borderRadius = '8px';
  botaoExcluir.style.cursor = 'pointer';
  botaoExcluir.style.padding = '2px 8px';

  botaoExcluir.addEventListener('click', function() {
    fetch('/api/comentarios/' + comentario.id, {
      method: 'DELETE'
    }).then(function() {
      carregarComentarios();
    }).catch(function(err) {
      console.log('Erro ao excluir comentário:', err);
    });
  });
  let botaoEditar = document.createElement('button');
  botaoEditar.textContent = 'Editar';
  botaoEditar.style.marginLeft = '10px';
  botaoEditar.style.backgroundColor = '#4caf50';
  botaoEditar.style.border = 'none';
  botaoEditar.style.color = 'white';
  botaoEditar.style.borderRadius = '8px';
  botaoEditar.style.cursor = 'pointer';
  botaoEditar.style.padding = '2px 8px';

  botaoEditar.addEventListener('click', function() {
    document.getElementById('jogo').value = comentario.jogo;
    document.getElementById('nota').value = comentario.nota;
    document.getElementById('comentario').value = comentario.comentario;

    let botao = document.querySelector('.comentario-button');
    botao.textContent = 'Salvar edição';

    function editarComentario(event) {
      event.preventDefault();

      let novoJogo = document.getElementById('jogo').value;
      let novaNota = document.getElementById('nota').value;
      let novoComentario = document.getElementById('comentario').value;

      fetch('/api/comentarios/' + comentario.id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jogo: novoJogo,
          nota: novaNota,
          comentario: novoComentario
        })
      }).then(function() {
        carregarComentarios();
        botao.textContent = 'Enviar';
        form.removeEventListener('submit', editarComentario);
        form.addEventListener('submit', handleSubmit);
        form.reset();
      }).catch(function(err) {
        console.log('Erro ao editar comentário:', err);
      });
    }

    form.removeEventListener('submit', handleSubmit); 
    form.addEventListener('submit', editarComentario); 
  });

  divComentario.appendChild(paragrafo);
  divComentario.appendChild(botaoEditar);
  divComentario.appendChild(botaoExcluir);

  comentariosContainer.appendChild(divComentario);
}

function carregarComentarios() {
  comentariosContainer.innerHTML = ''; 

  fetch('/api/comentarios')
    .then(function(resposta) {
      return resposta.json();
    })
    .then(function(lista) {
      lista.forEach(function(item) {
        criarComentarioElemento(item);
      });
    })
    .catch(function(err) {
      console.log('Erro ao carregar os comentários:', err);
    });
}
function handleSubmit(evento) {
  evento.preventDefault();

  let jogo = document.getElementById('jogo').value.trim();
  let nota = document.getElementById('nota').value.trim();
  let comentario = document.getElementById('comentario').value.trim();

  if (jogo === '' || nota === '' || comentario === '') {
    alert('Preencha todos os campos!');
    return;
  }

  fetch('/api/comentarios', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      jogo: jogo,
      nota: nota,
      comentario: comentario
    })
  }).then(function() {
    carregarComentarios();
    form.reset();
  }).catch(function(erro) {
    console.log('Erro ao enviar o comentário:', erro);
  });
}
form.addEventListener('submit', handleSubmit);

carregarComentarios();