/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import { Provider } from 'react-redux'
import { COLOR, Toolbar, ThemeContext, getTheme } from 'react-native-material-ui';
import NfcComponent from './Components/NfcComponent';
import DeviceControl from './Components/DeviceControl';

// Redux
import { createStore } from 'redux';
import reducer from './store/reducer'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { PersistGate } from 'redux-persist/integration/react';


// Store & Persistance
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['host', 'deviceName']
}

const persistedReducer = persistReducer(persistConfig, reducer);
const store = createStore(persistedReducer);
const persistor = persistStore(store);

// UI
const uiTheme = {
  palette: {
    primaryColor: COLOR.green500,
  },
  toolbar: {
    container: {
      height: 50,
    },
  },
};


type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeContext.Provider value={getTheme(uiTheme)} style={{flex: 1}}>
          <Toolbar
            leftElement="menu"
            centerElement="Fablab Control"
            searchable={{
            autoFocus: true,
            placeholder: 'Search',
            }}
          />
          <View style={{flexDirection: 'row', flex: 1}}>
            <DeviceControl/>
            <NfcComponent/>
          </View>
          </ThemeContext.Provider>
        </PersistGate>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});


