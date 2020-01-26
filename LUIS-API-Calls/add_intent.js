//  Jon Waterman
//  purpose: adds an intent to the app
//  inputs: name of intent
//  outputs: ID of new query (I'm fairly sure)

var request = require("request");

var options = { method: 'POST',
  url: 'https://{endpoint_url}/luis/api/v2.0/apps/{appID}/versions/{versionID}/intents',
  //  switch out endpoint_url, versionID, and appID
  qs: { 'subscription-key': '<subscription_key>' }, // fill in
  headers: 
   { 'Postman-Token': 'be00f55c-c71a-42c1-9430-27e123d72cf7',
     'cache-control': 'no-cache',
     'Content-Type': 'application/json' },
  body: { name: '<new_intent_name>' },  // fill in
  json: true };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});