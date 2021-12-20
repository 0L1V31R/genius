// botões clicaveis
const buttonElements = document.querySelectorAll('.clickable');
// botão inicio do jogo
const controlElement = document.querySelectorAll('.top-left, .top-right');
// texto com condição atual do jogo
const controlStatusElement = document.querySelector('.start-stop');
// pontuação do jogo
const scoreElement = document.querySelector('.current-score');
// melhor pontuação
const highScoreElement = document.querySelector('.best-score');


//variaveis do jogo
let roundAnswers = [];
let playerAnswers = [];
let difficulty = 4;
let interval = 0;
let score = 0;
let bestScore = 0;

let waitingPlayer = false;
let startRound = true;

//funções
//função para numero aleatório

const getRandomValue = (array) => {
    return array[Math.floor(Math.random() * array.length)];
};

const displaySequence = (index) => {
    let element = roundAnswers[index];

    setTimeout(() => {
        element.classList.add('active');

        setTimeout(() => {
            element.classList.remove('active');
            index++;

            if (index < roundAnswers.length) {
                displaySequence(index);
            } else {
                waitingPlayer = true;

                for (let i=0; i < controlElement.length; i++) {
                    controlElement[i].style.backgroundColor = 'lightblue';
                }
                controlStatusElement.innerHTML = 'YOUR TURN';
                toggleButtonCursorStyle();

            }
        }, 1000 - interval)
    }, 1000 - interval)
};

const callRound = () => {
    playerAnswers = [];

    for (let i=0; i< controlElement.length; i++) {
        controlElement[i].style.cursor = 'auto';
        controlElement[i].style.backgroundColor = 'yellow';
    };
    controlStatusElement.innerHTML = 'OBSERVE';

    const loopLimit = difficulty - roundAnswers.length;

    for (let i = 0; i < loopLimit; i++) {
        const randomValue = getRandomValue(buttonElements);
        roundAnswers.push(randomValue);
    };
    displaySequence(0);
};

const toggleButtonCursorStyle = () => {
    for (let buttons of buttonElements) {
        buttons.style.cursor = buttons.style.cursor === 'pointer' ? '' : 'pointer';
    }
};

const processDifficulty = (toIncrease) => {
    if (toIncrease) {
        difficulty++;
        interval = ( interval < 500 ) ? interval + 10 : interval;
    } else {
        difficulty = 4;
        interval = 0;
    }
};

const updateScore = () => {
    scoreElement.innerHTML = score;
    highScoreElement.innerHTML = (bestScore > 0) ? bestScore : "-";
};

const processAnswers = () => {
    waitingPlayer = false;

    toggleButtonCursorStyle();

    let allCorrect = true;

    for (let j in roundAnswers) {
        const properAnswer = roundAnswers[j];
        const playserAnswer = playerAnswers[j];
        if (properAnswer != playserAnswer) {
            allCorrect = false;
        }
    }

    if (allCorrect) {
        for (let i=0; i< controlElement.length; i++) {
            controlElement[i].style.cursor = 'pointer';
            controlElement[i].style.backgroundColor = 'green';
        };
        controlStatusElement.innerHTML = 'VERY GOOD';
        setTimeout(() => {
            callRound();
        }, 1500);
    } else {
        for (let i=0; i< controlElement.length; i++) {
            controlElement[i].style.cursor = 'pointer';
            controlElement[i].style.backgroundColor = 'red';
        };
        controlStatusElement.innerHTML = 'RESTART';

        bestScore = (score > bestScore) ? score : bestScore;
        startRound = true;
    }

    score = allCorrect ? score + 1 : score;
    score = allCorrect ? score : 0;
    updateScore();
    processDifficulty(allCorrect);
};

const processClick = (element) => {
    if (!waitingPlayer) {
        return;
    }

    playerAnswers.push(element);
    element.classList.add('active');
    setTimeout(() => {
        element.classList.remove('active');
    }, 750);
    const i = playerAnswers.length - 1;
    
    if (playerAnswers[i] !== roundAnswers[i] || playerAnswers.length === roundAnswers.length) {
        processAnswers();
    }
};

/// funções dos botões externos
buttonElements[0].onclick = () => processClick(buttonElements[0]);
buttonElements[1].onclick = () => processClick(buttonElements[1]);
buttonElements[2].onclick = () => processClick(buttonElements[2]);
buttonElements[3].onclick = () => processClick(buttonElements[3]);

//iniciar o jogo ao clicar
controlStatusElement.style.cursor = 'pointer';
controlStatusElement.onclick = () => {
    if (startRound) {
        callRound();
        startRound = false;
        processClick();
    }
};