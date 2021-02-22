const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const passport = require("passport");
const auth = require("./auth");

const config = require("./config");
const googlePhotos = require("./googlePhotos");

const logger = require("./logger");
const { log } = logger;

const app = express();

app.use(bodyParser.json());

// pass port stuff
auth.init(app);

// winston stuff
logger.init(app);

/// Serve /static folder content
app.use(express.static("static"));
app.get("/", (_, res) => {
  res.status(200).sendFile(path.join(__dirname + "/index.html"));
});

app.get(
  "/login",
  passport.authenticate("google", {
    scope: config.scopes,
    failureFlash: true,
    session: true,
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/",
    failureFlash: true,
    session: true,
  }),
  (req, res) => {
    log.info("User has logged in.");
    res.redirect("/");
  }
);

app.get("/getAlbums", async (req, res) => {
  log.info("Loading albums");
  const result = await googlePhotos.getAlbums(req.user.token);
  res.send(result);
});

app.get("/getImages", async (req, res) => {
  log.info("Loading images");
  const result = await googlePhotos.getImagesFromAlbum(req.user.token);
  res.send(result);
});

// Start the server
app.listen(config.port, () => {
  log.info(`App listening on port ${config.port}`);
});
