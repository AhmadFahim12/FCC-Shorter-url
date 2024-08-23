require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const URL = require("url").URL;
const dns = require("node:dns");

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

const urlsArray = [];

app
  .route("/api/shorturl/:short_url?")
  .post(function (req, res) {
    const { url } = req.body;
    const urlObject = new URL(url);
    dns.lookup(urlObject.hostname, (err, address, family) => {
      if (err) {
        res.send({ error: "invalid url" });
      }
      var shortenedURL = Math.floor(Math.random() * 100000).toString();
      const findUrl = urlsArray.find((item) => item.original === url);
      if (findUrl) {
        res.redirect(findUrl.original);
      } else {
        urlsArray.push({
          original: url,
          short: shortenedURL,
        });
        res.json({
          original_url: url,
          short_url: shortenedURL,
        });
      }
    });
  })
  .get((req, res) => {
    const { short_url } = req.params;
    const findUrl = urlsArray.find((item) => item.short === short_url);
    if (findUrl) {
      res.redirect(findUrl.original);
    }
  });

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
