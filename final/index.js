// Duet - index.js
// Sahana Sripadanna and Sammy Levin 2021
// Handles connection to Spotify to acquire access token, which is used by player.js to authenticate SDK and API

// API Authorization flow is based off of https://gist.github.com/eamonnbell/84e3463e964eeae87f59699c7e711f1b
// SDK web playback is based off of https://developer.spotify.com/documentation/web-playback-sdk/quick-start/

const AUTH_BASE_URL = "https://accounts.spotify.com/authorize";
const API_ENDPOINT = "https://api.spotify.com/v1/me";
let ACCESS_TOKEN;

// Params that are fed into the API query to request an access token
const authenticationParams = new URLSearchParams("");
authenticationParams.append("client_id", "c765bbca6c64400286254e513c85db86");
authenticationParams.append("response_type", "token");
authenticationParams.append(
  "redirect_uri",
  "https://i6.cims.nyu.edu/~sal705/interactive/MusicVisualizer/final/player.html"
);
authenticationParams.append("scope", "streaming");

// Access token is passed back as part of the callback URL
function getCurrentQueryParameters(delimiter = "#") {
  const currentLocation = String(window.location).split(delimiter)[1];
  const params = new URLSearchParams(currentLocation);
  return params;
}

// Given the authentication params, create a URL to query for an access token
function buildAuthLink() {
  const authURI = AUTH_BASE_URL + "?" + authenticationParams;
  window.location.href = authURI;
}

const buildButton = document.querySelector("button#build_link");
buildButton.addEventListener("click", buildAuthLink);