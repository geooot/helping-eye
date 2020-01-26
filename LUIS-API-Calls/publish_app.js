//  Jon Waterman
//  Purpose: Publishes Application   ** will fail if any intents have 0 utterances **
//  Input: none
//  Output: publishing status

var request = require("request");
const appID = "dc41dd7b-dfdc-4ab4-b196-9776f536bfab"
const versionID = "0.1"

const endpoint = "th2020-practice.cognitiveservices.azure.com"
const subscription_key = "7ff2eb676c8640cf9416e0f7229f9f32"


var request = require("request");

var options = { method: 'POST',
url: 'https://' + endpoint + '/luis/api/v2.0/apps/' + appID + '/publish',
qs: { 'subscription-key': subscription_key },

  headers: 
   { 'Postman-Token': 'a1c33ac0-872b-44e2-911b-89bac8c1d531',
     'cache-control': 'no-cache',
     'Content-Type': 'application/json' },
  body: 
   { versionId: versionID,
     isStaging: false,
     directVersionPublish: false },
  json: true };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});


