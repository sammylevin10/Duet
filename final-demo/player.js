// Duet - player.js
// Sahana Sripadanna and Sammy Levin 2021
// Handles in-browser playback and music visualization via p5

// API Authorization flow is based off of https://gist.github.com/eamonnbell/84e3463e964eeae87f59699c7e711f1b
// SDK web playback is based off of https://developer.spotify.com/documentation/web-playback-sdk/quick-start/

// State variables which are referenced by the visual and playback icons
let playing = false;
let currentTrackId = "11dFghVXANMlKmJXsNCbNl";
let currentTrackFeatures = {};
let mic;

const AUTH_BASE_URL = "https://accounts.spotify.com/authorize";
const PROFILE_ENDPOINT =
  "https://api.spotify.com/v1/audio-features/11dFghVXANMlKmJXsNCbNl";
let features_endpoint =
  "https://api.spotify.com/v1/audio-features/" + currentTrackId;
let ACCESS_TOKEN;

function preload() {
  song = loadSound("assets/sound/song1.mp3");
}

function setup() {}

function sendToAllFrames(message) {
  for (let i = 1; i <= 3; i++) {
    let iframe = document.getElementById("canvas" + i);
  }
}

window.addEventListener('message', function(response) {
  if (response.data && response.data.source === 'iframe') {}
});

// Play button
document.getElementById("togglePlay").onclick = function() {
  updateButton();
  if (song.isPlaying()) {
    song.pause();
  } else {
    song.play();
  }
};

// Next button
document.getElementById("nextTrack").onclick = function() {
  window.alert("This is a demo version that does not support track switching");
};

// Previous button
document.getElementById("previousTrack").onclick = function() {
  window.alert("This is a demo version that does not support track switching");
}

function updateButton() {
  if (document.getElementById("togglePlayIcon").className == "fas fa-play-circle") {
    document.getElementById("togglePlayIcon").className = "fas fa-pause-circle";
  } else {
    document.getElementById("togglePlayIcon").className = "fas fa-play-circle";
  }
}

function hideModal() {
  document.querySelector(".center-wrapper").style.display = "none";
}

const toggleLibraryButton = document.querySelector("button#toggleLibrary");
toggleLibraryButton.addEventListener("click", toggleLibrary);

function toggleLibrary() {
  const library = document.querySelector("#library");
  if (library.style.display == "none" || library.style.display == "") {
    library.style.display = "block";
  } else if (library.style.display == "block") {
    library.style.display = "none";
  }
}

function toggleCanvas(num) {
  toggleLibrary();
  for (let i = 1; i <= 4; i++) {
    let iframe = document.getElementById("canvas" + i);
    if (i == num) {
      iframe.style.display = "block";
    } else {
      iframe.style.display = "none";
    }
  }
  toggleLibrary();
}