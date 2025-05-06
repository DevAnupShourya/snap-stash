// import { configureStore } from '@reduxjs/toolkit';
// import userReducer from '@/store/userSlice';

// export const store = configureStore({
//     reducer: {
//         user: userReducer,
//         // taskForm: taskFormReducer,
//     },
// })

// // Infer the `RootState` and `AppDispatch` types from the store itself
// export type RootState = ReturnType<typeof store.getState>
// // Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
// export type AppDispatch = typeof store.dispatch


// store.ts - Updated with Redux Persist
import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

import userReducer from '@/store/userSlice';

// Configure persist options
const persistConfig = {
    key: 'snapstash', // key for localStorage
    version: 1,
    storage,
    // Only persist the user reducer
    whitelist: ['user'],
    // Or alternatively blacklist specific reducers
    // blacklist: ['tasks'], // Don't persist tasks state
};

// Combine your reducers
const rootReducer = combineReducers({
    user: userReducer,
});

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store with persisted reducer
export const store = configureStore({
    reducer: persistedReducer,
    // This middleware handles Redux Persist actions without creating serialization errors
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

// Create persistor
export const persistor = persistStore(store);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
