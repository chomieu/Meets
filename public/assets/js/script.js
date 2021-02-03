$(document).ready(function () {
    // Light and Dark mode
    let color = getColor();
    setColors(color);

    $(".colorMode").on("click", (e) => {
        console.log("color mode change");
        color = switchColor(color);
        setColors(color);
    });

    $(".search").keyup(function () {
        var filter = $(".search").val().toLowerCase();
        $(".searchObj").each(function () {
          if ($(this).text().toLowerCase().indexOf(filter) > -1) {
            $(this).parent().show()
          } else {
            $(this).parent().hide()
          }
        })
    })
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
        //  DARK MODE
        $(".colorMode").text("Light Mode");
        r.style.setProperty("--main-2", "#353535");
        r.style.setProperty("--main-1", "#3c6e71");
        r.style.setProperty("--accent-1", "#284b63");
        r.style.setProperty("--accent-2", "#d9d9d9");
        r.style.setProperty("--accent-3", "#ffffff");
        r.style.setProperty("--accent-4", "#757575");
        r.style.setProperty("--text", "white");
        r.style.setProperty("--text-opposite", "black");
    } else {
        // LIGHT MODE
        $(".colorMode").text("Dark Mode");
        r.style.setProperty("--main-1", "#e65100");
        r.style.setProperty("--main-2", "#ffffff");
        r.style.setProperty("--accent-1", "#ff8f00");
        r.style.setProperty("--accent-2", "#ff4e4e");
        r.style.setProperty("--accent-3", "#ffe57f");
        r.style.setProperty("--accent-4", "#ffe0b2");
        r.style.setProperty("--text", "black");
        r.style.setProperty("--text-opposite", "white");
    }
}