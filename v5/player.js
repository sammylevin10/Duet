let playing = false;

function getFormData(formId) {
  const form = document.getElementById(formId);
  const formData = new FormData(form);
  return formData;
}

const AUTH_BASE_URL = "https://accounts.spotify.com/authorize";
const API_ENDPOINT = "https://api.spotify.com/v1/me";
let ACCESS_TOKEN;

window.onSpotifyWebPlaybackSDKReady = () => {
  startWebPlaybackSDK();
  fetchProfileInformation();
};

function getCurrentQueryParameters(delimiter = "#") {
  // the access_token is passed back in a URL fragment, not a query string
  // errors, on the other hand are passed back in a query string
  const currentLocation = String(window.location).split(delimiter)[1];
  const params = new URLSearchParams(currentLocation);
  return params;
}

function updateProfileInformation(json) {
  // const infoString = `Welcome back, ${json.id}!`;
  // const profileInfoElement = document.querySelector("#profile_info");
  const username = document.querySelector("#username");
  const followers = document.querySelector("#followers");
  // profileInfoElement.textContent = infoString;
  username.textContent = `${json.id}`;
  followers.textContent = `${json.followers.total} followers`;
  // profileInfoElement.textContent = "aaaaa";
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
    })
    .catch(function (error) {
      console.log(error);
    });
}

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
    console.log(
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
    player.togglePlay().then(() => {
      playing = !playing;
      console.log("Playing: " + playing);
      if (playing) {
        document.getElementById("togglePlayIcon").className =
          "fas fa-pause-circle";
      } else {
        document.getElementById("togglePlayIcon").className =
          "fas fa-play-circle";
      }
    });
    console.log("toggle");

    player.getCurrentState().then((state) => {
      if (!state) {
        playing = false;
        document.getElementById("togglePlayIcon").className =
          "fas fa-play-circle";
        console.error("User is not playing music through the Web Playback SDK");
        window.alert(
          "Open Spotify and select MusicVisualizer as the playback device"
        );
        return;
      }

      var current_track = state.track_window.current_track;
      var next_track = state.track_window.next_tracks[0];

      console.log("Currently Playing", current_track);
      console.log("Playing Next", next_track);
    });
  };
  document.getElementById("nextTrack").onclick = function () {
    console.log("next");
    player.nextTrack();
    player.getCurrentState().then((state) => {
      if (!state) {
        console.error("User is not playing music through the Web Playback SDK");
        window.alert(
          "Open Spotify and select MusicVisualizer as the playback device"
        );
        return;
      }
    });
  };
  document.getElementById("previousTrack").onclick = function () {
    console.log("previous");
    player.previousTrack();
    player.getCurrentState().then((state) => {
      if (!state) {
        console.error("User is not playing music through the Web Playback SDK");
        window.alert(
          "Open Spotify and select MusicVisualizer as the playback device"
        );
        return;
      }
    });
  };
}

// p5 stuff

let spread;
let inc;
let margin;
let vertOffset;
// extra flat line at either end
let extraLine = 70;
// steps between vertexes
let step = 3;
// spacing between lines
let ySpacing = 2.6;

// noise settings
let offset = 0;
let offsetInc = 0.09;
let rowOffset = 40;
let lineMultiplier = 47;

// fuzz settings
let fuzzOffset = 1000;
let fuzzInc = offsetInc;
let fuzzMultiplier = 3.5;
let mic;

function setup() {
  let cnv = createCanvas(windowHeight, windowHeight);
  cnv.parent("#canvas-container");
  background(200);

  margin = width / 3;
  vertOffset = width / 4.6;
  spread = width - margin * 2;
  inc = (TWO_PI * step) / spread;
  stroke(255);
  strokeWeight(1.2);
  fill(0);
  // noFill()
  frameRate(24);

  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT();
}

function draw() {
  background(0);
  let vol = mic.getLevel();
  lineMultiplier = vol * 1000;

  // make rows
  for (let y = 0; y <= 50 * ySpacing; y += ySpacing) {
    let a = 0.0;
    // begin the line
    beginShape();
    for (let x = -extraLine; x <= spread + extraLine; x += step) {
      // perlin noise
      let n = noise(offset + x / rowOffset + y) * lineMultiplier;
      // flatten the line if not in the 'spread' area
      if (x < 0 || x > spread) a = 0;
      // use a sine wave to multiply the noise
      let vert = (1 - sin(a + PI / 2)) * n;
      // add some extra fuzz to the line
      let fuzz = noise(fuzzOffset + x / rowOffset + y) * fuzzMultiplier;
      // draw the line
      vertex(
        x + margin,
        height - vert - (height - y * ySpacing) + vertOffset + fuzz
      );
      //increment the angle for the sine wave.
      a = a + inc;
    }
    endShape();
  }
  // increment the noise and fuzz
  offset += offsetInc;
  fuzzOffset += fuzzInc;

  let spectrum = fft.analyze();
  // noStroke();
  //fill(255, 0, 255);
  for (let i = 0; i < spectrum.length; i++) {
    x = map(i, 0, spectrum.length, 0, width);
    let h = -height + map(spectrum[i], 0, 255, height, 0);
    //rect(x, height, width / spectrum.length, h );
  }
}
