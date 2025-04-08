import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { behavioralReducer } from './reducers/behavioral.reducer';

const rootReducer = combineReducers({
  behavioral: behavioralReducer
  // Add other reducers here
});

export type RootState = ReturnType<typeof rootReducer>;

export const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);