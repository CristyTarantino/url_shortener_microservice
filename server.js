'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mongo = require('mongodb');
const mongoose = require('mongoose');

const cors = require('cors');
const dns = require('dns');
const url = require('url');

const app = express();

const MyApp = require('./myApp.js');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

/** this project needs to parse POST bodies **/
app.use(bodyParser.urlencoded({extended: 'false'}));
app.use(bodyParser.json());

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});


// your first API endpoint...
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.post("/api/shorturl/new", (req, res, next) => {
  const newUrl = url.parse(req.body.url).hostname;

  dns.lookup(newUrl, (err, address, family) => {
    if (address) {
      MyApp.createAndSaveShortUrl(req.body.url, (err, data) => {
        err ? res.json("error", err) : res.send({ "original_url": req.body.url, "short_url": data.id});
      });
    } else {
      res.send({"error":"invalid URL"});
    }
  });
});


app.get("/api/shorturl/:short_url", (req, res, next) => {
  const short_url = req.params.short_url;
  MyApp.ShortUrlModel.findById(short_url, (err, shortUrl) => err ? res.json("error", err) : res.redirect(shortUrl.url));
});


app.listen(port, function () {
  console.log('Node.js listening ...');
});