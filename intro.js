// Fade-in on load
window.onload = function () {
    document.body.classList.add("loaded");
};

// 👉 Play button click
function startGame(event) {

    // stop triggering screen tap sound
    event.stopPropagation();

    // 🔊 click sound
    const click = document.getElementById("clickSound");
    click.currentTime = 0;
    click.play().catch(()=>{});

    // fade-out animation
    document.body.classList.remove("loaded");
    document.body.classList.add("fade-out");

    // redirect
    setTimeout(() => {
        window.location.href = "home.html";
    }, 200);
}

// 👉 Screen tap sound (button सोडून)
document.addEventListener("click", function (e) {

    if (!e.target.closest("button")) {
        const intro = document.getElementById("introSound");

        intro.currentTime = 0;
        intro.play().catch(()=>{});
    }

});