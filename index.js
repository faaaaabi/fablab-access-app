/** @format */


import {YellowBox} from "react-native";

import {Navigation} from "react-native-navigation";
import Dashboard from './Components/Dashboard';
import Settings from "./Components/Settings";

// Redux
import {createStore, applyMiddleware} from "redux";
import {reducers} from "./store";
import {persistStore, persistCombineReducers} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { createWhitelistFilter } from 'redux-persist-transform-filter';
import {Provider} from "react-redux";
import thunk from "redux-thunk";

// Ignoring some unusefull warnings
console.ignoredYellowBox = ["Remote debugger"];
YellowBox.ignoreWarnings([
    "Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?",
    'Require cycle:',
]);


// Store & Persistance
const persistConfig = {
    key: 'root',
    storage,
    transforms: [
            createWhitelistFilter('settings', ['apiKey', 'host', 'deviceName', 'debugMode']),
    ],
    version: 1,
};

const persistedReducer = persistCombineReducers(persistConfig, reducers);
const store = createStore(persistedReducer, applyMiddleware(thunk));

Navigation.registerComponentWithRedux(`Dashboard`, () => Dashboard, Provider, store);
Navigation.registerComponentWithRedux(`SettingsScreen`, () => Settings, Provider, store);

Navigation.events().registerAppLaunchedListener(() => {
    persistStore(store, null, () => {
        Navigation.setRoot({
            root: {
                stack: {
                    children: [
                        {
                            component: {
                                options: {
                                    topBar: {
                                        visible: false,
                                        height: 0
                                    }
                                },
                                name: "Dashboard"
                            }
                        },
                    ]
                },
            }
        });
    });
});