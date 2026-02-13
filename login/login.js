let isLoginMode = false;
const authBtn = document.getElementById('authBtn');
const toggleMsg = document.getElementById('toggleMsg');
const keyWrapper = document.getElementById('keyWrapper');

// GSAP Entrance
gsap.from(".auth-card", { duration: 1, y: 50, opacity: 0, ease: "power3.out" });

toggleMsg.addEventListener('click', () => {
    isLoginMode = !isLoginMode;
    
    // Smooth toggle animation
    gsap.to(".input-stack", { opacity: 0, y: 5, duration: 0.2, onComplete: () => {
        document.getElementById('formTitle').textContent = isLoginMode ? "Welcome Back" : "Create Sanctuary";
        keyWrapper.style.display = isLoginMode ? "none" : "block";
        authBtn.querySelector('.btn-text').textContent = isLoginMode ? "Sign In" : "Enter the Vault";
        toggleMsg.innerHTML = isLoginMode ? "Need an account? <span>Sign Up</span>" : "Already have a sanctuary? <span>Sign In</span>";
        gsap.to(".input-stack", { opacity: 1, y: 0, duration: 0.2 });
    }});
});

authBtn.addEventListener('click', () => {
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value.trim();
    const key = document.getElementById('partnerKey').value.trim();

    if (!user || !pass) return alert("Fill in your details!");

    if (isLoginMode) {
        const savedUser = JSON.parse(localStorage.getItem(`user_${user}`));
        if (savedUser && savedUser.password === pass) {
            sessionStorage.setItem('activeUser', JSON.stringify(savedUser));
            // GO UP ONE LEVEL to your distance app folder
            window.location.href = "../index.html"; 
        } else {
            alert("Wrong credentials!");
        }
    } else {
        if (!key) return alert("Partner key required!");
        const userData = { username: user, password: pass, partnerKey: key };
        localStorage.setItem(`user_${user}`, JSON.stringify(userData));
        sessionStorage.setItem('activeUser', JSON.stringify(userData));
        // GO UP ONE LEVEL to your distance app folder
        window.location.href = "../index.html";
    }
});