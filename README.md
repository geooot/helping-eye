# helping-eye
Making the web easily acccessible through chat bots. Created in 24 hours at [tamuhack 2020](https://tamuhack.com/).

![helping-eye chrome extension](/helpingeyes.gif "helping-eye chrome extension")


## Inspiration

After using a speech to text interface, we realized it would be a cumbersome way for visually impaired people to browse the web. We decided to make a chatbot that could execute and interface with the web on behalf of the user and could be easily implemented by developers for their own sites.

## What it does

Our chrome extension-enabled bot gathers input from the user and uses machine learning and NLP to associate user input with actions that the bot can execute. The extension is also programmable for developers to customize it to each website, so they can add unique, higher level actions to improve their specific user experience. The program then executes the actions on the webpage and gives feedback to the user.

## How we built it

1. Chrome extension with interactive chatbot built in React
2. Natural Language Processing and Model Training of phrases using Azure’s Cognitive Science LUIS API
3. Automatically Creating LUIS Models using Node JS and YAML schema files

## Challenges we ran into

- Operating within a chrome extension 
- Training LUIS models 
- Using the programmatic API instead of pre-assigning actions

## Accomplishments that we are proud of
- We made something with the potential to positively impact the lives of those who are visually disabled
- Understanding how the LUIS API worked then abstracting it into a file format we needed to streamline making actions for other sites
- Developed a functional Chrome Extension which interacts with the web

## What we learned

- How to develop a Chrome Extension that controls the web
- Learning to work with Microsoft's Cognitive Services
- How to stay awake and productive for two days

## What's next for Helping-Eye

First, we would like implement text-to-speech methods to read our bot's messages to the user. In addition, we would like to develop higher level functionality for the chatbot, with deeper and more complex capabilities on a wide variety of sites. 

Because of this, we tried to design Helping-Eye in such a way that developers could add to its functionality in the future. A future for Helping-Eye or something as similar as an open source resource would be tremendously beneficial for visually impaired people, and everybody else.

## Authors
- George Thayamkery (@geooot)
- Anikait Sharma (@anikait627)
- Aditya Pethe (@aditya-pethe)
- Jon Waterman (@jonwaterman)