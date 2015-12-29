var users = {};
var words = [];
var round;
var scores = [];
var currentTurnTeam;
var wordsPerPlayer = 5;

var getGame = function() {
	var game = {};
	game.round = round;
	game.currentTurnTeam = currentTurnTeam + 1;
	game.team1Score = scores[0];
	game.team2Score = scores[1];
	game.over = false;
	var wordCount = 0;
	words.forEach(function(word) {
		if(!word.isSeen) {
			wordCount++;
		}
	});
	game.wordsRemaining = wordCount;
	return game;
}

var getUser = function(user) {
	user = users[user];
	console.log("returning user " + user);
	return user;
}

var getAllUserNames = function() {
	var userArray = [];
	for(var user in users) {
	    if(users.hasOwnProperty(user)){
	        userArray.push(users[user].user);
	    }
	}
	return userArray;
}

var resetGame = function() {
	users = {};
	words = [];
	round = 0;
	scores = [];
	currentTurnTeam = 0;	
}

var addNewUser = function(user) {
	if(users[user]) {
		console.log("user " + user + " already existed");
		return false;
	} else {
		users[user] = {};
		users[user].user = user;
		users[user].words = [];
		users[user].remaining = wordsPerPlayer - users[user].words.length;
		console.log("created new user " + users[user]);
		return users[user];
	}
}

var addWord = function(user, word) {
	if(!users[user]) {
		console.log("could not find user with name " + user);
		return false;
	}

	if(users[user].words.length == wordsPerPlayer) {
		console.log("user already added max number of words");
		return false;
	}

	users[user].words.push(word);
	users[user].remaining = wordsPerPlayer - users[user].words.length;
	console.log("added word " + word + " to user " + user + ". Current words: " + users[user].words);
	return users[user];
}

var startGame = function() {
	console.log("starting the game");
	for(var user in users) {
	    if(users.hasOwnProperty(user)){
	        users[user].words.forEach(function(word) {
	        	console.log("adding word " + word);
	        	words.push({word: word, isSeen: false});
	        });
	    }
	}	
	round = 1;
	scores.push({team: 0, score: 0});
	scores.push({team: 1, score: 0});
	currentTurnTeam = 0;

	shuffleWords();
}

var shuffleWords = function() {
	console.log("shuffling words");
	var currentIndex = words.length, temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = words[currentIndex];
		words[currentIndex] = words[randomIndex];
		words[randomIndex] = temporaryValue;
	}
}

//word was answered successfully, award a point
var correctWord = function(word) {
	return markWordAsSeen(word, true);
}

//the word giver flubbed and the word is done, but no point should be awarded
var wordScrewup = function(word) {
	return markWordAsSeen(word, false);
}

//mark the word as seen and (possibly) increment the score
var markWordAsSeen = function(word, awardPoint) {
	console.log("marking word " + word + " as seen and awarding point? " + awardPoint);
	var markedWord = false;
	words.forEach(function(wordObject) {
		//haven't marked a word yet, and the name matches, AND the match hasn't been seen (for dupe reasons)
		if(!markedWord && word == wordObject.word && wordObject.isSeen == false) {
			console.log("found the word to mark");
			wordObject.isSeen = true;

			if(awardPoint) {
				console.log("awarding the point");
				scores[currentTurnTeam].score++;
			}

			markedWord = true;
		}
	});
}

//get another word
var retrieveNewWord = function() {
	//find an unseen word
	var i = 0;
	while(i < words.length && words[i].isSeen == true) {
		i++;
	}

	if(i == words.length) {
		console.log("no word to return");
		return undefined;
	} else {
		console.log("returning word " + words[i].word);
		return words[i].word;
	}
}

//end the round, return true if the game is over, false otherwise
var endRound = function() {
	round++;

	if(round > 3) {
		//game is over!
		var game = getGame();
		game.over = true;
		return game;
	} else {
		//mark all words as unseen
		words.forEach(function(word) {
			word.isSeen = false;
		});
		shuffleWords();
		return getGame();
	}
}

var endTurn = function() {
	shuffleWords();

	if(currentTurnTeam == 1) {
		currentTurnTeam = 0;
	} else {
		currentTurnTeam = 1;
	}

	return getGame();
}

module.exports = {
	addNewUser : addNewUser,
	addWord : addWord,
	startGame : startGame,
	correctWord : correctWord,
	wordScrewup : wordScrewup,
	retrieveNewWord :retrieveNewWord,
	endRound : endRound,
	endTurn : endTurn,
	resetGame : resetGame,
	getUser : getUser,
	getAllUserNames : getAllUserNames,
	getGame : getGame
};

// addWord("ari", "brad pitt");
// addWord("ari", "john smith");
// addWord("lindsay", "john smith");

// startGame();

// nextWord = retrieveNewWord()
// while() {

// }

// var nextWord = retrieveNewWord()
// console.log("Next word: " + nextWord);
// correctWord(nextWord);

// nextWord = retrieveNewWord();
// console.log("Next word: " + nextWord);

// endTurn();
// console.log(scores);

// nextWord = retrieveNewWord();
// console.log("Next word: " + nextWord);
// wordScrewup(nextWord);

// nextWord = retrieveNewWord();
// console.log("Next word: " + nextWord);
// correctWord(nextWord);

// nextWord = retrieveNewWord();
// console.log("Next word: " + nextWord);

// console.log(scores);