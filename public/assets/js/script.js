$(document).ready(function () {
    // Light and Dark mode
    let color = getColor();
    setColors(color);

    $(".colorMode").on("click", (e) => {
        color = switchColor(color);
        setColors(color);
    });
})

function getColor() {
    try {
        var colorMode = localStorage.getItem("colorMode");
    } catch {
        var colorMode = "dark";
    }
    return colorMode;
}

function switchColor(color) {
    if (color === "dark") {
        color = "light";
        localStorage.setItem("colorMode", "light");
    } else {
        color = "dark";
        localStorage.setItem("colorMode", "dark");
    }
    return color;
}

function setColors(color) {
    var r = document.querySelector(":root");
    if (color === "dark") {
        $(".colorMode").text("Dark Mode");
        r.style.setProperty("--main-2", "#353535");
        r.style.setProperty("--main-1", "#3c6e71");
        r.style.setProperty("--accent-1", "#d9d9d9");
        r.style.setProperty("--accent-2", "#284b63");
        r.style.setProperty("--accent-3", "#ffffff");
    } else {
        $(".colorMode").text("Light Mode");
        r.style.setProperty("--main-1", "#1a535c");
        r.style.setProperty("--main-2", "white");
        r.style.setProperty("--accent-1", "#4ecdc4");
        r.style.setProperty("--accent-2", "#ff6b6b");
        r.style.setProperty("--accent-3", "#ffe66d");
    }
}