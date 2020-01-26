require('dotenv').config();
const express = require('express');
const app = express();
const yaml = require('js-yaml');
const fetch = require('node-fetch');
const admin = require('firebase-admin');

const serviceAccount = require("./adminsdk.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://helping-eye-87c80.firebaseio.com"
});

const LUIS_URL = `https://${process.env.LUIS_HOST}/luis/api/v2.0`


const createAppOnLuis = (appName) => {
    return fetch(LUIS_URL + "/apps?verbose=true&timezoneOffset=0&subscription-key=026a88949be84639a279d9afa5dc3e46", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': process.env.LUIS_SUBSCRIPTION_KEY
        },
        body: JSON.stringify({
            name: appName,
            description: "",
            culture: 'en-us',
            tokenizerVersion: '1.0.0',
            usageScenario: 'IoT',
            domain: 'Comics',
            initialVersionId: '1.0'
        })
    }).then(res => res.json());
}

const addEntity = (appId, entityName) => {
    return fetch(LUIS_URL + "/apps/"+ appId + '/versions/1.0/entities?subscription-key=' + process.env.LUIS_SUBSCRIPTION_KEY, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: entityName
        })
    }).then(res => res.json());
}

const addIntentsToLuisApp = (appId, intents) => {
    let promises = intents.map((intent) => {
        return fetch(LUIS_URL + "/apps/"+ appId + '/versions/1.0/intents?subscription-key=' + process.env.LUIS_SUBSCRIPTION_KEY, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: intent["name"] })
        }).then(res => res.json()).then(json => console.log(json));
    });
    return Promise.all(promises);
}

app.use(express.text({ type: 'text/yaml' }));

// respond with "hello world" when a GET request is made to the homepage
app.post('/api/app/create', async (req, res) => {
    const json = yaml.load(req.body);

    try {
        console.log("createAppOnLuis");
        let appId = await createAppOnLuis(json["name"]);
        if (appId["error"]) return res.json({ success: false, e: appId });
        console.log(appId);
        console.log("addIntentsToLuisApp")
        await addIntentsToLuisApp(appId, json["actions"]);
        console.log("addEntity");
        let entRes = await addEntity(appId, "Simple");
        console.log(entRes)
        console.log("firestoreAdd");
        await admin.firestore().collection("apps").add({luisAppId: appId, ...json});
        
        return res.json({ success: true });
    } catch(e) {
        console.error(e);
        res.json({ e: e.toString(), success: false })
    }
});

app.listen(3000, () => console.log(`Example app listening on port ${3000}!`))