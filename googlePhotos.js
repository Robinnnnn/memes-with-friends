const request = require("superagent");

const config = require("./config");

const { log } = require("./logger");

// https://developers.google.com/photos/library/reference/rest/v1/albums/list
async function getAlbums(authToken) {
  try {
    const result = await request
      .get(`${config.apiEndpoint}/v1/albums`)
      .query({ pageSize: 50 })
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${authToken}`);

    const albums = result.body.albums || [];

    // Parse albums and add them to the list, skipping empty entries.
    const items = albums.filter((x) => !!x);
    console.log(items);
    return items;
  } catch (err) {
    log.error(err);
    throw err;
  }
}

// https://developers.google.com/photos/library/guides/list
async function getImagesFromAlbum(authToken) {
  const urls = [];

  const pageSize = 100;
  let parameters = { pageSize, albumId: config.memeAlbumId };

  try {
    do {
      const batchNum = Math.floor(urls.length / pageSize) + 1;
      log.info(`Retrieving batch ${batchNum}`);
      console.log(urls.length, parameters);
      const result = await request
        .post(`${config.apiEndpoint}/v1/mediaItems:search`)
        .query(parameters)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${authToken}`);

      const items = result.body.mediaItems;

      items.forEach((item) => {
        if (item.baseUrl) urls.push(item.baseUrl);
      });

      parameters.pageToken = result.body.nextPageToken;
    } while (parameters.pageToken);

    return urls;
  } catch (err) {
    log.error(err);
    throw err;
  }
}

module.exports = {
  getAlbums,
  getImagesFromAlbum,
};
