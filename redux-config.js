import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { appStateReducer } from './redux/reducer';
import { createStore } from 'redux';

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    stateReconciler: autoMergeLevel2,
    blacklist: ['user', 'isSignedIn', 'requestData', 'services', 'pendingReview'],
};

const persistedReducer = persistReducer(persistConfig, appStateReducer);

export const store = createStore(persistedReducer);
export const persistor = persistStore(store);
