import React from 'react';
import ReactDOM from 'react-dom';
//import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import  authReducer  from './components/reducers/auth'
import userInfoReducer from './components/reducers/userinfo'

const INITIAL_STATE = {
    isLoggedIn: false,
    email: '',
    firstName: '',
    lastName: ''   
}

const rootReducer = combineReducers({
    authReducer,
    userInfoReducer
})

const store = createStore(rootReducer, INITIAL_STATE)

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
