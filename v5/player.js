let playing = false;
let currentTrackId = "11dFghVXANMlKmJXsNCbNl";
let currentTrackFeatures = {};

function getFormData(formId) {
  const form = document.getElementById(formId);
  const formData = new FormData(form);
  return formData;
}

const AUTH_BASE_URL = "https://accounts.spotify.com/authorize";
const PROFILE_ENDPOINT =
  "https://api.spotify.com/v1/audio-features/11dFghVXANMlKmJXsNCbNl";
features_endpoint =
  "https://api.spotify.com/v1/audio-features/" + currentTrackId;
let ACCESS_TOKEN;

window.onSpotifyWebPlaybackSDKReady = () => {
  startWebPlaybackSDK();
  fetchFeaturesInformation(features_endpoint);
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

function fetchFeaturesInformation(endpoint) {
  // console.log("FETCH");
  const currentQueryParameters = getCurrentQueryParameters("#");
  ACCESS_TOKEN = currentQueryParameters.get("access_token");

  const fetchOptions = {
    method: "GET",
    headers: new Headers({
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    }),
  };

  fetch(endpoint, fetchOptions)
    .then(function (response) {
      // console.log(response.json());
      console.log(response);
      // console.log(response.json());
      return response.json();
    })
    .then(function (json) {
      console.log(json);
      console.log("Current track features");
      console.log(currentTrackFeatures);
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
    updateCurrentTrack(player);
    player.getCurrentState().then((state) => {
      console.log("state: " + state);
      var current_track = state.track_window.current_track;
      console.log("Currently Playing ", current_track);
      console.log("Track id ", current_track.id);
    });
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
      // console.log("Playing: " + playing);
      if (playing) {
        document.getElementById("togglePlayIcon").className =
          "fas fa-pause-circle";
      } else {
        document.getElementById("togglePlayIcon").className =
          "fas fa-play-circle";
      }
    });
    // console.log("toggle");

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
      updateCurrentTrack(player);
    });
  };
  document.getElementById("nextTrack").onclick = function () {
    // console.log("next");
    player.nextTrack();
    player.getCurrentState().then((state) => {
      if (!state) {
        console.error("User is not playing music through the Web Playback SDK");
        window.alert(
          "Open Spotify and select MusicVisualizer as the playback device"
        );
        return;
      }
      updateCurrentTrack(player);
    });
  };
  document.getElementById("previousTrack").onclick = function () {
    // console.log("previous");
    player.previousTrack();
    player.getCurrentState().then((state) => {
      if (!state) {
        console.error("User is not playing music through the Web Playback SDK");
        window.alert(
          "Open Spotify and select MusicVisualizer as the playback device"
        );
        return;
      }
      updateCurrentTrack(player);
    });
  };
}

function updateCurrentTrack(player) {
  player.getCurrentState().then((state) => {
    currentTrackId = state.track_window.current_track.id;
    console.log("Current Track ID updated to: " + currentTrackId);
    features_endpoint =
      "https://api.spotify.com/v1/audio-features/" + currentTrackId;
    let json = fetchFeaturesInformation(features_endpoint);
    console.log(
      "After updating the current track, this is the json response from the api: " +
        json
    );
  });
}

// p5 stuff

// Sound
let mic;
let fft, peakDetect;
var ellipseWidth = 0;

let blooms = [];

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.parent("#canvas-container");
  background(0);
  noStroke();
  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT();
  fft.setInput(mic);
  peakDetect = new p5.PeakDetect();
  colorMode(HSB, 100, 100, 100, 100);
}

