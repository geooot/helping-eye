//  Jon Waterman
//  Inputs: Name and description of application
//  Outputs: appID

var request = require("request");
var readlineSync = require('readline-sync');

var app_name = readlineSync.question('App Name: ')
var app_description = readlineSync.question('App Description: ') 

const endpoint = "th2020-practice.cognitiveservices.azure.com"
const subscription_key = "7ff2eb676c8640cf9416e0f7229f9f32"

var options = { method: 'POST',
  url: 'https://' + endpoint + '/luis/api/v2.0/apps/',
  qs: { 'subscription-key': subscription_key },
  headers: 
   { 'Postman-Token': 'e7346b89-bdc4-497f-afd8-382ea871b85d',
     'cache-control': 'no-cache',
     'Content-Type': 'application/json' },
  body: 
   { name: app_name,
     description: app_description,
     culture: 'en-us',
     tokenizerVersion: '1.0.0',
     usageScenario: 'IoT',
     domain: 'Comics',
     initialVersionId: '1.0' },
  json: true };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
