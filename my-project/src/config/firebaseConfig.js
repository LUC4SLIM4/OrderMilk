import { initializeApp, getApps } from 'firebase/app';
import { getDatabase } from 'firebase/database';

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

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

database = getDatabase(app);

export { app, database };