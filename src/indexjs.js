function howtoplaypage() {
    $(document).ready(function () {
        $("#login").fadeOut(1000);
        $("body").prepend("<p>Acerte o personagem ou pessoa de um livro, filme, série ou vida real que disse a frase.</br>Ganha caso acerte vinte vezes antes de perder todas as vidas (cinco no total). Divirta-se!</p>")
        $("p").hide()
        $("body").prepend("<button type='button' class='btn btn-outline-light' id='return-mainpage' onclick='mainpage()'>Retornar</button>")
        $("#return-mainpage").hide()
        $("head").prepend("<style id='how-page-css'>p {position: absolute; left: 50%; top: 35%; transform: translate(-50%, -50%); color: white;} #return-mainpage {position: absolute; left: 50%; top: 45%; transform: translate(-50%, -50%);} @media (max-width:999px){p {top:45%; text-align:center;} #return-mainpage {top:62.5%;}}</style>")
        $("p").fadeIn(2000)
        $("#return-mainpage").fadeIn(2000)
    })
}

function mainpage() {
    $(document).ready(function () {
        $("p").fadeOut(1000)
        $("#return-mainpage").fadeOut(1000)
        $("p").remove()
        $("#return-mainpage").remove()
        $("#how-page-css").remove()
        $("form").fadeIn(2000)


    })
}


