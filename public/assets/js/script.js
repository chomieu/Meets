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
        r.style.setProperty("--color-1", "#d8f3dc");
        r.style.setProperty("--color-2", "#b7e4c7");
        r.style.setProperty("--color-3", "#40916c");
        r.style.setProperty("--color-4", "#74c69d");
        r.style.setProperty("--color-5", "#52b788");
    } else {
        $(".colorMode").text("Light Mode");
        r.style.setProperty("--color-1", "#264653");
        r.style.setProperty("--color-2", "#2a9d8f");
        r.style.setProperty("--color-3", "#e9c46a");
        r.style.setProperty("--color-4", "#f4a261");
        r.style.setProperty("--color-5", "#e76f51");
    }
}