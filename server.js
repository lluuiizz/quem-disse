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

function getSomeCategory() {
	let category = categorysOfPhrases[pickRandomIndex(amountOfCategorys, 0)]
	let amount = directoryFiles(path.join(__dirname, 'phrases/'+category+'/')).length
	return {
		category: category,
		amountInCategory: amount
	}
}


function getPhraseObject() {
		let category = getSomeCategory()
		let phrase = getSomePhraseByCategory(category.category)

		return {...category, ...phrase}

}
function pickRandomIndex(range, initValue) {
	return generated = Math.floor(Math.random() * range + initValue)
}

function findClient(clientId) {
	return clients.findIndex(i => i.id === clientId)
}
/////////////////////////////////////////////////


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
/////////////////////////////////////////////////////////////

//	Start server
http.listen(3000, function() {
	console.log('Listening port 3000')
});
/////////////////////////////////////////////////////////////

//	Constants of category
const categorysOfPhrases = directoryFiles(path.join(__dirname, 'phrases'))	//	Count the amount of categorys in phrases directory
const amountOfCategorys = categorysOfPhrases.length
console.log(categorysOfPhrases)
/////////////////////////////////////////////////////////////


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

	socket.on('answear', (answear, indexesAlreadyUsed) => {
		console.log(`\n\nNew answear: ${answear}\nIndexesUsed: ${indexesAlreadyUsed}\nClient id: ${socket.id}`)
	/*	var hasSameValue = answear == phraseObject.correctAnswear
		console.log(phraseObject)

		if (hasSameValue) {

			if (clients[findClientInClientsList(id)].correctAnswears == 50) {
			socket.emit("win")
			}

			else if (categoryChoosed.amountInCategory > indexesAlreadyUsed.length && indexesAlreadyUsed.length <= 10) {
				while (indexesAlreadyUsed.indexOf(phraseObject.index) != -1) {
					phraseObject = getSomeRandomPhraseInCategory(categoryChoosed.category)
				}
				clients[findClientInClientsList(id)].correctAnswears += 1
				socket.emit("phrase", phraseObject.phrase, phraseObject.index)	//	Emit next phrase
			}
			else {
				categoryChoosed = getSomeCategory()
				phraseObject = getSomeRandomPhraseInCategory(categoryChoosed.category)
				socket.emit("clearIndexArray")
				socket.emit("phrase", phraseObject.phrase, phraseObject.index)	//	Emit next phrase
			}

		}
		else {
			//	Get the index in the array of the id received, decrease lifePoints and emit the event
			let indexIdInArray = findClientInClientsList(id)
			clients[indexIdInArray].lifePoints -= 1
			socket.emit("changeLifePoints", clients[indexIdInArray].lifePoints)
			if (clients[indexIdInArray].lifePoints == 0) {socket.emit("lose")}
		}*/
	})
})


