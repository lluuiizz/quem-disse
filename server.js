const app = require('express')()
const express = require('express')
const http = require('http').createServer(app)
const path = require('path')
const io = require('socket.io')(http)
const fs = require('fs')

//	Send files from src to server
var srcPath = path.join(__dirname, 'src')
app.use(express.static(srcPath))

//	Clients array and client object
var clients = Array()

const client = (id) => {
    return {
			id : id,
			lifePoints : 5,
			correctAnswears: 0,
			currentPhraseObject : getPhraseObject(-1, [], []),
			answearedIndexesInCategory: [],
			categoryExcepcions : []
    }
}

const ANSWEARS_TO_WIN = 20
//	Start server
http.listen(3000, function() {
	console.log('Listening port 3000')
});

//	Constants of category
const categorysOfPhrases = directoryFiles(path.join(__dirname, 'phrases'))	//	Count the amount of categorys in phrases directory
const amountOfCategorys = categorysOfPhrases.length

io.on('connection', socket => {
	console.log("New connection", socket.id)

	createNewClient(socket)

	socket.on('disconnect', () => {
		clients.splice(findClient(socket.id))
		console.log(`Player ${socket.id} disconnect`)
	})

	socket.on('answear', (answear) => {
		let client = clients[findClient(socket.id)]

		console.log(`Answear: ${answear}`)

		switch (answear) {
			case client.currentPhraseObject.correctAnswear:
				correctAnswear(client, socket)
				socket.emit("changeScore", client.correctAnswears, ANSWEARS_TO_WIN)

			break;

			default:
				wrongAnswear(client, socket)
		}
	})
})

function directoryFiles(dirPath) {
	return fs.readdirSync(dirPath)
}

function pickRandomIndex(range, initValue) {
	return generated = Math.floor(Math.random() * range + initValue)
}

//	Client Related Functions
function createNewClient(socket) {
	//	Instantiates an new element in the lifePoints array and emit the first phrase
	clients.push(client(socket.id))
	newClientIndex = clients.length - 1

	let newClient = clients[newClientIndex]

  socket.emit("initLifePoints", 5)
	socket.emit("phrase", newClient.currentPhraseObject.phrase, newClient.currentPhraseObject.category)

	socket.emit("changeAnswearsButtons", getAnswearOptionsToPhrase(newClient.currentPhraseObject.correctAnswear, newClient.currentPhraseObject.category))

	socket.emit("changeScore", newClient.correctAnswears, ANSWEARS_TO_WIN)

}

function findClient(clientId) {
	return clients.findIndex(i => i.id === clientId)
}


//////////////////////////////////////////////////


function getRandomCategoryObject(categoryExcpecions) {
	do {
		var category = categorysOfPhrases[pickRandomIndex(amountOfCategorys, 0)]
	}	while(categoryExcpecions.indexOf(category) != -1)

	let amount = directoryFiles(path.join(__dirname, 'phrases/'+category+'/')).length
	return {
		category: category,
		amountInCategory: amount
	}
}


function getSomePhraseByCategory(category, cantBeIndexes) {
	let categoryPath = path.join(__dirname, 'phrases/'+category+'/')
	console.log(`CATEGORY: ${category}`)
	do {
		var phraseIndex = pickRandomIndex(directoryFiles(categoryPath).length, 1)

	} while(cantBeIndexes.indexOf(phraseIndex) != -1 ); 

	const contents = fs.readFileSync(categoryPath + phraseIndex.toString() + '.txt', 'utf-8').split('\n')
	const length = contents.length
	return {
		phrase : contents.slice(0, length - 2),
		correctAnswear: contents[length - 2],
		index: phraseIndex,
	}
}


function getPhraseObject(optionalCategory, optionalIndexes, categoryExcepcions) {
		if (optionalCategory == -1) {
			var category = getRandomCategoryObject(categoryExcepcions)
		}
		else {
			var category = optionalCategory
			console.log(category)
		}
		let phrase = getSomePhraseByCategory(category.category, optionalIndexes)

		return {...category, ...phrase}

}

function getAnswearOptionsToPhrase(correct, category) {
	let answears = Array()

	answears.push(correct)


	for (i = 0; i <  3; i++) {
		do {
				var phraseGet = getSomePhraseByCategory(category, [])
		} while(answears.indexOf(phraseGet.correctAnswear) != -1);

		answears.push(phraseGet.correctAnswear)
	}

	let randomIndex = pickRandomIndex(4, 0)
	let temp = answears[randomIndex]
	answears[randomIndex] = answears[0]
	answears[0] = temp

	return shuffleArray(answears)
}

function shuffleArray(array) {
	for (i = array.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * i + 1)
		let temp = array[i]
		array[i] = array[j]
		array[j] = temp
	}

	return array
}

function nextPhrase(client) {
	alreadyAnsweared = client.answearedIndexesInCategory
	amountOfPhrasesInCategory = client.currentPhraseObject.amountInCategory
	alreadyAnsweared.push(client.currentPhraseObject.index)

	if (amountOfPhrasesInCategory > alreadyAnsweared.length && alreadyAnsweared.length <= 10 ) {
		phraseObject = client.currentPhraseObject
		categoryObject = {
			category: phraseObject.category,
			amountInCategory: phraseObject.amountInCategory
		}

		phraseObject = getPhraseObject(categoryObject, alreadyAnsweared, [])
		client.currentPhraseObject = phraseObject
	} else {
		alreadyAnsweared.length = 0
		excepcions = client.categoryExcepcions
		excepcions.push(client.currentPhraseObject.category)
		phraseObject = client.currentPhraseObject
		phraseObject = getPhraseObject(-1, alreadyAnsweared, excepcions)
		client.currentPhraseObject = phraseObject
	}

}


function wrongAnswear(client, socket) {
	client.lifePoints--
	socket.emit('changeLifePoints', client.lifePoints)

	if (client.lifePoints == 0) {socket.emit('lose')}
	else {
		nextPhrase(client);
		socket.emit('phrase', client.currentPhraseObject.phrase, client.currentPhraseObject.category);
		let options = getAnswearOptionsToPhrase(client.currentPhraseObject.correctAnswear, client.currentPhraseObject.category)
		socket.emit("changeAnswearsButtons", options)
	}
}

function correctAnswear(client, socket) {
	client.correctAnswears++
	socket.emit("changeScore", client.correctAnswears, ANSWEARS_TO_WIN)

	if (client.correctAnswears == ANSWEARS_TO_WIN)	{
		socket.emit("win")
	}
	else {
		nextPhrase(client);
		socket.emit('phrase', client.currentPhraseObject.phrase, client.currentPhraseObject.category);

		let options = getAnswearOptionsToPhrase(client.currentPhraseObject.correctAnswear, client.currentPhraseObject.category)
		socket.emit("changeAnswearsButtons", options)
	}
}

