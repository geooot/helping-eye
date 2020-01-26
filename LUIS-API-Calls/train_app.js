//  Jon Waterman
//  Purpose: Trains Application   ** will fail if any intents have 0 utterances **
//  Input: appID
//  Output: training status

var request = require("request");
const appID = "dc41dd7b-dfdc-4ab4-b196-9776f536bfab"
const versionID = "0.1"

const endpoint = "th2020-practice.cognitiveservices.azure.com"
const subscription_key = "7ff2eb676c8640cf9416e0f7229f9f32"


var request = require("request");

var options = { method: 'POST',
  url: 'https://' + endpoint + '/luis/api/v2.0/apps/' + appID + '/versions/' + versionID + '/train',
  qs: { 'subscription-key': subscription_key },
  headers: 
   { 'Postman-Token': 'fd61a7aa-a403-47b8-a443-9fad9ee73c50',
     'cache-control': 'no-cache' } };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});

