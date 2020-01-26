var request = require("request");

var options = { method: 'POST',
  url: 'https://{endpoint_url}/luis/api/v2.0/apps/{appID}/versions/{versionID}/intents',
  qs: { 'subscription-key': '7ff2eb676c8640cf9416e0f7229f9f32' },
  headers: 
   { 'Postman-Token': 'be00f55c-c71a-42c1-9430-27e123d72cf7',
     'cache-control': 'no-cache',
     'Content-Type': 'application/json' },
  body: { name: '<new_intent_name>' },
  json: true };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});