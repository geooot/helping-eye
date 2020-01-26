//  Jon Waterman
//  purpose: adds an intent to the app
//  inputs: name of intent
//  outputs: ID of new query

var request = require("request");
var readlineSync = require('readline-sync');

var intent_name = readlineSync.question('Intent Name: ') 

const endpoint = "th2020-practice.cognitiveservices.azure.com"
const appID = "dc41dd7b-dfdc-4ab4-b196-9776f536bfab"
const versionID = "0.1"
const subscription_key = "7ff2eb676c8640cf9416e0f7229f9f32"

var options = { method: 'POST',
  url: 'https://' + endpoint + '/luis/api/v2.0/apps/'+ appID + '/versions/' + versionID +'/intents',
  qs: { 'subscription-key': subscription_key },
  headers: 
   { 'Postman-Token': 'be00f55c-c71a-42c1-9430-27e123d72cf7',
     'cache-control': 'no-cache',
     'Content-Type': 'application/json' },
  body: { name: intent_name },
  json: true };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});