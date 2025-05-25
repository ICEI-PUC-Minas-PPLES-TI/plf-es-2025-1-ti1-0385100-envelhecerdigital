   // Carrrosel//
   var nextBtn = document.querySelector('.next'),
    prevBtn = document.querySelector('.prev'),
    carousel = document.querySelector('.carousel'),
    list = document.querySelector('.list'), 
    item = document.querySelectorAll('.item'),
    runningTime = document.querySelector('.carousel .timeRunning') 

let timeRunning = 3000 
let timeAutoNext = 7000

nextBtn.onclick = function(){
    showSlider('next')
}

prevBtn.onclick = function(){
    showSlider('prev')
}

let runTimeOut 

let runNextAuto = setTimeout(() => {
    nextBtn.click()
}, timeAutoNext)


function resetTimeAnimation() {
    runningTime.style.animation = 'none'
    runningTime.offsetHeight 
    runningTime.style.animation = null 
    runningTime.style.animation = 'runningTime 50s linear 1 forwards'
}


function showSlider(type) {
    let sliderItemsDom = list.querySelectorAll('.carousel .list .item')
    if(type === 'next'){
        list.appendChild(sliderItemsDom[0])
        carousel.classList.add('next')
    } else{
        list.prepend(sliderItemsDom[sliderItemsDom.length - 1])
        carousel.classList.add('prev')
    }

    clearTimeout(runTimeOut)

    runTimeOut = setTimeout( () => {
        carousel.classList.remove('next')
        carousel.classList.remove('prev')
    }, timeRunning)


    clearTimeout(runNextAuto)
    runNextAuto = setTimeout(() => {
        nextBtn.click()
    }, timeAutoNext)

    resetTimeAnimation() 
}
   // Fim Carrrosel//

   // passagem de parametros para a aba dos jogos ( do carrosel para as paginas)
const urlParams = new URLSearchParams(window.location.search);
const id = parseInt(urlParams.get('id'));

fetch('db.json')
  .then(response => response.json())
  .then(data => {
    const jogo = data.jogos.find(j => j.id === id);

    if (jogo) {
      document.getElementById('titulo').textContent = jogo.titulo;
      document.getElementById('imagem').src = jogo.imagem;
      document.getElementById('descricao').textContent = jogo.descricao;
      document.getElementById('link-jogar').href = jogo.link;
    } else {
      document.getElementById('jogo-container').innerHTML = "<p>Jogo não encontrado.</p>";
    }
  })
  .catch(error => {
    console.error('Erro ao carregar dados:', error);
    document.getElementById('jogo-container').innerHTML = "<p>Erro ao carregar os dados.</p>";
       // Fim
  });
   