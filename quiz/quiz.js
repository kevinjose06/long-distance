const user = JSON.parse(sessionStorage.getItem('activeUser'));
if (!user) window.location.href = "../login/login.html";

let db;
let currentQuestions = [];
let currentIndex = 0;
let score = 0;

// Initialize Database
const request = indexedDB.open("QuizDB", 1);
request.onupgradeneeded = e => {
    e.target.result.createObjectStore("questions", { keyPath: "id", autoIncrement: true });
};
request.onsuccess = e => {
    db = e.target.result;
};

function switchView(view) {
    gsap.to(".glass-card", { opacity: 0, scale: 0.9, duration: 0.3, onComplete: () => {
        document.getElementById('setupView').style.display = 'none';
        document.getElementById(view + 'View').style.display = 'block';
        gsap.to("#" + view + "View", { opacity: 1, scale: 1, duration: 0.5 });
        if(view === 'solve') loadQuestions();
    }});
}

function saveQuestion() {
    const text = document.getElementById('qText').value;
    const ans = document.getElementById('qAns').value.toLowerCase().trim();
    
    if(!text || !ans) return;

    const tx = db.transaction("questions", "readwrite");
    tx.objectStore("questions").add({ text, ans, partnerKey: user.partnerKey });
    
    tx.oncomplete = () => {
        document.getElementById('qText').value = '';
        document.getElementById('qAns').value = '';
        document.getElementById('qStatus').innerText = "Question Added! ✨";
        gsap.from("#qStatus", { y: 10, opacity: 0 });
    };
}

function loadQuestions() {
    const tx = db.transaction("questions", "readonly");
    tx.objectStore("questions").getAll().onsuccess = e => {
        currentQuestions = e.target.result.filter(q => q.partnerKey === user.partnerKey);
        if(currentQuestions.length === 0) {
            document.getElementById('displayQ').innerText = "No questions set by your partner yet!";
        } else {
            showQuestion();
        }
    };
}

function showQuestion() {
    const q = currentQuestions[currentIndex];
    document.getElementById('displayQ').innerText = q.text;
    gsap.from("#displayQ", { x: -50, opacity: 0, duration: 0.5 });
}

function nextQuestion() {
    const userAns = document.getElementById('solverAns').value.toLowerCase().trim();
    if(userAns === currentQuestions[currentIndex].ans) score++;

    currentIndex++;
    document.getElementById('solverAns').value = '';

    if(currentIndex < currentQuestions.length) {
        showQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    document.getElementById('questionContainer').style.display = 'none';
    const resultDiv = document.getElementById('resultContainer');
    resultDiv.style.display = 'block';

    const percent = Math.round((score / currentQuestions.length) * 100);
    document.getElementById('scoreText').innerText = `Compatibility: ${percent}%`;
    
    gsap.to("#progressFill", { width: percent + "%", duration: 2, ease: "power4.out" });
    
    let msg = percent > 70 ? "You know each other so well! ❤️" : "Time for a deep conversation! 😊";
    document.getElementById('compatibilityMsg').innerText = msg;
}