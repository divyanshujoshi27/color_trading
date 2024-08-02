document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loading-screen');
    const mainContainer = document.getElementById('main-container');
    const betSection = document.getElementById('bet-section');
    const gameGrid = document.getElementById('game-grid');
    const blocks = document.querySelectorAll('.block');
    const message = document.querySelector('.message');
    const restartBtn = document.getElementById('restart-btn');
    const difficultyBtn = document.getElementById('difficulty-btn');
    const startGameBtn = document.getElementById('start-game-btn');
    const betAmountInput = document.getElementById('bet-amount');
    
    let blockValues = [];
    let difficultyOn = false;
    let clickCount = 0;
    let userBet = 0;

    // Loading Screen Timeout
    setTimeout(() => {
        loadingScreen.style.display = 'none';
        mainContainer.classList.remove('hidden');
    }, 3000);

    function startGame() {
        userBet = parseInt(betAmountInput.value);
        if (isNaN(userBet) || userBet <= 0) {
            alert('Please enter a valid bet amount.');
            return;
        }
        
        betSection.classList.add('hidden');
        gameGrid.classList.remove('hidden');
        
        blockValues = generateBlocks();
        clickCount = 0;
        blocks.forEach((block, index) => {
            block.className = 'block'; // Reset block class
            block.addEventListener('click', () => handleBlockClick(index));
        });
        message.textContent = '';
    }

    function generateBlocks() {
        const values = Array(9).fill('green');
        values[0] = 'red';
        values[1] = 'red';
        return shuffleArray(values);
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function handleBlockClick(index) {
        const block = blocks[index];
        if (block.classList.contains('green') || block.classList.contains('red')) {
            return; // If block already revealed, ignore click
        }

        clickCount++;
        if (difficultyOn && clickCount === 3) {
            blockValues[index] = 'red'; // Force third click to turn red if difficulty is on
        }

        block.classList.add(blockValues[index]);
        block.removeEventListener('click', () => handleBlockClick(index));

        if (blockValues[index] === 'red') {
            message.textContent = 'You lost! Try again.';
            disableAllBlocks();
        } else if (checkWin()) {
            message.textContent = `Congratulations! You won ₹${userBet * 2}!`;
        }
    }

    function disableAllBlocks() {
        blocks.forEach(block => block.removeEventListener('click', () => handleBlockClick()));
    }

    function checkWin() {
        return [...blocks].filter(block => block.classList.contains('green')).length === 7;
    }

    restartBtn.addEventListener('click', () => {
        betSection.classList.remove('hidden');
        gameGrid.classList.add('hidden');
        startGame();
    });

    difficultyBtn.addEventListener('click', () => {
        difficultyOn = !difficultyOn;
        difficultyBtn.textContent = difficultyOn ? 'Switch Difficulty: ON' : 'Switch Difficulty: OFF';
    });

    startGameBtn.addEventListener('click', startGame);
});
