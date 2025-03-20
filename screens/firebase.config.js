import {initializeApp, getApps, getApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
const firebaseConfig = {
  apiKey: 'AIzaSyDJUzQ33Wll6dkgiujYGWhXytJRrhEpOEA',
  authDomain: 'escapesmu.firebaseapp.com',
  projectId: 'escapesmu',
  storageBucket: 'escapesmu.appspot.com',
  messagingSenderId: '109058266640',
  appId: '1:109058266640:android:71bdef512fe0e8b0051c95',
};

// Firebase 앱이 초기화되었는지 확인 후 실행
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Firebase 인증 객체 가져오기
const auth = getAuth(app);

export {auth};

// import {initializeApp, getApps, getApp} from 'firebase/app';
// import {
//   getAuth,
//   initializeAuth,
//   getReactNativePersistence,
// } from 'firebase/auth/react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// // 🔥 Firebase 설정
// const firebaseConfig = {
//   apiKey: 'AIzaSyDJUzQ33Wll6dkgiujYGWhXytJRrhEpOEA',
//   authDomain: 'escapesmu.firebaseapp.com',
//   projectId: 'escapesmu',
//   storageBucket: 'escapesmu.appspot.com',
//   messagingSenderId: '109058266640',
//   appId: '1:109058266640:android:71bdef512fe0e8b0051c95',
// };

// // ✅ Firebase 앱 초기화
// const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// // ✅ Firebase Auth 객체 생성 (AsyncStorage 제공)
// const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(AsyncStorage),
// });

// export {auth};
