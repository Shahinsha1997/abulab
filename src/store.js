import { combineReducers, createStore  } from 'redux';
import { getAllReducers } from './reducers/appreducer';




// Combine the reducers
const combinedReducer = combineReducers(getAllReducers());
  
// Create the store
export const store = createStore(combinedReducer);