function draw() {
  background(0, 0, 0, 5);
  micLevel = mic.getLevel();
  // console.log(micLevel);
  // testBloom = new Bloom1(width / 2, height / 2, 14, micLevel * 100);
  // testBloom.moveAndDisplay();

  let spectrum = fft.analyze();

  stroke(255, 255, 255, 20);
  // strokeWeight(0.5);
  noFill();
  // if (playing) {
  //   beginShape();
  //   for (i = 0; i < spectrum.length; i++) {
  //     vertex(
  //       map(i, 0, spectrum.length, 0, width),
  //       map(spectrum[i], 0, 255, height - 100, 0)
  //     );
  //   }
  //   endShape();
  // }

  peakDetect.update(fft);
  // console.log(peakDetect.isDetected);

  if (peakDetect.isDetected) {
    let bass;
    bass = map(spectrum[250], 0, 255, 0, 100);
    console.log("Bass: " + bass);
    temp = new Bloom1(
      random(width / 5, (width * 4) / 5),
      random(height / 5, (height * 4) / 5),
      floor(random(5, 10)),
      floor(400 * map(bass, 0, 100, 0, 1)),
      map(bass, 0, 100, 0, 70)
    );
    blooms.push(temp);
  }

  for (let i = 0; i < blooms.length; i++) {
    // console.log("displaying");
    blooms[i].moveAndDisplay();
    if (blooms[i].isDead()) {
      blooms.splice(i, 1);
      // console.log("deleting " + i);
      i--;
    }
  }
}

class Bloom1 {
  // x position, y position, rotation count, size
  constructor(x, y, c, s, saturation) {
    this.x = x;
    this.y = y;
    this.c = c;
    this.s = s;
    this.saturation = saturation;
    this.velocity = 5;
    this.acceleration = -0.5;
    this.rotation = 0;
    this.rotationVelocity = random(0.2, 1);
    this.startColor = color(random(100), this.saturation, 65, 30);
    this.endColor = color(random(100), this.saturation, 65, 60);
    this.colorPosition = 0;
    this.particles = [];
    for (let i = 0; i < random(10, 20); i++) {
      let temp = new Particle1(x, y, s / 5, this.startColor, this.endColor);
      this.particles.push(temp);
    }
  }
  moveAndDisplay() {
    this.colorPosition += 0.05;
    let color = lerpColor(this.startColor, this.endColor, this.colorPosition);
    fill(color);
    this.s += this.velocity;
    this.velocity += this.acceleration;
    noStroke();
    this.rotation += this.rotationVelocity;
    // rotate(radians(this.rotation));
    push();
    translate(this.x, this.y);
    for (let i = 0; i < this.c; i++) {
      rotate(radians(360 / this.c + this.rotation));
      ellipse(this.s, 0, this.s);
      ellipse(this.s / 2, 0, this.s / 2);
      ellipse(this.s / 4, 0, this.s / 4);
    }
    pop();
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].moveAndDisplay();
      if (this.particles[i].isOffScreen()) {
        this.particles.splice(i, 1);
        // console.log("deleting " + i);
        i--;
      }
    }
  }
  isDead() {
    return this.s < 1;
  }
}

class Particle1 {
  constructor(x, y, s, startColor, endColor) {
    this.x = x;
    this.y = y;
    this.s = s;
    this.startColor = endColor;
    this.endColor = startColor;
    this.colorPosition = 0;
    this.xVelocity = random(-15, 15);
    this.yVelocity = random(-15, 15);
    this.xAcceleration = this.xVelocity * -1 * 0.01;
    this.yAcceleration = this.yVelocity * -1 * 0.01;
  }
  moveAndDisplay() {
    this.colorPosition += 0.05;
    let color = lerpColor(this.startColor, this.endColor, this.colorPosition);
    fill(color);
    this.x += this.xVelocity;
    this.y += this.yVelocity;
    this.xVelocity += this.xAcceleration;
    this.yVelocity += this.yAcceleration;
    ellipse(this.x, this.y, this.s, this.s);
  }
  isOffScreen() {
    let beyondX = this.x > width + 50 || this.x < -50;
    let beyondY = this.y > height + 50 || this.y < -50;
    if (beyondX || beyondY) {
      return true;
    }
    return false;
  }
}
