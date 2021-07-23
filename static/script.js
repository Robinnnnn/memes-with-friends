let isFullscreen = false;

function registerFullscreenHandler() {
  document.addEventListener("fullscreenchange", fullscreenHandler, false);
}

function fullscreenHandler() {
  isFullscreen = document.webkitIsFullScreen;
  if (isFullscreen) {
    $("#image-root").css({
      cursor: "zoom-out",
      border: 0,
      "border-radius": 0,
    });
  } else {
    $("#image-root").css({
      cursor: "zoom-in",
      border: "10px solid #fb7fff",
      "border-radius": "20px",
    });
  }
}

registerFullscreenHandler();

async function getImages() {
  const response = await fetch("/getImages");
  const data = await response.json();
  if (response.status >= 400) throw data;
  return data;
}

let usedMap = {};
let usedArr = [];

$("#fetch-button").click(async () => {
  usedMap = {};
  usedArr = [];

  $("#fetch-button").html(
    "loading... talking to google photos... this might take a while"
  );
  $("#fetch-button").css({ "font-size": "20px" });
  $("#fetch-button").prop("disabled", true);
  $("#start-button").prop("disabled", true);

  let data;
  try {
    data = await getImages();
    console.log({ data });
  } catch (e) {
    $("#fetch-button").html(
      `FAILED! try logging in again... failure reason: ${e.message}`
    );
    $("#fetch-button").css({ "font-size": "20px" });
    return;
  }

  $("#fetch-button").html("SUCCESS!");
  $("#fetch-button").css({ "font-size": "30px" });
  $("#fetch-button").prop("disabled", true);
  $("#start-button").prop("disabled", false);

  localStorage.setItem("imageUrls", JSON.stringify(data));
});

const goFullscreen = () => $("#image-root")[0].requestFullscreen();

$("#start-button").click(() => {
  const urls = localStorage.getItem("imageUrls");
  if (!urls) {
    $("#start-button").html("ERROR! No pics found, please log in");
    $("#start-button").css({ "font-size": "20px" });
    return;
  }

  const url = getUrlFromLocalStorage();

  const img = new Image();
  img.src = url;
  // img.src =
  // "https://lh3.googleusercontent.com/lr/AFBm1_b_ub3a66fLAAl1dI5t5kMb1WT4uiX2XNDK3s8GKFXcXc_dWt1dli1PfEN1wlJv5RjNvlBRjz-nRHtuk6D53Iut4FHluBEOlWWEUhF8Fh1EBVzolN-ZdigRqx8_B6GIRFfZJ30TJW7akx1LMf2vChnC_OAaVkhxRKSsJJ1hUDj9e9ueAi2S6demWWF0AE2Qp7xvK9gimBg-AnLTQxz59IrqTURvmrcS4-TMLBrKNDk5Q5kRYld8Gd-fTDVh3K8L63vgF_uWwuT-eRzR9P5MzDxX0LBg9OYJnTaBq_wHO8tQEiuI7mPwf5wO-VF5Vjsth5DtxWGLDL9w8RIfOIUGf1NokU5yGI35sSsQHRAbRfX6PGP8i96NWswzqhr93oZ3N-sv3J_QdFBkI0UE9R8StiE4PuEZnm06l4b8gMQxop4lCz4nuxNb14pI3TsZsM0KN7tjGahruQuFrRkEOOOMCCG8Vhp2NiDgc-EUuIbpZ0FfyP-_s2MBbYJrbwwRwhdwQ-aUba5T6jdLxgMKy64U2Cj-66ijNSGicwG1T0Nt_SxQf5MHNbOtUe_O7v2faoMFwAWfAPqsIQtMVXk8YVF7coeR_8CKoWaMvAuRFMf5oDtgVm53eVruQQYoaYxxk_ydlynia7J_HaBgShgQr7r-aUvwMs8oVqC7OMZwnh4zHFiKy7tB3AKxzOlHQsj_qWSXReXoUNw6jr_XO2kpf1iNsAz25MQTZ6mCE7hdA8KAq3LEckzQuIwV1TtdFywN6SvfkMKdhjjrbyuX9zSKsjKD9fukQz-8dilQcyCN-3--kTAQexCjBQGffwZmR_0b0FeYYT49-bbU5Vw";
  img.onload = () => {
    $("#image-root").attr("src", url);
    document.body.onkeyup = registerKeyboardEvents;
    $("#start-button").prop("disabled", true);
  };
  img.onerror = () => {
    $("#start-button").html(
      "ERROR! Loading was blocked... try re-fetching pics"
    );
    $("#start-button").css({ "font-size": "20px" });
    return;
  };
});

$("#image-root").click(() => {
  if (!isFullscreen) goFullscreen();
  else document.exitFullscreen();
});

function getRandomEl(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomUnusedUrl(urls) {
  const url = getRandomEl(urls);
  if (usedMap[url]) return getRandomUnusedUrl(urls);
  usedMap[url] = true;
  // usedArr.push(url) // todo
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

  const prevKeyMap = {
    arrowLeft: 37,
  };
  const prevKeys = Object.values(prevKeyMap);

  if (nextKeys.includes(event.keyCode)) {
    const newUrl = getUrlFromLocalStorage();
    $("#image-root").attr("src", newUrl);
  }

  if (prevKeys.includes(event.keyCode)) {
    $("#image-root").attr("src", prevUrl);
  }
}
