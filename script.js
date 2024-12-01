let questions = [];
let currentQuestionIndex = 0;
let score = 0;
const totalQuestions = 40; // Numero di domande da visualizzare per ogni quiz

// Carica il file JSON e mescola le domande
fetch('question.json')
    .then(response => response.json())
    .then(data => {
        questions = shuffleArray(data); // Mescola tutte le domande inizialmente
        startQuiz();
    })
    .catch(error => console.error('Errore nel caricamento del file JSON:', error));

// Funzione per iniziare il quiz
function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    document.getElementById('final-score').textContent = '';
    document.getElementById('result').classList.add('hidden');
    document.getElementById('quiz-container').classList.remove('hidden');
    // Prende 30 domande casuali mescolate
    const selectedQuestions = getRandomQuestions(questions, totalQuestions);
    questions = selectedQuestions; // Aggiorna l'elenco delle domande per questo round
    showQuestion();
}

// Funzione per mescolare un array
function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

// Funzione per selezionare un numero limitato di domande casuali
function getRandomQuestions(allQuestions, numberOfQuestions) {
    const shuffled = shuffleArray(allQuestions); // Mescola l'array delle domande
    return shuffled.slice(0, numberOfQuestions); // Prende solo le prime "numberOfQuestions"
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
    answersElement.innerHTML = '';

    // Visualizza le risposte in ordine casuale
    const shuffledAnswers = shuffleArray(Object.entries(question.options));
    shuffledAnswers.forEach(([key, answer]) => {
        const button = document.createElement('button');
        button.textContent = `${key}: ${answer}`;
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
        if (button.textContent.startsWith(question.correctAnswer)) {
            button.classList.add('correct');
        } else if (button.textContent.startsWith(selectedKey)) {
            button.classList.add('incorrect');
        }
    });

    if (selectedKey === question.correctAnswer) {
        score++;
    }

    setTimeout(() => {
        currentQuestionIndex++;
        showQuestion();
    }, 1000);
}

// Mostra il risultato finale
function endGame() {
    document.getElementById('quiz-container').classList.add('hidden');
    document.getElementById('result').classList.remove('hidden');
    document.getElementById('final-score').textContent = `Hai totalizzato ${score} punti su ${totalQuestions}!`;
}

// Riavvia il quiz
document.getElementById('restart').addEventListener('click', startQuiz);
