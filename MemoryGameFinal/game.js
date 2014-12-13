var ROWS = 4;
var COLUMNS = 6;

var FLAGS = [
  "pk", "af", "bt", "ca",
  "de", "ge", "im", "in",
  "jp", "uk", "us", "za"
];

window.ondragstart = function () { return false; }//prevent pic drag

function gameStart() {
    var tiles = createTiles();
    bindClick(tiles);
    startTimer(2, 60);
}

function bindClick(tiles) {
    var selected = null;

    // Loop over all tiles;
    tiles.forEach(function (tile) {
        var id = tile.id;
        var el = tile.el;
        el.onclick = function () { // onclick is a primitive version of addEventListener

            if (!selected) { // no tile has been selected before
                selected = tile;
                setImg(el, id);
                return;
            }

            if (tile === selected) return; // same tile has been selected again

            var current = selected; // make a copy reference

            if (current.id === id) { // there is a match
                increaseScore(1);
                current.el.onclick = null;
                el.onclick = null;
                correct.load();
                correct.play();
            } else { // it isn't a match
                increaseScore(2);
                setTimeout(function () { // revert tiles after half second
                    setDefaultImg(current.el);
                    setDefaultImg(el);
                    incorrect.load();
                    incorrect.play();
                }, 500);
            }
            setImg(el, id);
            selected = null;
        }
    });
}

function createTiles() {
    var tiles = [];
    var flags = FLAGS.concat(FLAGS); // duplicate flags
    var board = document.getElementById("imageholder");

    for (var i = 0; i < ROWS; i++) {
        var el = document.createElement("div");
        el.className = "row";

        for (var j = 0; j < COLUMNS; j++) {
            var rnd = Math.floor(Math.random() * flags.length);
            var name = flags.splice(rnd, 1)[0];
            var img = document.createElement("img");
            setDefaultImg(img);
            el.appendChild(img);
            tiles.push({ id: name, el: img });
        }

        board.appendChild(el);
    }

    return tiles;
}

var countdown;
function startTimer(mins, secparam) {
    var mins;
    var secs = mins * secparam;
    var currentSeconds = 0;
    var currentMinutes = 0;
    var timer = document.getElementById("timer");

    function updateClock() {
        currentMinutes = Math.floor(secs / 60);
        currentSeconds = secs % 60;
        if (currentSeconds <= 9) currentSeconds = "0" + currentSeconds;
        secs--;
        timer.textContent = currentMinutes + ":" + currentSeconds;
    }

    countdown = setInterval(function () { // update timer every second
        updateClock();
        switch (secs) {
            case 29:
                timer.className = "caution";
                worldTrack.playbackRate = 1.5;
                break;
            case 9:
                timer.className = "danger";
                worldTrack.playbackRate = 2;
                break;
            case -1:
                endGame(1);
                clearInterval(countdown); // stop timer
                break;
        }
    }, 1000);

    updateClock(); // run first time before setInterval kicks in
}


function endGame(starter) {
    var endHeader = document.getElementById("end-header");
    var images = document.getElementById("imageholder");
    var end = document.getElementById("endbox");
    images.className = "nullblur";
    worldTrack.pause();
    if (starter == 1) {
        loseBuzz.play()
        end.className = "shake";
        endHeader.innerHTML = "You Lose!";
    }
    if (starter == 2) {
        endHeader.innerHTML = "You Win!";
        winBuzz.play();
        end.className = "bounce";
        document.body.style.background = "url('assets/grid2.png') no-repeat center center fixed"; //change to "earth", rough visual of Africa on map
    }
    audioButton.src = "assets/icons/no_sound.png";
    document.getElementById('imageholder').style.pointerEvents = 'none'; //remove clickability at end
    endGame = false;
    clearInterval(countdown);
    var ratio=(score/missScore)*100;
    foo=Math.round(ratio);
    document.getElementById("accuracyScore").textContent = foo;
    var accuracyColor=document.getElementById("accuracy");
    if (foo < 30) accuracyColor.style.color = "yellow";
    else if (foo < 10) accuracyColor.style.color = "red";
    else accuracyColor.style.color = "limegreen";
}

/*Score*/
var scoreEl = document.getElementById("score");
var score = 0;
var missScoreEl = document.getElementById("missScore");
var missScore = 0;
function increaseScore(checker) {
    if (checker == 1) {
        scoreEl.textContent = ++score;
        if (score == 12) {
            endGame(2);
        }
    }
    if (checker == 2) {
        missScoreEl.textContent = ++missScore;
    }
}
/*audio controls */
var toggled = false;
var audioButton = document.getElementById("audio-icon");
var worldTrack = document.getElementById("world-track");
var loseBuzz = document.getElementById("lose-buzz");
var winBuzz = document.getElementById("win-buzz");
var incorrect = document.getElementById("incorrect");
var correct = document.getElementById("correct");

worldTrack.volume = 0.07;

loseBuzz.load();
loseBuzz.volume = 0.3;
loseBuzz.playbackRate = 1.2;

winBuzz.load();
winBuzz.volume = 0.2;

incorrect.volume = 0.5;
correct.volume = 0.5;
audioButton.addEventListener("click", clickHandler);

function clickHandler() {
    if (endGame) {
        if (!toggled) {
            toggled = true;
            worldTrack.pause();
            audioButton.src = "assets/icons/no_sound.png";
        } else {
            worldTrack.play();
            audioButton.src = "assets/icons/sound.png";
            toggled = false;
        }
    }
};

// Set img element src based on id name
function setImg(imgEl, id) {
    var path = "assets/flag_bubbles/";
    imgEl.src = path + id + ".png";
}

// Set img element src to default img
function setDefaultImg(imgEl) {
    imgEl.src = "assets/icons/globe.png";
};

gameStart();
