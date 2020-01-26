// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });

const API_URL = "http://localhost:3000/api"


const bot = {
  sendMessage: (str) => {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {method: "newBotMessage", data: str});
    })
  }
}

//example of using a message handler from the inject scripts
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log("onMessage", request, sender);
    if (request.method == "newHumanMessage") {
      fetch(API_URL + "/app/domain/" + request["data"]["host"] + "/ask?q=" + encodeURIComponent(request["data"]["message"]))
        .then(res => res.json())
        .then(json => {
          console.log("json", json)
          let intent = json["topScoringIntent"] ? json["topScoringIntent"]["intent"] : null;
          if (!intent) return sendResponse({method: "newBotMessage", data: "Sorry! couldn't perform any action with that command"})
          let applicableAction = json["app"]["actions"].filter(items => items["name"] == intent)[0];
          let entities = json["entities"]
          let expectedProps = applicableAction["props"];

          if(Object.keys(expectedProps).length < entities.length) return sendResponse({method: "newBotMessage", data: "Sorry! couldn't perform any action with that command"});

          let props = {}
          for (let param of Object.keys(expectedProps)) {
            console.log(entities);
            props[param] = entities.filter(item => item.type.includes(expectedProps[param]))
          }  
          
          console.log("props", props)
          console.log(applicableAction["trigger"])

          chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {method: "evalTrigger", data: applicableAction["trigger"], props: props});
          })

          // chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          //   chrome.tabs.sendMessage(tabs[0].id, {method: "newBotMessage", data: applicableAction.name});
          // })
        })
    }
  }
);