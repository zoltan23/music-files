import React from 'react';
import ReactDOM from 'react-dom';
//import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import  reducer  from './components/reducers/auth'
import userinfo from './components/reducers/userinfo'

const INITIAL_STATE = {
    isLoggedIn: false,
    firstName: '',
    lastName: ''
}

const store = createStore(userinfo, INITIAL_STATE)

window.store = store;
//window.addArticle = addArticle;

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
