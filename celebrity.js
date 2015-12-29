var users = {};
var words = [];
var round;
var scores = [];
var currenTurnTeam;


var addNewUser = function(user) {
	users[user] = {};
	users[user].words = [];
}

var addWord = function(user, word) {
	if(!users[user]) {
		addNewUser(user);
	}
	users[user].words.push(word);
}

var startGame = function() {
	for(var user in users) {
	    if(users.hasOwnProperty(user)){
	        users[user].words.forEach(function(word) {
	        	words.push({word: word, isSeen: false});
	        });
	    }
	}	
	round = 1;
	scores.push({team: 0, score: 0});
	scores.push({team: 1, score: 0});
	currenTurnTeam = 0;

	shuffleWords();
}

var shuffleWords = function() {
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
	var markedWord = false;
	words.forEach(function(wordObject) {
		//haven't marked a word yet, and the name matches, AND the match hasn't been seen (for dupe reasons)
		if(!markedWord && word == wordObject.word && wordObject.isSeen == false) {
			wordObject.isSeen = true;

			if(awardPoint) {
				scores[currenTurnTeam].score++;
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
		return undefined;
	} else {
		return words[i].word;
	}
}

//end the round, return true if the game is over, false otherwise
var endRound = function() {
	round++;

	if(round > 3) {
		//game is over!
		return true;
	} else {
		//mark all words as unseen
		for(var wordObject in words) {
			wordObject.isSeen = false;
		}
		return false;
	}
}

var endTurn = function() {
	shuffleWords();

	if(currenTurnTeam == 1) {
		currenTurnTeam = 0;
	} else {
		currenTurnTeam = 1;
	}
}

module.export = {
	addNewUser : addNewUser,
	addWord : addWord,
	startGame : startGame,
	correctWord : correctWord,
	wordScrewup : wordScrewup,
	retrieveNewWord :retrieveNewWord,
	endRound : endRound,
	endTurn : endTurn
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