import confetti from 'canvas-confetti';

    const buttons = document.querySelectorAll('.button');
    const startButton = document.getElementById('start-button');
    const scoreDisplay = document.getElementById('score');
    const themeButton = document.getElementById('theme-button');
    const gameOverOverlay = document.getElementById('gameOverOverlay');
    const finalScoreDisplay = document.getElementById('final-score');
    const restartButton = document.getElementById('restart-button');
    const newGameButton = document.getElementById('new-game-button');
    const leaderboardList = document.getElementById('leaderboard-list');
    const landingPage = document.getElementById('landingPage');
    const gameContainer = document.getElementById('gameContainer');
    const playButton = document.getElementById('play-button');
    const usernameInput = document.getElementById('username');
    let sequence = [];
    let userSequence = [];
    let score = 0;
    let gameActive = false;
    let darkMode = false;
    let leaderboard = [];
    let username = '';

    function getRandomColor() {
      const colors = ['green', 'red', 'yellow', 'blue'];
      return colors[Math.floor(Math.random() * colors.length)];
    }

    function activateButton(color) {
      const button = document.querySelector(`[data-color="${color}"]`);
      button.classList.add('active');
      setTimeout(() => {
        button.classList.remove('active');
      }, 300);
    }

    function playSequence() {
      let i = 0;
      const interval = setInterval(() => {
        if (i < sequence.length) {
          activateButton(sequence[i]);
          i++;
        } else {
          clearInterval(interval);
          gameActive = true;
        }
      }, 600);
    }

    function checkUserSequence() {
      for (let i = 0; i < userSequence.length; i++) {
        if (userSequence[i] !== sequence[i]) {
          gameOver();
          return;
        }
      }
      if (userSequence.length === sequence.length) {
        score++;
        scoreDisplay.textContent = score;
        userSequence = [];
        sequence.push(getRandomColor());
        playSequence();
      }
    }

    function handleButtonClick(event) {
      if (!gameActive) return;
      const color = event.target.dataset.color;
      activateButton(color);
      userSequence.push(color);
      checkUserSequence();
    }

    function startGame() {
      resetGame();
      sequence.push(getRandomColor());
      playSequence();
    }

    function resetGame() {
      sequence = [];
      userSequence = [];
      score = 0;
      scoreDisplay.textContent = score;
      gameActive = false;
      gameOverOverlay.style.display = 'none';
    }

    function gameOver() {
      gameActive = false;
      finalScoreDisplay.textContent = score;
      gameOverOverlay.style.display = 'flex';
      updateLeaderboard();
    }

    function updateLeaderboard() {
      let isNewHighScore = false;
      if (leaderboard.length === 0 || score > leaderboard[0].score) {
        isNewHighScore = true;
      }
      leaderboard.push({ name: username, score: score });
      leaderboard.sort((a, b) => b.score - a.score);
      leaderboard = leaderboard.slice(0, 5);
      leaderboardList.innerHTML = '';
      leaderboard.forEach((entry, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${index + 1}. ${entry.name}: ${entry.score}`;
        leaderboardList.appendChild(listItem);
      });
      if (isNewHighScore) {
        playConfetti();
      }
    }

    function playConfetti() {
      confetti({
        particleCount: 200,
        spread: 160,
        origin: { y: 0.7 },
      });
    }

    function toggleTheme() {
      darkMode = !darkMode;
      document.body.classList.toggle('dark-mode', darkMode);
      themeButton.textContent = darkMode ? 'Light Mode' : 'Dark Mode';
    }

    function handlePlay() {
      username = usernameInput.value.trim();
      if (username === '') {
        alert('Please enter a username.');
        return;
      }
      landingPage.style.display = 'none';
      gameContainer.style.display = 'flex';
      startGame();
    }

    function handleNewGame() {
      landingPage.style.display = 'flex';
      gameContainer.style.display = 'none';
      gameOverOverlay.style.display = 'none';
      usernameInput.value = '';
      username = '';
      resetGame();
    }

    startButton.addEventListener('click', startGame);
    buttons.forEach(button => {
      button.addEventListener('click', handleButtonClick);
    });
    themeButton.addEventListener('click', toggleTheme);
    restartButton.addEventListener('click', startGame);
    playButton.addEventListener('click', handlePlay);
    newGameButton.addEventListener('click', handleNewGame);
