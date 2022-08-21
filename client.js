const socket = io()

$(document).ready(function() {
    $(".center").hide();
    $("h1").hide();
    $("#field").hide();
    $(".center").slideDown(1000);
    $("h1").fadeIn(1500);
    $("#field").fadeIn(1500);


    //  Change Always receives the event phrase 
    socket.on('phrase', (phrase, index)=> {
        $("#phrase").html(phrase)
        indexesAlreadyUsed.push(index)
    })
    socket.on('win', () => {
        $("#phrase").html("Você Venceu!!!")
    })
});

let indexesAlreadyUsed = Array()

function submitAnswear(element) {

  answear = element.value
  element.value = ""
  
  socket.emit('answear', answear, indexesAlreadyUsed)
}

function keyPress(e) {
  var keynum;

  if (window.event) { // IE                  
    keynum = e.keyCode;
  } else if (e.which) { // Netscape/Firefox/Opera                 
    keynum = e.which;
  }

  if (keynum == 13) {   // 13 == enter
    let element = document.getElementById('field');
    submitAnswear(element)
  }
}


