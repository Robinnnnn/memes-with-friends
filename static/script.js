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
  $("#random-pic-button").prop("disabled", false);

  localStorage.setItem("imageUrls", JSON.stringify(data));
});

let used = {};

const MAX_DIMENSION = 800; // this should scale to viewport

$("#random-pic-button").click(() => {
  const urlString = localStorage.getItem("imageUrls");
  const urls = JSON.parse(urlString);

  let url = getRandomEl(urls);
  if (used[url]) url = getRandomEl(urls);
  used[url] = true;

  const img = new Image();
  img.src = url;
  img.onload = () => {
    let w = img.width * 2;
    let h = img.height * 2;
    if (h > MAX_DIMENSION) {
      let ratio = MAX_DIMENSION / h;
      h = MAX_DIMENSION;
      w = w * ratio;
    }
    $("#image-root").attr("src", url).width(w).height(h);
  };
});

function getRandomEl(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
