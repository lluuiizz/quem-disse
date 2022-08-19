function submitAnswear(element) {

  alert(element.value)
  element.value = ""
  answear = element.value

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

