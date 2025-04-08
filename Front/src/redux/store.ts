import { configureStore } from '@reduxjs/toolkit';
import { behavioralReducer } from './reducers/behavioral.reducer';

export const store = configureStore({
  reducer: {
    behavioral: behavioralReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
