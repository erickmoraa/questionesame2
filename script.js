let questions = [];
let currentQuestionIndex = 0;
let score = 0;
const totalQuestions = 30;

// Funzione per mescolare un array
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Seleziona una domanda casuale da ciascun blocco di 10
function getQuestionsByBlocks(data, blockSize) {
    const selected = [];
    for (let i = 0; i < data.length; i += blockSize) {
        const block = data.slice(i, i + blockSize);
        if (block.length > 0) {
            const randomQuestion = shuffle(block)[0];
            selected.push(randomQuestion);
        }
    }
    return selected;
}

// Seleziona casualmente un numero specifico di domande da un array
function getRandomQuestions(group, count) {
    return shuffle(group).slice(0, count);
}

// Carica il file JSON
fetch('question.json')
    .then(response => response.json())
    .then(data => {
        // Seleziona 27 domande, una per blocco di 10
        const questionsFromBlocks = getQuestionsByBlocks(data, 10);

        // Seleziona 3 domande casuali dall'intervallo 141-210 (indice 140-209)
        const questionsFromSpecificBlock = getRandomQuestions(data.slice(140, 210), 3);

        // Combina e mescola le domande
        questions = shuffle([...questionsFromBlocks, ...questionsFromSpecificBlock]);

        startQuiz();
    })
    .catch(error => console.error('Errore nel caricamento del file JSON:', error));

// Avvia il quiz
function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    document.getElementById('final-score').textContent = '';
    document.getElementById('result').classList.add('hidden');
    document.getElementById('quiz-container').classList.remove('hidden');
    document.getElementById('feedback').textContent = '';
    showQuestion();
}

// Mostra la domanda corrente
function showQuestion() {
    if (currentQuestionIndex >= questions.length) {
        endGame();
        return;
    }

    const question = questions[currentQuestionIndex];
    document.getElementById('question').textContent = question.question;
    const answersElement = document.getElementById('answers');
    answersElement.innerHTML = ''; // Reset delle risposte
    document.getElementById('feedback').textContent = '';

    Object.entries(question.options).forEach(([key, answer]) => {
        const button = document.createElement('button');
        button.textContent = answer;
        button.addEventListener('click', () => checkAnswer(key));
        answersElement.appendChild(button);
    });

    document.getElementById('question-counter').textContent = `Domanda ${currentQuestionIndex + 1} di ${totalQuestions}`;
}

// Controlla se la risposta è corretta
function checkAnswer(selectedKey) {
    const question = questions[currentQuestionIndex];
    const answers = document.querySelectorAll('.answers button');
    answers.forEach(button => {
        button.disabled = true;
        if (button.textContent === question.options[question.correctAnswer]) {
            button.classList.add('correct');
        } else if (button.textContent === question.options[selectedKey]) {
            button.classList.add('incorrect');
        }
    });

    if (selectedKey === question.correctAnswer) {
        score++;
    }

    document.getElementById('feedback').textContent = question.explanation;
    document.getElementById('next-question').classList.remove('hidden');
}

// Passa alla domanda successiva
document.getElementById('next-question').addEventListener('click', () => {
    currentQuestionIndex++;
    document.getElementById('next-question').classList.add('hidden');
    showQuestion();
});

// Mostra i risultati finali
function endGame() {
    document.getElementById('quiz-container').classList.add('hidden');
    document.getElementById('result').classList.remove('hidden');
    document.getElementById('final-score').textContent = `Game Over! Hai totalizzato ${score} punti su ${totalQuestions}!`;
}
