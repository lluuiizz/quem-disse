const app = require('express')()
const http = require('http').createServer(app)
const path = require('path')
const io = require('socket.io')(http)

//	Send Files to server

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html')
});

app.get('/images/hearth.png', (req, res) => {
		res.sendFile(__dirname + '/images/hearth.png')
})

app.get('/images/favicon.ico', (req, res) => {
		res.sendFile(__dirname + '/images/favicon.ico')
})

app.get('/client.js', function(req, res) {
	res.setHeader('Content-Type', 'application/javascript')
	res.sendFile(__dirname + '/client.js')
})

app.get('/style.css', function(req, res) {
	res.sendFile(__dirname + '/style.css')
})

app.get('/font/typewriter.woff', function(req, res) {
	res.sendFile(__dirname + '/font/tt2020base-regular-webfont.woff')
})

//	Handle files (Text files from /phrases)
const fs = require('fs')
const dir = './phrases'

function dirLength(dir) {
	return fs.readdirSync(dir).length - 2
}

function getSomePhrase(index) {
	const contents = fs.readFileSync('./phrases/' + index.toString() + '.txt', 'utf-8').split('\n')
	return contents;
}


function pickRandomPhraseIndex() {
	return generated = Math.floor(Math.random() * dirLength(dir))
}

//	Array with the lifePoints of every player online accessed by id
var lifePointsHolder = Array()
const newLifePoint = (id) => {
    return {
        id : id,
        lifePoints : 5
    }
}

io.on('connection', socket => {
	console.log("New connection", socket.id)

	let indexPhrase = pickRandomPhraseIndex()
	let phraseInfo = getSomePhrase(indexPhrase)

	socket.on('answear', (answear, indexesAlreadyUsed) => {
		var hasSameValue = answear == phraseInfo[phraseInfo.length - 2]

		if (hasSameValue) {
			if (indexesAlreadyUsed.length < dirLength(dir)) {

				while (indexesAlreadyUsed.indexOf(indexPhrase) != -1) {
					indexPhrase = pickRandomPhraseIndex()
				}

				phraseInfo = getSomePhrase(indexPhrase)
				phrase = phraseInfo.slice(0, phraseInfo.length - 2)	//	Get new phrase 
				socket.emit("phrase", phrase, indexPhrase)	//	Emit next phrase
			}
			else {
				socket.emit("win")
			}
		}
		else {
			//	Get the index in the array of the id received, decrease lifePoints and emit the event
			let indexIdInArray = lifePointsHolder.findIndex(i => i.id === socket.id)
			lifePointsHolder[indexIdInArray].lifePoints -= 1
			socket.emit("changeLifePoints", lifePointsHolder[indexIdInArray].lifePoints)
			if (lifePointsHolder[indexIdInArray].lifePoints == 0) {socket.emit("lose")}
		}
	})
		//	Instantiates an new element in the lifePoints array and emit the first phrase
		lifePointsHolder.push(newLifePoint(socket.id))
    socket.emit("initLifePoints", 5)
		socket.emit("phrase", phraseInfo.slice(0, phraseInfo.length - 2), indexPhrase);
})

http.listen(3000, function() {
	console.log('Listening port 3000')
});


