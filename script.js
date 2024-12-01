let questions = [];
let currentQuestionIndex = 0;
let score = 0;
const totalQuestions = 30;

// Carica il file JSON
fetch('question.json')
    .then(response => response.json())
    .then(data => {
        questions = data.sort(() => 0.5 - Math.random()).slice(0, totalQuestions); // Domande casuali
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
    document.getElementById('next-question').classList.add('hidden'); // Nasconde il pulsante "Prosegui"
    document.getElementById('restart').disabled = false; // Riabilita il pulsante "Reset"
    showQuestion();
}

// Mostra la domanda corrente
function showQuestion() {
    if (currentQuestionIndex >= questions.length) {
        endGame(); // Mostra il messaggio solo alla fine
        return;
    }

    const question = questions[currentQuestionIndex];
    document.getElementById('question').textContent = question.question;
    const answersElement = document.getElementById('answers');
    answersElement.innerHTML = ''; // Reset delle risposte

    const shuffledAnswers = shuffleArray(Object.entries(question.options)); // Mescola le risposte
    shuffledAnswers.forEach(([key, answer]) => {
        const button = document.createElement('button');
        button.textContent = `${key}: ${answer}`;
        button.addEventListener('click', () => checkAnswer(key));
        answersElement.appendChild(button);
    });

    document.getElementById('question-counter').textContent = `Domanda ${currentQuestionIndex + 1} di ${totalQuestions}`;
    document.getElementById('next-question').classList.add('hidden'); // Nasconde il pulsante "Prosegui"
}

// Controlla se la risposta selezionata è corretta
function checkAnswer(selectedKey) {
    const question = questions[currentQuestionIndex];
    const answers = document.querySelectorAll('.answers button');
    answers.forEach(button => {
        button.disabled = true;
        if (button.textContent.startsWith(question.correctAnswer)) {
            button.classList.add('correct');
        } else if (button.textContent.startsWith(selectedKey)) {
            button.classList.add('incorrect');
        }
    });

    if (selectedKey === question.correctAnswer) {
        score++;
    }

    // Mostra il pulsante "Prosegui" per passare alla domanda successiva
    document.getElementById('next-question').classList.remove('hidden');
}

// Passa alla domanda successiva manualmente
document.getElementById('next-question').addEventListener('click', () => {
    currentQuestionIndex++;
    showQuestion();
});

// Pulsante di reset (Resetta il quiz)
document.getElementById('restart').addEventListener('click', () => {
    document.getElementById('restart').disabled = true; // Disabilita temporaneamente il pulsante "Reset"
    startQuiz(); // Riavvia il quiz
});

// Mostra i risultati finali solo alla fine
function endGame() {
    document.getElementById('quiz-container').classList.add('hidden');
    document.getElementById('result').classList.remove('hidden'); // Mostra il risultato
    document.getElementById('final-score').textContent = `Game Over! Hai totalizzato ${score} punti su ${totalQuestions}!`;
}

// Funzione per mescolare un array (utile per mescolare le risposte)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


