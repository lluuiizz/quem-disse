const socket = io()

var score = 5

$(document).ready(function() {
    $(".center").hide();
    $("h1").hide();
    $("#field").hide();
    $(".center").slideDown(1000);
    $("h1").fadeIn(1500);
    $("#field").fadeIn(1500);

    socket.on("initScore", ()=>{
        var i
        for (i = 0; i < score; i++) {
            j = i + 1
            $(".score").prepend("<img id ='hearth" + j + "'src='/images/hearth.png' alt='score'>\n");
        }
    }
    )

    socket.on("changeScore", ()=>{
        $("#hearth" + score).fadeOut(500)

        score -= 1
    }
    )

    //  Change Always receives the event phrase 
    socket.on('phrase', (phrase,index)=>{
        $("#phrase").html(phrase)
        indexesAlreadyUsed.push(index)
    }
    )
    socket.on('win', ()=>{
        $("#phrase").html("Você Venceu!!!")
    }
    )
});

let indexesAlreadyUsed = Array()

function submitAnswear(element) {

    answear = element.value
    element.value = ""

    socket.emit('answear', answear, indexesAlreadyUsed)
}

function keyPress(e) {
    var keynum;

    if (window.event) {
        // IE                  
        keynum = e.keyCode;
    } else if (e.which) {
        // Netscape/Firefox/Opera                 
        keynum = e.which;
    }

    if (keynum == 13) {
        // 13 == enter
        let element = document.getElementById('field');
        submitAnswear(element)
    }
}