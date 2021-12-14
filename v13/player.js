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

function setup() {
  // song.play();
  // window.alert(song.isPlaying());
  // window.alert("reached");
}

// window.onload = function() {
//   // var canvas1 = document.getElementById('canvas1').contentWindow;
//   // canvas1.postMessage('Hello to iframe', '*');
//   for (let i = 1; i <= 3; i++) {
//     let iframe = document.getElementById("canvas" + i);
//     iframe.contentWindow.postMessage({
//       'acousticness': 0.5,
//       'energy': 0.5,
//       'danceability': 0.5
//     }, '*');
//   }
// };
//
function sendToAllFrames(message) {
  for (let i = 1; i <= 3; i++) {
    let iframe = document.getElementById("canvas" + i);
    // iframe.contentWindow.postMessage(message, '*');
  }
}

window.addEventListener('message', function(response) {
  // Make sure message is from our iframe, extensions like React dev tools might use the same technique and mess up our logs
  if (response.data && response.data.source === 'iframe') {
    // Do whatever you want here.
    // console.log(response.data.message);
  }
});

// function setup() {
//   mic = new p5.AudioIn();
//   mic.start();
// }
//
// function draw() {
//   let vol = mic.getLevel();
//   console.log(vol);
// }
//
// window.onSpotifyWebPlaybackSDKReady = () => {
//   startWebPlaybackSDK();
//   // Try a test call to get track features on the placeholder track id
//   fetchFeaturesInformation(features_endpoint);
// };
//
// // Extract the access token from the URL
// function getCurrentQueryParameters(delimiter = "#") {
//   const currentLocation = String(window.location).split(delimiter)[1];
//   const params = new URLSearchParams(currentLocation);
//   return params;
// }
//
// // Update the song and artist p tags in HTML
// function updateSongInformation(name, artist) {
//   const nameSelect = document.querySelector("#name");
//   const artistSelect = document.querySelector("#artist");
//   nameSelect.textContent = name;
//   artistSelect.textContent = artist;
// }
//
// // Query the API for track features
// function fetchFeaturesInformation(endpoint) {
//   const currentQueryParameters = getCurrentQueryParameters("#");
//   ACCESS_TOKEN = currentQueryParameters.get("access_token");
//   const fetchOptions = {
//     method: "GET",
//     headers: new Headers({
//       Authorization: `Bearer ${ACCESS_TOKEN}`,
//     }),
//   };
//   fetch(endpoint, fetchOptions)
//     .then(function(response) {
//       return response.json();
//     })
//     .then(function(json) {
//       currentTrackFeatures = json;
//       console.log(currentTrackFeatures);
//       sendToAllFrames(currentTrackFeatures);
//     })
//     .catch(function(error) {
//       console.log(error);
//     });
// }
//
// function startWebPlaybackSDK() {
//   console.log("Starting Web Playback SDK");
//   const player = new Spotify.Player({
//     name: "Duet",
//     getOAuthToken: (cb) => {
//       cb(ACCESS_TOKEN);
//     },
//     volume: 0.5,
//   });
//
//   player.connect();
//
//   // Ready
//   player.addListener("ready", ({
//     device_id
//   }) => {
//     console.log(
//       "Ready with Device ID " +
//       device_id +
//       "Select the Duet device in Spotify to begin playback."
//     );
//     updateCurrentTrack(player);
//     player.getCurrentState().then((state) => {
//       console.log("state: " + state);
//       var current_track = state.track_window.current_track;
//       console.log("Currently Playing ", current_track);
//       console.log("Track id ", current_track.id);
//     });
//   });
//
//   // Not Ready
//   player.addListener("not_ready", ({
//     device_id
//   }) => {
//     console.log("Device ID has gone offline", device_id);
//   });
//
//   player.addListener("initialization_error", ({
//     message
//   }) => {
//     console.error(message);
//   });
//
//   player.addListener("authentication_error", ({
//     message
//   }) => {
//     console.error(message);
//   });
//
//   player.addListener("account_error", ({
//     message
//   }) => {
//     console.error(message);
//   });

// Play button
document.getElementById("togglePlay").onclick = function() {
  // player.togglePlay().then(() => {
  //   playing = !playing;
  updateButton();
  if (song.isPlaying()) {
    song.pause();
  } else {
    song.play();
  }
  // });

  // player.getCurrentState().then((state) => {
  //   if (!state) {
  //     playing = false;
  //     document.getElementById("togglePlayIcon").className =
  //       "fas fa-play-circle";
  //     window.alert("Open Spotify and select Duet as the playback device");
  //     return;
  //   }
  //   updateCurrentTrack(player);
  // });
};
// Next button
document.getElementById("nextTrack").onclick = function() {
  window.alert("This is a demo version that does not support track switching");
  // playing = true;
  // updateButton();
  // player.nextTrack();
  // player.getCurrentState().then((state) => {
  //   if (!state) {
  //     window.alert("Open Spotify and select Duet as the playback device");
  //     return;
  //   }
  //   updateCurrentTrack(player);
  // });
};
// Previous button
document.getElementById("previousTrack").onclick = function() {
  window.alert("This is a demo version that does not support track switching");
}

// Refresh elements on the page based on current track
function updateCurrentTrack(player) {
  // player.getCurrentState().then((state) => {
  //   currentTrackId = state.track_window.current_track.id;
  //   let url = state.track_window.current_track.album.images[0].url;
  //   console.log("URL: " + url);
  //   let image = document.getElementById("album-cover");
  //   image.src = url;
  //   updateSongInformation(
  //     state.track_window.current_track.name,
  //     state.track_window.current_track.artists[0].name
  //   );
  //   console.log(state.track_window.current_track);
  //   console.log("Current Track ID updated to: " + currentTrackId);
  //   features_endpoint =
  //     "https://api.spotify.com/v1/audio-features/" + currentTrackId;
  //   fetchFeaturesInformation(features_endpoint);
  // });
}

function updateButton() {
  if (document.getElementById("togglePlayIcon").className == "fas fa-play-circle") {
    document.getElementById("togglePlayIcon").className = "fas fa-pause-circle";
  } else {
    document.getElementById("togglePlayIcon").className = "fas fa-play-circle";
  }
}

// const buildButton = document.querySelector("button#hide-modal");
// buildButton.addEventListener("click", hideModal);

function hideModal() {
  document.querySelector(".center-wrapper").style.display = "none";
}

const toggleLibraryButton = document.querySelector("button#toggleLibrary");
// console.log(toggleLibraryButton);
toggleLibraryButton.addEventListener("click", toggleLibrary);

// document.getElementsByClassname("imgButton").addEventListener("click", toggleLibrary);

function toggleLibrary() {
  const library = document.querySelector("#library");
  // console.log(library.style.display);
  if (library.style.display == "none" || library.style.display == "") {
    library.style.display = "block";
  } else if (library.style.display == "block") {
    library.style.display = "none";
  }
  // console.log("clicked");
}

// const mode1Button = document.querySelector("#mode1");
// mode1Button.addEventListener("click", toggleMode);

// for (let i = 2; i <= 4; i++) {
//   let iframe = document.getElementById("canvas" + i);
//   console.log("hiding canvas " + i);
//   iframe.style.display = "none";
// }

function toggleCanvas(num) {
  toggleLibrary();
  // window.alert("Clicked" + num);
  for (let i = 1; i <= 4; i++) {
    let iframe = document.getElementById("canvas" + i);
    if (i == num) {
      // console.log("display canvas " + i);
      iframe.style.display = "block";
    } else {
      // console.log("hide canvas " + i);
      iframe.style.display = "none";
    }
  }
  toggleLibrary();
}