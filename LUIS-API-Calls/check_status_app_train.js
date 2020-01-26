//  Jon Waterman
//  Purpose: Checks status of application training
//  Input: appID
//  Output: training status

var request = require("request");
const appID = "0674d889-911a-44a3-995f-41af42950f14"
const versionID = "0.1"

const endpoint = "th2020-practice.cognitiveservices.azure.com"
const subscription_key = "7ff2eb676c8640cf9416e0f7229f9f32"
var success = true


var request = require("request");

var options = { method: 'GET',
  url: 'https://' + endpoint + '/luis/api/v2.0/apps/' + appID + '/versions/' + versionID + '/train',
  qs: { 'subscription-key': subscription_key },
  headers: 
   { 'Postman-Token': 'fd61a7aa-a403-47b8-a443-9fad9ee73c50',
     'cache-control': 'no-cache' } };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  let jsonResponse = JSON.parse(body)

for(let thing of jsonResponse) {
    if(thing["details"]["status"] != 'UpToDate' && thing["details"]["status"] != 'Success')
    {
        success = false
    }
}

if (success == false) {console.log("TrainingInProgress")}
else {console.log("UpToDate")}

});

