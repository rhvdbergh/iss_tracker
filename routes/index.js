var express = require('express');
var router = express.Router();
const config = require('../bin/config.js');
const fetch = require('node-fetch');

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
      res.render('index', { title: 'Express', googleMapsKey: config.googleMapsKey, lat: loc.lat, lng: loc.lng });
    });
}); // end router get

module.exports = router;
