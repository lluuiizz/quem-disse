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
//////////////////////////////////////////////////

//	Handle files (Text files from /phrases)
const fs = require('fs')

function directoryFiles(dirPath) {
	return fs.readdirSync(dirPath)
}

function getSomeRandomPhraseInCategorie(categorie) {
	let categoriePath = path.join(__dirname, 'phrases/'+categorie+'/')
	let phraseIndex = pickRandomIndex(directoryFiles(categoriePath).length, 1)
	const contents = fs.readFileSync(categoriePath + phraseIndex.toString() + '.txt', 'utf-8').split('\n')
	const length = contents.length
	return {
		phrase : contents.slice(0, length - 2),
		correctAnswear: contents[length - 2],
		index: phraseIndex,
		categorie: categorie
	}
}

function getSomeCategorie() {
	let categorie = categoriesOfPhrases[pickRandomIndex(amountOfCategories, 0)]
	let amount = directoryFiles(path.join(__dirname, 'phrases/'+categorie+'/')).length
	return {
		categorie: categorie,
		amountInCategorie: amount 
	}
}

function pickRandomIndex(range, initValue) {
	return generated = Math.floor(Math.random() * range + initValue)
}

function findClientInClientsList(clientId) {
	return clients.findIndex(i => i.id === clientId)
}
/////////////////////////////////////////////////


//	Clients array and client object
var clients = Array()

const client = (id) => {
    return {
        id : id,
        lifePoints : 5,
		correctAnswears: 0
    }
}
/////////////////////////////////////////////////////////////

//	Start server
http.listen(3000, function() {
	console.log('Listening port 3000')
});
/////////////////////////////////////////////////////////////

//	Constants of categorie
const categoriesOfPhrases = directoryFiles(path.join(__dirname, 'phrases'))	//	Count the amount of categories in phrases directory
const amountOfCategories = categoriesOfPhrases.length
console.log(categoriesOfPhrases)
/////////////////////////////////////////////////////////////


io.on('connection', socket => {
	console.log("New connection", socket.id)

	let categorieChoosed = getSomeCategorie()
	let phraseObject = getSomeRandomPhraseInCategorie(categorieChoosed.categorie)

	socket.on('answear', (answear, indexesAlreadyUsed) => {
		var hasSameValue = answear == phraseObject.correctAnswear
		console.log(phraseObject)

		if (hasSameValue) {

			if (clients[findClientInClientsList(socket.id)].correctAnswears == 50) {
			socket.emit("win")
			}

			else if (categorieChoosed.amountInCategorie > indexesAlreadyUsed.length && indexesAlreadyUsed.length <= 10) {
				while (indexesAlreadyUsed.indexOf(phraseObject.index) != -1) {
					phraseObject = getSomeRandomPhraseInCategorie(categorieChoosed.categorie)
				}
				clients[findClientInClientsList(socket.id)].correctAnswears += 1
				socket.emit("phrase", phraseObject.phrase, phraseObject.index)	//	Emit next phrase
			}
			else {
				categorieChoosed = getSomeCategorie()
				phraseObject = getSomeRandomPhraseInCategorie(categorieChoosed.categorie)
				socket.emit("clearIndexArray")
				socket.emit("phrase", phraseObject.phrase, phraseObject.index)	//	Emit next phrase
			}

		}
		else {
			//	Get the index in the array of the id received, decrease lifePoints and emit the event
			let indexIdInArray = findClientInClientsList(socket.id)
			clients[indexIdInArray].lifePoints -= 1
			socket.emit("changeLifePoints", clients[indexIdInArray].lifePoints)
			if (clients[indexIdInArray].lifePoints == 0) {socket.emit("lose")}
		}
	})
		//	Instantiates an new element in the lifePoints array and emit the first phrase
	clients.push(client(socket.id))
    socket.emit("initLifePoints", 5)
	socket.emit("phrase", phraseObject.phrase, phraseObject.index);
})