// Add JavaScript code for your web site here and call it from index.html.
document.getElementById("btn").addEventListener("click", function() {
    let inputText = document.getElementById("input").value;
    document.getElementById("output").innerText = "You typed: " + inputText;
});
function updateClock() {
    const clockElement = document.getElementById("clock");
    if (clockElement) {
        const now = new Date();
        const utcHours = now.getUTCHours().toString().padStart(2, '0');
        const utcMinutes = now.getUTCMinutes().toString().padStart(2, '0');
        const utcSeconds = now.getUTCSeconds().toString().padStart(2, '0');
        clockElement.innerText = `${utcHours}:${utcMinutes}:${utcSeconds} UTC`;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    updateClock(); 
    setInterval(updateClock, 1000);
});

