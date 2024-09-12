import * as React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import axios from "axios";
import { HashRouter } from 'react-router-dom';
import App from './App.jsx';
import store from './redux/store.js';
import './index.css';


axios.defaults.baseURL = "http://localhost:3001/";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <HashRouter>
            <App/>
        </HashRouter>
    </Provider>
);