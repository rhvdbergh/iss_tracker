var express = require('express');
var router = express.Router();
const config = require('../bin/config.js');
const fetch = require('node-fetch');
const Twit = require('twit');
const T = new Twit(config.twitter);

/* GET home page. */
router.get('/', function(req, res, next) {
  fetch('http://api.open-notify.org/iss-now.json')
    .then(res => res.json())
    .then(json => {
      const loc = {
        lat: json.iss_position.latitude,
        lng: json.iss_position.longitude
      } 
      console.log('iss: ', loc);
      return loc;
    })
    .then(loc => {
      T.get('search/tweets', { q: `geocode:"${loc.lat} ${loc.lng} 200mi"`, count: 100 }, function(err, data, response) {
        // note: the coordinates returned by twitter is in the order lng, lat (even though the search
        // is for lat, lng)
        let tweets = [];
        let tweetsWithoutCoordinates = [];

        data.statuses.forEach(tweet => {
          console.log('tweet.coordinates: ', tweet.coordinates);
          if (tweet.coordinates) { // check to see if there are coordinates 
            tweets.push({
              text: tweet.text, 
              user: tweet.user.screen_name, 
              lat: tweet.coordinates.coordinates[1],
              lng: tweet.coordinates.coordinates[0]
            });
          } else {
            tweetsWithoutCoordinates.push({
              text: tweet.text, 
              user: tweet.user.screen_name
            });
          } // end if tweets.coordinates
        });

        console.log(tweets);
        
        res.render('index', { title: 'Express', googleMapsKey: config.googleMapsKey, lat: loc.lat, lng: loc.lng });
      });
    });
  
  
  
  
  
  
  }); // end router get
  
  module.exports = router;
