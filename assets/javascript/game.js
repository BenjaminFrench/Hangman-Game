// Hangman game
//
// hangmanGame object holds the entire structure of the game and manages state changes.
//
// Keyup event triggers functions in the object to progress game state.

// globals
var song = new Audio();
// audio.play();

// function to print array contents with spaces and no commas
function printArray(array) {
    var output = "";
    for (var i=0; i<array.length; i++) {
        if (array[i] !== " ") { 
            output += array[i];
            output += " ";
        }
    }
    return output;
}

var hangmanGame = {
    wordList: ["Playing in the Band","The Other One","Sugar Magnolia","China Cat Sunflower","Truckin","Jack Straw","Mexicali Blues","Tennessee Jed","Deal","Bertha"],
    songlist: ["https://ia802307.us.archive.org/20/items/gd73-06-10.sbd.hollister.174.sbeok.shnf/gd73-06-10d2t02.mp3",
    "https://archive.org/download/gd77-10-02.sbd.unknown.278.sbeok.shnf/d3t6.mp3",
    "https://archive.org/download/gd73-06-10.sbd.hollister.174.sbeok.shnf/gd73-06-10d4t01.mp3",
    "https://archive.org/download/gd73-06-09.sbd.hollister.172.sbeok.shnf/gd73-06-09d2t07.mp3",
    "https://archive.org/download/gd73-06-09.sbd.hollister.172.sbeok.shnf/gd73-06-09d3t02.mp3",
    "https://archive.org/download/gd73-06-09.sbd.hollister.172.sbeok.shnf/gd73-06-09d1t05.mp3",
    "https://archive.org/download/gd73-02-09.sbd.allred.9888.sbeok.shnf/gd1973-02-09d1t11.mp3",
    "https://archive.org/download/gd73-06-09.sbd.hollister.172.sbeok.shnf/gd73-06-09d2t05.mp3",
    "https://archive.org/download/gd77-05-08.sbd.hicks.4982.sbeok.shnf/gd77-05-08eaton-d1t06.mp3",
    "https://archive.org/download/gd74-07-19.sbd.symons.12381.sbeok.shnf/gd74-07-19d1t03.mp3"],
    currentWord: '',
    lettersGuessedAlready: [],
    progress: [],
    guessesRemaining: 25,
    wins: 0,
    
    // Update the DOM with new values. This will be called at the end of most
    // of the other functions.
    updateDOM: function() {
        document.getElementById("wins-text").innerHTML = this.wins;
        document.getElementById("guesses-remaining-text").innerHTML = this.guessesRemaining;
        document.getElementById("guessed-already-text").innerHTML = printArray(this.lettersGuessedAlready);
        document.getElementById("progress-text").innerHTML = printArray(this.progress);
    },
    
    // Draw the keyboard that will show user what they have guessed.
    // This draws the keyboard with all characters unused.
    initKeyboard: function() {
        $("#keyboard-row-1").empty();
        $("#keyboard-row-2").empty();
        $("#keyboard-row-3").empty();
        var keyrow1 = [ "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P" ];
        var keyrow2 = [ "A", "S", "D", "F", "G", "H", "J", "K", "L" ];
        var keyrow3 = [ "Z", "X", "C", "V", "B", "N", "M" ];

        for (var i = 0; i < keyrow1.length; i++) {
            var letterBtn = $("<button>");
            letterBtn.addClass("letter-button btn btn-default");
            letterBtn.attr("data-letter", keyrow1[i]);
            letterBtn.text(keyrow1[i]);
            $("#keyboard-row-1").append(letterBtn);
        }
        for (var i = 0; i < keyrow2.length; i++) {
            var letterBtn = $("<button>");
            letterBtn.addClass("letter-button btn btn-default");
            letterBtn.attr("data-letter", keyrow2[i]);
            letterBtn.text(keyrow2[i]);
            $("#keyboard-row-2").append(letterBtn);
        }
        for (var i = 0; i < keyrow3.length; i++) {
            var letterBtn = $("<button>");
            letterBtn.addClass("letter-button btn btn-default");
            letterBtn.attr("data-letter", keyrow3[i]);
            letterBtn.text(keyrow3[i]);
            $("#keyboard-row-3").append(letterBtn);
        }
    },
    
    // Set a new word and continue game
    initWord: function(word) {
        this.currentWord = word;
        this.progress = [];
        // initialize progress with underscores
        for (var i=0; i < word.length; i++) {
            if (word[i] === " ") {
                this.progress.push("&nbsp");
            }
            else {
                this.progress.push("_");
            }
        }
        
        this.initKeyboard();
        this.updateDOM();
    },
    
    // Guess a letter and update the data
    guessLetter: function(letter) {
        // if letter is [a-z] and has not been guessed before
        if ((letter.match("^[a-z]$") != null) && !(this.lettersGuessedAlready.includes(letter))) {
            var currentWordLower = this.currentWord.toLowerCase();
            this.lettersGuessedAlready.push(letter);
            
            // Guess is correct
            // if guessed letter is in currentWord then reveal it
            if (currentWordLower.includes(letter)) {
                console.log("Current Word contains guessed letter!");
                // loop over current word. If letter matches guess, set appropriate index in progress string to letter
                for (var i = 0; i < currentWordLower.length; i++) {
                    if (currentWordLower[i] === letter)  {
                        this.progress[i] = this.currentWord[i];
                    }                  
                }

                // set the button on the keyboard display to danger bootstrap class
                var selector = '.letter-button[data-letter="' + letter.toUpperCase() + '"]';
                $(selector).addClass("btn-success");
            }
            
            // Wrong letter. Subtract 1 from guesses left
            else {
                var selector = '.letter-button[data-letter="' + letter.toUpperCase() + '"]';
                $(selector).addClass("btn-danger");
                this.guessesRemaining--;
                
            }
        }
        else {
            console.log("User pressed key that was not [a-z] or has already been guessed. Doing nothing...");
        }
        
    },
    
    // Check if the user has won
    checkForWin: function() {
        for (var i = 0; i < this.currentWord.length; i++) {
            if (this.progress[i] === "&nbsp") { 
            }
            else if (this.currentWord[i].toLowerCase() !== this.progress[i].toLowerCase()) {
                return false;
            }
        }
        console.log("You win!");
        this.wins++;
        alert("Congratulations you won!\nThe word was: " + hangmanGame.currentWord + "\nClick ok to continue playing");
        song.pause();
        return true;
    },
    
    // Check if the user has lost
    checkForLoss: function() {
        if (this.guessesRemaining < 1) {
            alert("You lose, game over!\nYou won " + this.wins + " times.\nThe word was: " + this.currentWord + "\nClick ok to start again");
            song.pause();
            return true;
        }
        else {
            return false;
        }
    }
    
};

