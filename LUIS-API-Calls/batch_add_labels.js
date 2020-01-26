var request = require("request");

var options = { method: 'POST',
  url: 'https://{endpoint}/luis/api/v2.0/apps/{appId}/versions/{versionId}/examples',
  headers: 
   { 'Postman-Token': '46a2010e-025a-488b-b1dc-73c8056ada1b',
     'cache-control': 'no-cache',
     'Content-Type': 'application/json' },
  body: 
   [ { text: 'Book me a flight from Cairo to Redmond next Thursday',
       intentName: 'BookFlight',
       entityLabels: 
        [ { entityName: 'Location::From',
            startCharIndex: 22,
            endCharIndex: 26 },
          { entityName: 'Location::To',
            startCharIndex: 31,
            endCharIndex: 37 } ] },
     { text: 'What\'s the weather like in Seattle?',
       intentName: 'GetWeather',
       entityLabels: [ { entityName: 'Location', startCharIndex: 27, endCharIndex: 33 } ] } ],
  json: true };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
