:root {
    --primary: #ff4d6d;
    --bg-gradient: linear-gradient(135deg, #fff5f7 0%, #ffe3e8 100%);
}

body {
    font-family: 'Poppins', sans-serif;
    background: var(--bg-gradient);
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0;
}

.auth-card {
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    padding: 40px;
    border-radius: 30px;
    box-shadow: 0 20px 60px rgba(255, 77, 109, 0.2);
    width: 320px;
    text-align: center;
    border: 1px solid white;
}

.logo { font-size: 3rem; margin-bottom: 10px; }
h1 { font-family: 'Dancing Script', cursive; color: var(--primary); margin: 0; }

.input-stack { display: flex; flex-direction: column; gap: 20px; margin-top: 20px; }

.input-field { position: relative; border-bottom: 2px solid #ddd; }
.input-field input {
    width: 100%;
    padding: 10px 0;
    background: none;
    border: none;
    outline: none;
    font-size: 1rem;
}

.input-field label {
    position: absolute;
    left: 0;
    top: 10px;
    color: #999;
    transition: 0.3s;
    pointer-events: none;
}

.input-field input:focus ~ label,
.input-field input:not(:placeholder-shown) ~ label {
    top: -15px;
    font-size: 0.8rem;
    color: var(--primary);
}

button {
    margin-top: 30px;
    width: 100%;
    padding: 15px;
    background: var(--primary);
    color: white;
    border: none;
    border-radius: 15px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 5px 15px rgba(255, 77, 109, 0.3);
}

#toggleMsg { margin-top: 20px; font-size: 0.8rem; cursor: pointer; }
#toggleMsg span { color: var(--primary); font-weight: bold; }