// initialize the game on page load
window.onload = function() {
    // choose a random word from wordlist and initWord(word)
    console.log("Generating random word from wordlist...");
    var randomNumber = Math.floor(Math.random() * hangmanGame.wordList.length);
    var randomWord = hangmanGame.wordList[randomNumber];
    song.src = (hangmanGame.songlist[randomNumber]);
    song.play();console.log("Chose word: " + randomWord);
    
    hangmanGame.initWord(randomWord);
}

// onkeyup event drives the changing of game state
document.onkeyup = function(event) {
    var key = event.key;
    console.log("User pressed key: " + key);
    
    if (key === "1") {
        if (audio.paused) {
            console.log("Resuming music...");
            audio.play();
        }
        else {
            console.log("Pausing music...");
            audio.pause();
        }
    }
    
    hangmanGame.guessLetter(key);
    
    if (hangmanGame.checkForWin()) {
        // generate a new random word
        console.log("Generating random word from wordlist...");
        var randomNumber = Math.floor(Math.random() * hangmanGame.wordList.length);
        var randomWord = hangmanGame.wordList[randomNumber];
        song.src =(hangmanGame.songlist[randomNumber]);
        song.play();
        hangmanGame.initWord(randomWord);
        console.log("Chose word: " + randomWord);
        hangmanGame.lettersGuessedAlready = [];
        
    }
    if (hangmanGame.checkForLoss()) {
        // restart game
        console.log("Resetting game...");
        hangmanGame.wins = 0;
        hangmanGame.guessesRemaining = 25;
        console.log("Generating random word from wordlist...");
        var randomNumber = Math.floor(Math.random() * hangmanGame.wordList.length);
        var randomWord = hangmanGame.wordList[randomNumber];
        song.src = (hangmanGame.songlist[randomNumber]);
        song.play();hangmanGame.initWord(randomWord);
        console.log("Chose word: " + randomWord);
        hangmanGame.lettersGuessedAlready = [];
    }
    hangmanGame.updateDOM();
}