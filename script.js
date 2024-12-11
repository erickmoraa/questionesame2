let questions = [];
let currentQuestionIndex = 0;
let score = 0;
const totalQuestions = 30; // Numero totale di domande per quiz

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
        const randomQuestion = shuffle(block)[0]; // Seleziona una domanda casuale dal blocco
        selected.push(randomQuestion);
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
        // Suddividi le domande in blocchi di 10 e seleziona 27 domande
        const questionsFromBlocks = getQuestionsByBlocks(data, 10); // Una domanda per ogni blocco di 10

        // Seleziona 3 domande casuali dal blocco 141-210 (indice 140-209)
        const questionsFromSpecificBlock = getRandomQuestions(data.slice(140, 210), 3);

        // Combina le domande selezionate
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
    document.getElementById('feedback').textContent = ''; // Resetta il feedback
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
    document.getElementById('feedback').textContent = ''; // Nasconde feedback precedente

    // Visualizza le risposte senza lettere precedenti
    Object.entries(question.options).forEach(([key, answer]) => {
        const button = document.createElement('button');
        button.textContent = `${answer}`; // Mostra solo la risposta
        button.addEventListener('click', () => checkAnswer(key));
        answersElement.appendChild(button);
    });

    document.getElementById('question-counter').textContent = `Domanda ${currentQuestionIndex + 1} di ${totalQuestions}`;
}

// Controlla se la risposta selezionata è corretta
function checkAnswer(selectedKey) {
    const question = questions[currentQuestionIndex];
    const answers = document.querySelectorAll('.answers button');
    answers.forEach(button => {
        button.disabled = true;
        if (button.textContent === question.options[question.correctAnswer]) {
            button.classList.add('correct');
        } else if (question.options[selectedKey] === button.textContent) {
            button.classList.add('incorrect');
        }
    });

    if (selectedKey === question.correctAnswer) {
        score++;
    }

    // Mostra solo la spiegazione come feedback
    const feedbackElement = document.getElementById('feedback');
    feedbackElement.textContent = question.explanation;

    // Mostra il pulsante per proseguire
    document.getElementById('next-question').classList.remove('hidden');
}

// Passa alla domanda successiva manualmente
document.getElementById('next-question').addEventListener('click', () => {
    currentQuestionIndex++;
    showQuestion();
});

// Mostra i risultati finali solo alla fine
function endGame() {
    document.getElementById('quiz-container').classList.add('hidden');
    document.getElementById('result').classList.remove('hidden'); // Mostra il risultato
    document.getElementById('final-score').textContent = `Game Over! Hai totalizzato ${score} punti su ${totalQuestions}!`;
}
