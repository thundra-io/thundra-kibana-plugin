import { combineReducers } from 'redux'
import counter from './counter';
import invocationCounts from './invocationCounts';
import timeSelector from './timeSelector';
import functionStats from './functionStats';
import functionList from './functions'

export default combineReducers({
  counter,
  timeSelector,
  invocationCounts,
  functionStats,
  functionList
});