// --- 1. DATABASE SETUP ---
let db;
const dbRequest = indexedDB.open("DistanceLoveDB", 1);

dbRequest.onupgradeneeded = (e) => {
    db = e.target.result;
    db.createObjectStore("capsules", { keyPath: "id", autoIncrement: true });
};

dbRequest.onsuccess = (e) => {
    db = e.target.result;
    renderVault();
    setInterval(renderVault, 1000); // Live countdown refresh
};

// --- 2. ENTRANCE ANIMATIONS ---
window.addEventListener('load', () => {
    gsap.to(".container", { opacity: 1, duration: 1 });
    gsap.from(".capsule-form", { y: 30, opacity: 0, duration: 0.8, delay: 0.3 });
});

// --- 3. SAVE MEMORY ---
document.getElementById('saveBtn').addEventListener('click', async () => {
    const title = document.getElementById('capsuleTitle').value;
    const message = document.getElementById('capsuleMessage').value;
    const unlockDate = document.getElementById('unlockDate').value;
    const imageFile = document.getElementById('imageInput').files[0];
    const mediaFile = document.getElementById('mediaInput').files[0];

    if (!title || !unlockDate) {
        gsap.to(".capsule-form", { x: 10, repeat: 3, yoyo: true, duration: 0.05 }); // Shake error
        return alert("Please enter a Title and Unlock Time.");
    }

    const capsule = {
        title,
        message,
        unlockAt: new Date(unlockDate).getTime(),
        image: imageFile || null,
        media: mediaFile || null,
        created: Date.now()
    };

    const tx = db.transaction("capsules", "readwrite");
    tx.objectStore("capsules").add(capsule);

    tx.oncomplete = () => {
        // Success Animation
        gsap.to("#saveBtn", { backgroundColor: "#28a745", textContent: "Sealed! ✨", duration: 0.5 });
        setTimeout(() => location.reload(), 1000);
    };
});

// --- 4. RENDER VAULT ---
function renderVault() {
    const container = document.getElementById('capsuleContainer');
    const tx = db.transaction("capsules", "readonly");
    const store = tx.objectStore("capsules");
    const getRequest = store.getAll();

    getRequest.onsuccess = () => {
        const capsules = getRequest.result;
        
        // Sorting: Newest first
        capsules.sort((a, b) => b.created - a.created);
        
        // We only rebuild if the count changed to avoid animation flickering
        if (container.children.length !== capsules.length) {
            container.innerHTML = '';
            capsules.forEach((cap, i) => {
                const card = createCard(cap);
                container.appendChild(card);
                gsap.to(card, { opacity: 1, y: 0, duration: 0.5, delay: i * 0.1 });
            });
        } else {
            // Just update the timers for existing cards
            capsules.forEach((cap, i) => {
                updateTimer(cap, container.children[i]);
            });
        }
    };
}

function createCard(cap) {
    const card = document.createElement('div');
    card.className = 'capsule-card';
    card.id = `cap-${cap.id}`;
    updateTimer(cap, card);
    return card;
}

function updateTimer(cap, cardElement) {
    const now = Date.now();
    const diff = cap.unlockAt - now;
    const isUnlocked = diff <= 0;

    if (isUnlocked) {
        if (cardElement.dataset.status !== "open") {
            cardElement.dataset.status = "open";
            let mediaHtml = '';
            if (cap.image) mediaHtml += `<img src="${URL.createObjectURL(cap.image)}">`;
            if (cap.media) {
                const url = URL.createObjectURL(cap.media);
                mediaHtml += cap.media.type.includes('video') 
                    ? `<video src="${url}" controls></video>` 
                    : `<audio src="${url}" controls></audio>`;
            }
            cardElement.innerHTML = `
                <h3>${cap.title}</h3>
                <p>${cap.message}</p>
                ${mediaHtml}
            `;
            gsap.from(cardElement, { backgroundColor: "#fff0f3", duration: 1 });
        }
    } else {
        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff % 86400000) / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        cardElement.innerHTML = `
            <h3>${cap.title} 🔒</h3>
            <p class="timer">Opens in: ${d}d ${h}h ${m}m ${s}s</p>
        `;
    }
}