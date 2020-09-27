import React from 'react';
import ReactDOM from 'react-dom';
import {Auth} from "aws-amplify";
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

Auth.configure({
    region: 'us-east-1',
    userPoolId: '{{userPoolId}}',
    userPoolWebClientId: '{{userPoolWebClientId}}',
    cookieStorage: {
        domain: '{{cloudFroundId}}.cloudfront.net',
        expires: 5,
        secure: false
    },
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
