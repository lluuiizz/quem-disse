const app = require('express')()
const express = require('express')
const http = require('http').createServer(app)
const path = require('path')
const io = require('socket.io')(http)
const fs = require('fs')

//	Clients array and client object
var clients = Array()

const client = (id) => {
    return {
        id : id,
        lifePoints : 5,
				correctAnswears: 0,
				currentPhrase : getPhraseObject()
    }
}

//	Start server
http.listen(3000, function() {
	console.log('Listening port 3000')
});

//	Constants of category
const categorysOfPhrases = directoryFiles(path.join(__dirname, 'phrases'))	//	Count the amount of categorys in phrases directory
const amountOfCategorys = categorysOfPhrases.length

io.on('connection', socket => {
	console.log("New connection", socket.id)

		//	Instantiates an new element in the lifePoints array and emit the first phrase
	clients.push(client(socket.id))
	newClientIndex = clients.length - 1

  socket.emit("initLifePoints", 5)
	socket.emit("phrase", clients[newClientIndex].currentPhrase.phrase, clients[newClientIndex].currentPhrase.index);

	socket.on('disconnect', () => {
		clients.splice(findClient(socket.id))
		console.log(`Player ${socket.id} disconnect`)
	})

	socket.on('answear', (answear) => {
		let client = clients[findClient(socket.id)]

		switch (answear) {
			case client.currentPhrase.correctAnswear:
				console.log("To do")
			break;

			default:
				wrongAnswear(client, socket)
		}
	})
})

//	Send Files to server
function directoryFiles(dirPath) {
	return fs.readdirSync(dirPath)
}

function pickRandomIndex(range, initValue) {
	return generated = Math.floor(Math.random() * range + initValue)
}

function sendFileToServer (serverPath, localPath) {
	app.get(serverPath, (req, res) => {
		res.sendFile(__dirname + localPath)
	})
}
var srcPath = path.join(__dirname, 'src')
app.use(express.static(srcPath))
//////////////////////////////////////////////////


function getSomeCategory() {
	let category = categorysOfPhrases[pickRandomIndex(amountOfCategorys, 0)]
	let amount = directoryFiles(path.join(__dirname, 'phrases/'+category+'/')).length
	return {
		category: category,
		amountInCategory: amount
	}
}


function getSomePhraseByCategory(category) {
	let categoryPath = path.join(__dirname, 'phrases/'+category+'/')
	let phraseIndex = pickRandomIndex(directoryFiles(categoryPath).length, 1)
	const contents = fs.readFileSync(categoryPath + phraseIndex.toString() + '.txt', 'utf-8').split('\n')
	const length = contents.length
	return {
		phrase : contents.slice(0, length - 2),
		correctAnswear: contents[length - 2],
		index: phraseIndex,
	}
}


function getPhraseObject() {
		let category = getSomeCategory()
		let phrase = getSomePhraseByCategory(category.category)

		return {...category, ...phrase}

}

//	Client Related Functions
function findClient(clientId) {
	return clients.findIndex(i => i.id === clientId)
}

function wrongAnswear(client, socket) {
	client.lifePoints--
	socket.emit('changeLifePoints', client.lifePoints)
}
