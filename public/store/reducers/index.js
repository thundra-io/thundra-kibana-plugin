import { combineReducers } from 'redux'
import counter from './counter';
import invocationCounts from './invocationCounts';
import timeSelector from './timeSelector';

export default combineReducers({
  counter,
  invocationCounts,
  timeSelector
});