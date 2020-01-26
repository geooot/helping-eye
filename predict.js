var request = require('request');
var requestpromise = require('request-promise');
var querystring = require('querystring');

// Analyze text
//
getPrediction = async () => {

    // YOUR-KEY - Language Understanding starter key
    var endpointKey = "";

    // YOUR-ENDPOINT Language Understanding endpoint URL, an example is westus2.api.cognitive.microsoft.com
    var endpoint = "YOUR-ENDPOINT";

    // Set the LUIS_APP_ID environment variable 
    // to df67dcdb-c37d-46af-88e1-8b97951ca1c2, which is the ID
    // of a public sample application.    
    var appId = "df67dcdb-c37d-46af-88e1-8b97951ca1c2";

    var utterance = "turn on all lights";

    // Create query string 
    var queryParams = {
        "show-all-intents": true,
        "verbose":  true,
        "query": utterance,
        "subscription-key": endpointKey
    }

    // append query string to endpoint URL
    var URI = `https://${endpoint}/luis/prediction/v3.0/apps/${appId}/slots/production/predict?${querystring.stringify(queryParams)}`

    // HTTP Request
    const response = await requestpromise(URI);

    // HTTP Response
    console.log(response);

}

// Pass an utterance to the sample LUIS app
getPrediction().then(()=>console.log("done")).catch((err)=>console.log(err));