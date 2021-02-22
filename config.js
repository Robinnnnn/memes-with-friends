require("dotenv").config();

const PORT = 4000;

module.exports = {
  port: PORT,
  oAuthClientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
  oAuthClientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  oAuthCallbackUrl: `http://localhost:${PORT}/auth/google/callback`,
  scopes: ["https://www.googleapis.com/auth/photoslibrary.readonly", "profile"],
  expressSessionSecret: process.env.EXPRESS_SESSION_SECRET,
  apiEndpoint: "https://photoslibrary.googleapis.com",
  memeAlbumId: process.env.MEME_ALBUM_ID,
};
