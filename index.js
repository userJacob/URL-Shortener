require('dotenv').config();
let bodyParser = require("body-parser");
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require("dns");

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({
    greeting: 'hello API'
  });
});

app.post('/api/shorturl', function(req, res, next) {
  let url = req.body.url
  let regex = /^https?:\/\//;
  if (regex.test(url)) {
    var tempDnsUrl = url.slice(url.indexOf("//") + 2);
    var slashIndex = tempDnsUrl.indexOf("/");
    var dnsUrl = slashIndex < 0 ? tempDnsUrl : tempDnsUrl.slice(0, slashIndex); 
    dns.lookup(dnsUrl, function(err, address, family) {
      if (err) { 
        res.json({error: "Invalid Hostname"});
      }
      else if (address !== undefined) {
        let short = Math.floor(Math.random() * 100000);
        res.json({
          original_url: url,
          short_url: short
        });
      } 
    });  //dns.lookup
    } else {
    res.json({error: "Invalid URL"});
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
