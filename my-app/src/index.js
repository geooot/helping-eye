import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App'

let a = setInterval(_ => {
    console.log("trying")
    let elem = document.getElementById('helping_eye_container');
    if (!elem) return;
    clearInterval(a);
    console.log("about to call reactDOM!!!")
    ReactDOM.render(<App />, document.getElementById('helping_eye_container'));
}, 150)


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA