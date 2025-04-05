const pokemonList = [
    'https://static.pokemonpets.com/images/monsters-images-300-300/39-Jigglypuff.webp',
    'https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/025.png',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQn53W8LmyJPbaFpSYs2370C9f8H8SfW2P6sNCjrESdmTVtaC9x1s71M8VBhihrUVRB3TM&usqp=CAU',
    'https://media.licdn.com/dms/image/v2/D4D12AQGu70jFipeVkw/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1655459945294?e=2147483647&v=beta&t=WVSJuPV6bEIeEbZ6Wb73gVC7owqwXUpNhr-7_a95JI4',
    'https://db.pokemongohub.net/_next/image?url=%2Fimages%2Fofficial%2Ffull%2F007.webp&w=640&q=75'
  ];
  
  let deck = [];
  let gameBoard = document.getElementById('game-board');
  let moves = 0;
  let timer = 0;
  let firstCard = null;
  let lockBoard = false;
  let matchedPairs = 0;
  let timerInterval = null;
  
  function createDeck() {
    const doubled = [...pokemonList, ...pokemonList]; // 10 cards
    return doubled.sort(() => 0.5 - Math.random());
  }
  
  function createBoard() {
    gameBoard.innerHTML = '';
    deck = createDeck();
    deck.forEach(src => {
      const card = document.createElement('div');
      card.classList.add('card');
      card.innerHTML = `
        <div class="front"><img src="${src}" alt="Pokemon"></div>
        <div class="back"></div>
      `;
      card.addEventListener('click', () => flipCard(card));
      gameBoard.appendChild(card);
    });
  }
  
  function flipCard(card) {
    if (lockBoard || card.classList.contains('flip') || card.classList.contains('match')) return;
  
    card.classList.add('flip');
  
    if (!firstCard) {
      firstCard = card;
      if (moves === 0 && timer === 0) startTimer();
    } else {
      checkMatch(firstCard, card);
      firstCard = null;
    }
  }
  
  function checkMatch(card1, card2) {
    const img1 = card1.querySelector('.front img').src;
    const img2 = card2.querySelector('.front img').src;
    const isMatch = img1 === img2;
  
    updateMoves();
  
    if (isMatch) {
      card1.classList.add('match');
      card2.classList.add('match');
      matchedPairs++;
  
      if (matchedPairs === 5) {
        clearInterval(timerInterval);
        setTimeout(() => {
          alert(`🎉 You won in ${moves} moves and ${timer} seconds!`);
          checkHighScore();
        }, 300);
      }
    } else {
      lockBoard = true;
      setTimeout(() => {
        card1.classList.remove('flip');
        card2.classList.remove('flip');
        lockBoard = false;
      }, 900);
    }
  }
  
  function updateMoves() {
    moves++;
    document.getElementById('moves').textContent = `Moves: ${moves}`;
  }
  
  function startTimer() {
    timerInterval = setInterval(() => {
      timer++;
      document.getElementById('timer').textContent = `Time: ${timer}s`;
    }, 1000);
  }
  
  function restartGame() {
    clearInterval(timerInterval);
    timer = 0;
    moves = 0;
    matchedPairs = 0;
    firstCard = null;
    lockBoard = false;
    document.getElementById('timer').textContent = 'Time: 0s';
    document.getElementById('moves').textContent = 'Moves: 0';
    createBoard();
  }
  
  function checkHighScore() {
    const best = JSON.parse(localStorage.getItem('pokeHighScore'));
    const current = { moves, time: timer };
  
    if (!best || moves < best.moves || (moves === best.moves && timer < best.time)) {
      localStorage.setItem('pokeHighScore', JSON.stringify(current));
      showHighScore();
    }
  }
  
  function showHighScore() {
    const best = JSON.parse(localStorage.getItem('pokeHighScore'));
    if (best) {
      document.getElementById('highscore').textContent = `🏆 Best: ${best.moves} moves, ${best.time}s`;
    }
  }
  
  restartGame();
  showHighScore();
  