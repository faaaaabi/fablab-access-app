import { combineReducers } from 'redux';
import { 
  authReducer,
  deviceReducer,
  settingsReducer,
  statusReducer
} from './reducer'

export const rootReducer = combineReducers({
  auth: authReducer,
  device: deviceReducer,
  settings: settingsReducer,
  status: statusReducer,
});