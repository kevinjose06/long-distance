function showResults() {
    document.getElementById('questionContainer').style.display = 'none';
    const resultDiv = document.getElementById('resultContainer');
    resultDiv.style.display = 'block';

    const percent = Math.round((score / currentQuestions.length) * 100);
    document.getElementById('scoreText').innerText = `Compatibility: ${percent}%`;
    
    gsap.to("#progressFill", { width: percent + "%", duration: 2, ease: "power4.out" });
    
    let msg = percent > 70 ? "You know each other so well! ❤️" : "Time for a deep conversation! 😊";
    document.getElementById('compatibilityMsg').innerText = msg;

    // This is the new part that erases the questions
    clearUsedQuestions(); 
}

function clearUsedQuestions() {
    const tx = db.transaction("questions", "readwrite");
    const store = tx.objectStore("questions");

    // This scans the database for your specific partner key and deletes them
    store.openCursor().onsuccess = (e) => {
        const cursor = e.target.result;
        if (cursor) {
            if (cursor.value.partnerKey === user.partnerKey) {
                store.delete(cursor.primaryKey);
            }
            cursor.continue();
        }
    };
}