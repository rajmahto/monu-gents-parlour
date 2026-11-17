import { initializeApp } from 'firebase/app';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDDrW5y1S5acnGq6UzSj8Q385Vo3g6hp_w",
  authDomain: "monu-gents-parlour.firebaseapp.com",
  projectId: "monu-gents-parlour",
  storageBucket: "monu-gents-parlour.firebasestorage.app",
  messagingSenderId: "826103787197",
  appId: "1:826103787197:web:bc01699960dd2b841d51d4",
  measurementId: "G-ELEPDXFQH9"
};

const app = initializeApp(firebaseConfig);

export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
});