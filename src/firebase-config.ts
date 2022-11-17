import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyADrP9shd3rEDI0j-4PjbAJ_-4uOgTkxek',
  authDomain: 'restauran-uit-storage.firebaseapp.com',
  projectId: 'restauran-uit-storage',
  storageBucket: 'restauran-uit-storage.appspot.com',
  messagingSenderId: '899194792073',
  appId: '1:899194792073:web:37dfe15b820f38b9d77e58',
  measurementId: 'G-CM7K9CBKPE',
};

export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
