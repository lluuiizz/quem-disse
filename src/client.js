const socket = io()

$(document).ready(function() {
    $(".center").hide();
    $("h1").hide();
    $("#field").hide();
    $(".center").slideDown(1000);
    $("h1").fadeIn(1500);
    $("#field").fadeIn(1500);

    socket.on("initLifePoints", (lifePoints)=>{
        var i
        for (i = 0; i < lifePoints; i++) {
            $(".lifePoints").prepend("<img id ='hearth" + i + "'src='/images/hearth.png' alt='lifePoints'>\n");
        }
    })

    socket.on("changeLifePoints", (lifePoints)=>{
        $("#hearth" + lifePoints).fadeOut(500)
    })

    //  Change Always receives the event phrase
    socket.on('phrase', (phrase, category)=>{
        $("#phrase").html(phrase)
        $("#category").html(category)

    })
    socket.on('changeScore', (score, max) => {
        $("#score").html(`${score} / ${max}`)
    })
   socket.on('win', ()=>{
        $(".center").hide(1500);
        $(".answears").hide(1500);
        $("h1").slideUp(0)
        $("h1").slideDown(2000)
        $("h1").text("Você Venceu!")
        $("h1").fadeIn(5000)

    })
    socket.on('lose', () => {
        $(".center").hide(1500);
        $(".answears").hide(1500);
        $("h1").slideUp(0)
        $("h1").slideDown(2000)
        $("h1").text("Você Perdeu!")
        $("h1").fadeIn(5000)
    })


    socket.on("changeAnswearsButtons", (options) => {
        for (i = 0; i < 4; i++) {
            $("#button"+i).text(options[i])
        }
    })
})


function submitAnswear(element) {

    answear = element.textContent
    socket.emit('answear', answear)
}


