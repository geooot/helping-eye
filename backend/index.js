require('dotenv').config();
const express = require('express');
const app = express();
const yaml = require('js-yaml');
const fetch = require('node-fetch');
const cors = require('cors')
const admin = require('firebase-admin');

const serviceAccount = require("./adminsdk.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://helping-eye-87c80.firebaseio.com"
});

const LUIS_URL = `https://${process.env.LUIS_HOST}/luis/api/v2.0`
const LUIS_CLIENT_URL = `https://${process.env.LUIS_HOST}/luis/v2.0`


const createAppOnLuis = (appName) => {
    return fetch(LUIS_URL + "/apps?verbose=true&timezoneOffset=0&subscription-key=" + process.env.LUIS_SUBSCRIPTION_KEY, {
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


const createUtterances = (appId, intentName, examples, props) => {
    let utterances = []
    for (let i = 0; i < examples.length; i++) {
        var example = examples[i];
        let entityLabels = []
        while (example.indexOf("[") != -1) {
            let start = example.indexOf("[")
            let end = example.indexOf("]")
            let part = example.substring(start, end + 1).replace("[", "").replace("]", "");
            let keyVal = part.split(":");

            let exampleVal = JSON.parse(keyVal[1]);
            let entityName = props[keyVal[0]];

            example = example.replace("[" + part + "]", exampleVal);

            entityLabels.push({
                entityName: entityName,
                startCharIndex: start,
                endCharIndex: start + exampleVal.length
            })
        }
        let label = {
            text: example,
            entityLabels,
            intentName
        }
        utterances.push(label);
    }
    return utterances;
}

const pushUtterances = (appId, utterances) => {
    return fetch(LUIS_URL + "/apps/" + appId + "/versions/1.0/examples?subscription-key=" + process.env.LUIS_SUBSCRIPTION_KEY, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(utterances)
    }).then(res => res.json());
}

const addPrebuiltEntities = (appId) => {
    return fetch(LUIS_URL + "/apps/" + appId + '/versions/1.0/prebuilts?subscription-key=' + process.env.LUIS_SUBSCRIPTION_KEY, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(["ordinalV2", "datetimeV2", "email", "phonenumber", "money"])
    }).then(res => res.json());
}

const addEntity = (appId, entityName) => {
    return fetch(LUIS_URL + "/apps/" + appId + '/versions/1.0/entities?subscription-key=' + process.env.LUIS_SUBSCRIPTION_KEY, {
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
        return fetch(LUIS_URL + "/apps/" + appId + '/versions/1.0/intents?subscription-key=' + process.env.LUIS_SUBSCRIPTION_KEY, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: intent["name"] })
        }).then(res => res.json()).then(json => console.log(json));
    });
    return Promise.all(promises);
}

const sleep = (ms) => {
    return new Promise((res, rej) => {
        setTimeout(_ => {
            res();
        }, ms);
    })
}

const setAppToTrain = (appId) => {
    return fetch(LUIS_URL + "/apps/" + appId + '/versions/1.0/train?subscription-key=' + process.env.LUIS_SUBSCRIPTION_KEY, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': process.env.LUIS_SUBSCRIPTION_KEY
        }
    }).then(res => res.json());
}

const isAppFinishedTraining = (appId) => {
    return fetch(LUIS_URL + "/apps/" + appId + '/versions/1.0/train?subscription-key=' + process.env.LUIS_SUBSCRIPTION_KEY).then(res => res.json()).then(json => {
        if (json["error"]) return false;
        var success = true;
        console.log(json)
        for (let thing of json) {
            if (thing["details"]["status"] != 'UpToDate' && thing["details"]["status"] != 'Success') {
                success = false;
                break;
            }
        }
        return success;
    })
}

app.use(cors())
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
        await sleep(1000);
        console.log("addEntity");
        let entRes = await addEntity(appId, "Simple");
        console.log(entRes)
        await sleep(500);
        console.log("addPrebuiltEntities")
        let preRes = await addPrebuiltEntities(appId);
        console.log(preRes);
        console.log("addUtterances");
        let utterances = json["actions"].map(action => {
            return createUtterances(appId, action["name"], action["examples"], action["props"]);
        }).flat();
        console.log(JSON.stringify(utterances));
        let utterRes = await pushUtterances(appId, utterances);
        let trainRes = await setAppToTrain(appId);
        console.log(trainRes);
        console.log("firestoreAdd");
        await admin.firestore().collection("apps").add({ luisAppId: appId, status: "TRAINING", ...json });

        return res.json({ success: true });
    } catch (e) {
        console.error(e);
        res.json({ e: e.toString(), success: false })
    }
});

const getAppByDomain = (domain) => {
    return admin.firestore().collection("apps").where("hosts", "array-contains", domain).get().then(qs => {
        if (qs.empty) return null;
        let data = qs.docs[0].data();
        return { _id: qs.docs[0].id, ...data };
    })
}

app.get('/api/app/domain/:domain', async (req, res) => {
    let domain = req.params.domain;
    let app = await getAppByDomain(domain);

    return res.json(app);
})

const askLuis = (query, appId) => {
    return fetch(LUIS_CLIENT_URL + "/apps/" + appId + "?q=" + encodeURIComponent(query) + "&subscription-key=" + process.env.LUIS_SUBSCRIPTION_KEY + "&verbose=true&timezoneOffset=-360").then(res => res.json())
}

app.get('/api/app/id/:id/ask', async (req, res) => {
    let id = req.params.id;
    let q = req.query.q;
    if (!q) return res.json({ success: false })
    let app = await admin.firestore().collection("apps").doc(id).get();
    let data = app.data();
    if (!data) return res.json({ success: false });
    let respon = await askLuis(q, data["luisAppId"]);

    return res.json({ success: true, ...respon, app: data });
})

app.get('/api/app/domain/:domain/ask', async (req, res) => {
    let q = req.query.q;
    let domain = req.params.domain;
    let data = await getAppByDomain(domain);
    if (!data) return res.json({ success: false });
    let respon = await askLuis(q, data["luisAppId"]);

    return res.json({ success: true, ...respon, app: data });
})

const publishLuisApp = (appId) => {
    return fetch(LUIS_URL + "/apps/" + appId + "/publish?subscription-key=" + process.env.LUIS_SUBSCRIPTION_KEY, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(
            {
                versionId: "1.0",
                isStaging: false,
                directVersionPublish: false
            }
        )
    }).then(res => res.json()).then(json => console.log(json))
}

const doChecks = () => {
    return admin.firestore().collection("apps").where("status", "==", "TRAINING").get().then(async qs => {
        let docs = []
        qs.forEach(async doc => {
            let app = doc.data();
            docs.push({ _id: doc.id, ...app });
        })
        let promises = [];
        for (let app of docs) {
            let isFinished = await isAppFinishedTraining(app["luisAppId"]);
            if (isFinished) {
                promises.push(sleep(500).then(publishLuisApp(app["luisAppId"])))
                promises.push(admin.firestore().collection("apps").doc(app._id).update({ status: "TRAINED" }));
            }
        }
        return Promise.all(promises)
    })
}

app.get('/api/cron/check', async (req, res) => {
    doChecks().then(_ => {
        return res.json({ success: true });
    })
});


if (process.env.DEV == "true") {
    setInterval(_ => {
        doChecks().then(_ => {
            console.log("checked");
        })
    }, 10000)
}


app.listen(3000, () => console.log(`Example app listening on port ${3000}!`))