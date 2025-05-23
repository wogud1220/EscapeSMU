import {initializeApp, getApps, getApp} from 'firebase/app';
import {
  initializeAuth,
  getReactNativePersistence,
  getAuth,
} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore'; // ✅ 추가
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDJUzQ33Wll6dkgiujYGWhXytJRrhEpOEA',
  authDomain: 'escapesmu.firebaseapp.com',
  projectId: 'escapesmu',
  storageBucket: 'escapesmu.appspot.com',
  messagingSenderId: '109058266640',
  appId: '1:109058266640:android:71bdef512fe0e8b0051c95',
};

let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
  console.log('🔥 Firebase initialized with auth');
} else {
  app = getApp();
}

const auth = getAuth(app); // 항상 동일한 인스턴스 사용
const db = getFirestore(app); // ✅ 추가
export {auth, db};
