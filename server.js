const app = require('express')()
const express = require('express')
const http = require('http').createServer(app)
const path = require('path')
const io = require('socket.io')(http)

//	Send Files to server

function sendFileToServer (serverPath, localPath) {
	app.get(serverPath, (req, res) => {
		res.sendFile(__dirname + localPath)
	})
}
var srcPath = path.join(__dirname, 'src')
app.use(express.static(srcPath))

//	Handle files (Text files from /phrases)
const fs = require('fs')
const dir = './phrases'

function directoryFiles(dirPath) {
	return fs.readdirSync(dirPath)
}

function getSomePhrase(dirPath, index) {
	const contents = fs.readFileSync(dirPath + index.toString() + '.txt', 'utf-8').split('\n')
	return contents;
}


function pickRandomIndex(range) {
	return generated = Math.floor(Math.random() * range)
}

//	Array with the lifePoints of every player online accessed by id
var lifePointsHolder = Array()
const newLifePoint = (id) => {
    return {
        id : id,
        lifePoints : 5,
		correctAnswears: 0
    }
}

http.listen(3000, function() {
	console.log('Listening port 3000')
});

const categoriesOfPhrases = directoryFiles(path.join(__dirname, 'phrases'))	//	Count the amount of categories in phrases directory
const amountOfCategories = categoriesOfPhrases.length
console.log(categoriesOfPhrases)

io.on('connection', socket => {
	console.log("New connection", socket.id)

	let getRandomCategorieIndex = pickRandomIndex(amountOfCategories)
	let categorieChoosed = categoriesOfPhrases[getRandomCategorieIndex]
	console.log(categorieChoosed)

	socket.on('answear', (answear, indexesAlreadyUsed) => {
		var hasSameValue = answear == phraseInfo[phraseInfo.length - 2]

		if (hasSameValue) {
			if (indexesAlreadyUsed.length < dirLength(dir)) {

				while (indexesAlreadyUsed.indexOf(indexPhrase) != -1) {
					indexPhrase = pickRandomPhraseIndex()
				}

				phraseInfo = getSomePhrase(indexPhrase)
				phrase = phraseInfo.slice(0, phraseInfo.length - 2)	//	Get new phrase 
				//socket.emit("phrase", phrase, indexPhrase)	//	Emit next phrase
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
		//socket.emit("phrase", phraseInfo.slice(0, phraseInfo.length - 2), indexPhrase);
})