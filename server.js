const app = require('express')()
const http = require('http').createServer(app)

const io = require('socket.io')(http)


app.get('/', (req, res) => {
    res.sendFile(__dirname+'/index.html')
});

app.get('/client.js', function(req, res) {
    res.setHeader('Content-Type', 'application/javascript')
    res.sendFile(__dirname + '/client.js')
})

app.get('/style.css', function(req, res) {
    res.sendFile(__dirname +'/style.css')
})

app.get('/font/typewriter.woff', function(req, res) {
    res.sendFile(__dirname +'/font/tt2020base-regular-webfont.woff')
})
const fs = require('fs')
const dir = './phrases'

function dirLength(dir) {
   return fs.readdirSync(dir).length 
}

function getSomePhrase(index) {
    const contents = fs.readFileSync('./phrases/'+index.toString()+'.txt', 'utf-8').split('\n')
    return contents; 
}

function pickRandomPhraseIndex() {
    return generated = Math.floor(Math.random() * dirLength(dir))
}



io.on('connection', socket => {
    console.log("New connection", socket.id)
    
    let indexPhrase = pickRandomPhraseIndex()
    let phraseInfo = getSomePhrase(indexPhrase)
    
    socket.on('answear', (answear, indexesAlreadyUsed)=> {
        if (answear == phraseInfo[1]) {
            if (indexesAlreadyUsed.length < dirLength(dir)) {
                while (indexesAlreadyUsed.indexOf(indexPhrase) != -1) {
                    indexPhrase = pickRandomPhraseIndex()
                }
                phraseInfo = getSomePhrase(indexPhrase)
                socket.emit("phrase", phraseInfo[0], indexPhrase)
            }
            else {
                socket.emit("win")
            }
        }
    })
    
    socket.emit("phrase", phraseInfo[0], indexPhrase);
})

http.listen(3000, function() {
    console.log('Listening port 3000')
});


