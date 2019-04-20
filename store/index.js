import { combineReducers } from 'redux';
import {
  authReducer,
  deviceReducer,
  settingsReducer,
  statusReducer
} from './reducer'

export const reducers = {
  auth: authReducer,
  device: deviceReducer,
  settings: settingsReducer,
  status: statusReducer,
};