// Hangman game
//
// hangmanGame object holds the entire structure of the game and manages state changes.
//
// Keyup event triggers functions in the object to progress game state.

// globals
// var audio = new Audio("http://archive.org/download/gd73-06-10.sbd.hollister.174.sbeok.shnf/gd73-06-10d2t04.mp3");
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
    wordList: ["Playing in the Band","The Other One","Sugar Magnolia","China Cat Sunflower","Truckin","Jack Straw","Mexicali Blues","Tennessee Jed","Deal","Looks Like Rain","Bertha","Wharf Rat","Estimated Prophet","Eyes of the World","Sugaree","Brown Eyed Women","Loser","Black Peter","One More Saturday Night","Cassidy","Uncle John's Band","Stella Blue","He's Gone","US Blues","Ramble On Rose","Scarlet Begonias","Casey Jones","Friend of the Devil","Terrapin Station","Bird Song","Greatest Story Ever Told","Candyman","Let It Grow","Row Jimmy","Althea","I Need A Miracle","Throwing Stones","Mississippi Half-Step","The Wheel","Fire on the Mountain","Dire Wolf","Music Never Stopped","Dark Star","Cumberland Blues","They Love Each Other","Ship of Fools","Saint of Circumstance","Franklin's Tower","Hell in a Bucket","Brokedown Palace","Touch of Grey","Feel Like a Stranger","St Stephen","Shakedown Street","Box of Rain","It Must Have Been The Roses","Black Throated Wind","Stagger Lee","Lost Sailor","Crazy Fingers","Alabama Getaway","West LA Fadeaway","Cryptical Envelopment","High Time","Supplication","China Doll","Might As Well","Lazy Lightning","Slipknot","Help on the Way","My Brother Esau","Passenger","The Eleven","Loose Lucy","Victim or the Crime","Foolish Heart","Dupree's Diamond Blues","Corrina","Picasso Moon","Standing on the Moon","Black Muddy River","Comes A Time","Here Comes Sunshine","Lazy River Road","Alligator","To Lay Me Down","When Push Comes to Shove","Keep Your Day Job","New Speedway Boogie","So Many Roads","Caution","Weather Report Suite","Attics of My Life","Mr. Charlie","Easy Wind","Days Between","Cosmic Charlie","Ripple","Doin' That Rag","Sunrise","Chinatown Shuffle","New Potato Caboose","Built to Last","Mason's Children","Wave That Flag","Two Souls in Communion","Mountains of the Moon","Unbroken Chain","Born Cross-Eyed","Cream Puff War","Let Me Sing Your Blues Away","Clementine","King Solomon's Marbles","Mission in the Rain","Till the Morning Comes","Operator","Reuben and Cherise","Blues for Allah","Golden Road","Sage & Spirit","Rosemary"],
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
        
        this.updateDOM();
    },
    
    // Guess a letter and update the data
    guessLetter: function(letter) {
        // if letter is [a-z] and has not been guessed before
        if ((letter.match("^[a-z]$") != null) && !(this.lettersGuessedAlready.includes(letter))) {
            var currentWordLower = this.currentWord.toLowerCase();
            this.lettersGuessedAlready.push(letter);
            
            // if guessed letter is in currentWord then reveal it
            if (currentWordLower.includes(letter)) {
                console.log("Current Word contains guessed letter!");
                // loop over current word. If letter matches guess, set appropriate index in progress string to letter
                for (var i = 0; i < currentWordLower.length; i++) {
                    if (currentWordLower[i] === letter)  {
                        this.progress[i] = letter;
                    }                  
                }
            }
            
            // otherwise subtract 1 from guesses left
            else {
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
            else if (this.currentWord[i].toLowerCase() !== this.progress[i]) {
                return false;
            }
        }
        console.log("You win!");
        this.wins++;
        return true;
    },
    
    // Check if the user has lost
    checkForLoss: function() {
        
    }
    
};

// initialize the game on page load
window.onload = function() {
    // choose a random word from wordlist and initWord(word)
    console.log("Generating random word from wordlist...");
    var randomWord = hangmanGame.wordList[Math.floor(Math.random() * hangmanGame.wordList.length)];
    console.log("Chose word: " + randomWord);
    
    hangmanGame.initWord(randomWord);
}

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
        var randomWord = hangmanGame.wordList[Math.floor(Math.random() * hangmanGame.wordList.length)];
        hangmanGame.initWord(randomWord);
        console.log("Chose word: " + randomWord);
        hangmanGame.lettersGuessedAlready = [];
    
    }
    hangmanGame.checkForLoss();
    hangmanGame.updateDOM();
}