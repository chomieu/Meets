$("body").on('wheel', () => {
    $(".box").css("animation-play-state", "running")
    setTimeout(()=>{
        $(".box").css("animation-play-state", "paused")
    }, 1235)
})