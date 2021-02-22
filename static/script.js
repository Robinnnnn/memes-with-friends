let isFullscreen = false;

function registerFullscreenHandler() {
  document.addEventListener("fullscreenchange", fullscreenHandler, false);
}

function fullscreenHandler() {
  isFullscreen = document.webkitIsFullScreen;
  if (isFullscreen) $("#image-root").css({ cursor: "zoom-out" });
  else $("#image-root").css({ cursor: "zoom-in" });
}

registerFullscreenHandler();

async function getAImages() {
  const response = await fetch("/getImages");
  const data = await response.json();
  return data;
}

$("#fetch-button").click(async () => {
  $("#fetch-button").html("loading... plz wait");

  const data = await getAImages();

  $("#fetch-button").html("SUCCESS!");
  $("#fetch-button").prop("disabled", true);
  $("#start-button").prop("disabled", false);

  localStorage.setItem("imageUrls", JSON.stringify(data));
});

const goFullscreen = () => $("#image-root")[0].requestFullscreen();

$("#start-button").click(() => {
  const url = getUrlFromLocalStorage();

  const img = new Image();
  img.src = url;
  img.onload = () => {
    goFullscreen();
    $("#image-root").attr("src", url);
    document.body.onkeyup = registerKeyboardEvents;
  };
});

$("#image-root").click(() => {
  if (!isFullscreen) goFullscreen();
  else document.exitFullscreen();
});

function getRandomEl(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const used = {};
function getRandomUnusedUrl(urls) {
  const url = getRandomEl(urls);
  if (used[url]) return getRandomUnusedUrl(urls);
  used[url] = true;
  return url;
}

function getUrlFromLocalStorage() {
  const urlString = localStorage.getItem("imageUrls");
  const urls = JSON.parse(urlString);
  return getRandomUnusedUrl(urls);
}

function registerKeyboardEvents(event) {
  const nextKeyMap = {
    space: 32,
    arrowRight: 39,
  };
  const nextKeys = Object.values(nextKeyMap);

  if (nextKeys.includes(event.keyCode)) {
    const newUrl = getUrlFromLocalStorage();
    $("#image-root").attr("src", newUrl);
  }
}
