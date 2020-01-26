//  Jon Waterman
//  Inputs: query
//  Outputs: JSON sent back by API

var request = require("request");
var readlineSync = require('readline-sync');
var query = readlineSync.question('Query: ')    // takes query input

const endpoint = "th2020-practice.cognitiveservices.azure.com"
const appID = "dc41dd7b-dfdc-4ab4-b196-9776f536bfab"
const subscription_key = "7ff2eb676c8640cf9416e0f7229f9f32"

var options = { method: 'GET',
  url: 'https://' + endpoint + '/luis/v2.0/apps/' + appID, 
  qs: 
   { verbose: 'true',
     timezoneOffset: '-360',
     'subscription-key': subscription_key,
     q: query },
  headers: 
   { 'Postman-Token': '896d539b-81b0-46f0-be0c-660061367b35',
     'cache-control': 'no-cache' } };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body)

  //let jsonResponse = JSON.parse(body)

  // outputs top scoring intent and entities
//   console.log(jsonResponse["topScoringIntent"])
//   console.log(jsonResponse["query:"])
});




