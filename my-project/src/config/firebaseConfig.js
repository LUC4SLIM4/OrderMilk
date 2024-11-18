import { initializeApp, getApps } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyDw5yfGNc-3Y4Kg0aFx-67Ij1DuWboNWGk",
  authDomain: "ordermilk-7e341.firebaseapp.com",
  projectId: "ordermilk-7e341",
  storageBucket: "ordermilk-7e341.appspot.com",
  messagingSenderId: "483544615766",
  appId: "1:483544615766:web:27250f2ad1237276d364f7",
  measurementId: "G-6C83XT2Z5K",
  databaseURL: "https://ordermilk-7e341-default-rtdb.firebaseio.com"
};

let app;
let database;
let auth;

// Inicializa o Firebase App, Database e Auth com persistência
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  
  // Configurar a persistência da autenticação com AsyncStorage
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} else {
  app = getApps()[0];
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

database = getDatabase(app);

export { app, database, auth };
