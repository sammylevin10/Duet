function getFormData(formId) {
  const form = document.getElementById(formId);
  const formData = new FormData(form);
  return formData;
}

const AUTH_BASE_URL = "https://accounts.spotify.com/authorize";
const API_ENDPOINT = "https://api.spotify.com/v1/me";
let ACCESS_TOKEN;

const authenticationParams = new URLSearchParams("");
authenticationParams.append("client_id", "c765bbca6c64400286254e513c85db86");
authenticationParams.append("response_type", "token");
authenticationParams.append(
  "redirect_uri",
  "http://localhost:8888/interactive/MusicVisualizer/v5/player.html"
);
authenticationParams.append("scope", "");

function getCurrentQueryParameters(delimiter = "#") {
  // the access_token is passed back in a URL fragment, not a query string
  // errors, on the other hand are passed back in a query string
  const currentLocation = String(window.location).split(delimiter)[1];
  const params = new URLSearchParams(currentLocation);
  return params;
}

function buildAuthLink() {
  // const params = formDataToParams(getFormData("main_form"));
  const authURI = AUTH_BASE_URL + "?" + authenticationParams;
  const authLinkAnchor = document.querySelector("a#auth_link");
  authLinkAnchor.setAttribute("href", authURI);
  authLinkAnchor.textContent = authURI;
}

function updateProfileInformation(json) {
  const infoString = `username: ${json.id} has ${json.followers.total} follower(s) on Spotify`;
  const profileInfoElement = document.querySelector("#profile_info");
  profileInfoElement.textContent = infoString;
}

function fetchProfileInformation() {
  console.log("FETCH");
  const currentQueryParameters = getCurrentQueryParameters("#");
  ACCESS_TOKEN = currentQueryParameters.get("access_token");

  const fetchOptions = {
    method: "GET",
    headers: new Headers({
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    }),
  };

  fetch(API_ENDPOINT, fetchOptions)
    .then(function (response) {
      console.log(response);
      return response.json();
    })
    .then(function (json) {
      console.log(json);
      updateProfileInformation(json);
      // AFTER RECEIVING API RESONSE, FIRE UP SDK
      startWebPlaybackSDK();
    })
    .catch(function (error) {
      console.log(error);
    });
}

// const buildButton = document.querySelector("button#build_link");
// buildButton.addEventListener("click", buildAuthLink);

const fetchButton = document.querySelector("button#fetch_profile_info");
fetchButton.addEventListener("click", fetchProfileInformation);

function startWebPlaybackSDK() {
  // window.onSpotifyWebPlaybackSDKReady = () => {
  console.log("Starting Web Playback SDK");
  // const token = "BQBc10XDlKyVNeTAXqUyqjdeiOSjCnMnj0-FE8auKYYdcmpkdX809eddC6ZychGwCqYwjLCRMb2AuEb1XoNGUaXD7l03YOyKjt5p0PzAjJUMs8souXKB3O4TNkjzgMCeXU9aSYD6jFjPgis_xIQW631blM_26B8FCEKeEA";
  const player = new Spotify.Player({
    name: "Music Visualizer",
    getOAuthToken: (cb) => {
      cb(ACCESS_TOKEN);
    },
    volume: 0.5,
  });

  player.connect();

  // Ready
  player.addListener("ready", ({ device_id }) => {
    window.alert(
      "Ready with Device ID " +
        device_id +
        "Select the MusicVisualizer device in Spotify to begin playback."
    );
  });

  // Not Ready
  player.addListener("not_ready", ({ device_id }) => {
    console.log("Device ID has gone offline", device_id);
  });

  player.addListener("initialization_error", ({ message }) => {
    console.error(message);
  });

  player.addListener("authentication_error", ({ message }) => {
    console.error(message);
  });

  player.addListener("account_error", ({ message }) => {
    console.error(message);
  });

  document.getElementById("togglePlay").onclick = function () {
    player.togglePlay();
    console.log("toggle");
  };

  // };
}
