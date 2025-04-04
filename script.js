document.addEventListener("DOMContentLoaded", () => {
    const bar = document.getElementById("bar");
    const close = document.getElementById("close");
    const nav = document.getElementById("navbar");

    if (bar) {
        bar.addEventListener("click", () => {
            nav.classList.add("active");
        });
    }

    if (close) { // Må være inni DOMContentLoaded
        close.addEventListener("click", () => {
            nav.classList.remove("active");
        });
    }
});