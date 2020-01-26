//  Jon Waterman
//  purpose: returns the results with a given query
//  inputs: query
//  output: top scoring intent & accuracy rate, all other intents, entities detected

var request = require("request");

var options = { method: 'GET',
  url: 'https://{endpoint_url}/luis/v2.0/apps/{appID}', 
  //  switch out endpoint_url and appID
  qs: 
   { verbose: 'true',
     timezoneOffset: '-360',
     'subscription-key': '<subscription_key>',  // fill in
     q: '<query>' },  // fill in
  headers: 
   { 'Postman-Token': '896d539b-81b0-46f0-be0c-660061367b35',
     'cache-control': 'no-cache' } };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
