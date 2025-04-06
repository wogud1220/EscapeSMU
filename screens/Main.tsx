// import React, {useEffect, useState} from 'react';
// import {
//   View,
//   Text,
//   ImageBackground,
//   StyleSheet,
//   TouchableOpacity,
//   Dimensions,
//   Image,
// } from 'react-native';
// import {NativeStackNavigationProp} from '@react-navigation/native-stack';
// import {useNavigation} from '@react-navigation/native';
// import {RootStackParamList} from '../App';
// import {
//   firebase,
//   onAuthStateChanged,
//   signOut,
// } from '@react-native-firebase/auth'; // ✅ Firebase Auth 추가
// import {auth} from './firebase.config'; // ✅ 상대 경로 확인!

// const {width, height} = Dimensions.get('window');

// type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

// const Main = () => {
//   const navigation = useNavigation<NavigationProp>();
//   const [userEmail, setUserEmail] = useState<string | null>(null);

//   // ✅ 로그아웃 기능 추가
//   const handleLogout = async () => {
//     try {
//       await auth.signOut();
//       setUserEmail(null);
//     } catch (error) {
//       console.error('로그아웃 오류:', error);
//     }
//   };

//   // ✅ Stage 목록 보기 이동
//   const handleNavigate = () => {
//     navigation.navigate('StageList');
//   };

//   // ✅ 로그인 화면으로 이동하는 함수
//   const handleLoginNavigate = () => {
//     navigation.navigate('LogIn');
//   };

//   // ✅ 회원가입 화면으로 이동하는 함수
//   const handleSignInNavigate = () => {
//     navigation.navigate('SignIn');
//   };

//   return (
//     <View style={styles.container}>
//       {/* ✅ 이미지 배경 설정 */}
//       <ImageBackground
//         source={require('../assets/main.png')}
//         style={styles.image}
//         resizeMode="cover">
//         {/* ✅ 메인 타이틀 이미지 추가 */}
//         <Image
//           source={require('../assets/main_title.png')}
//           style={styles.titleImage}
//           resizeMode="contain"
//         />

//         {/* ✅ 로그인 상태에 따라 UI 변경 */}
//         {userEmail ? (
//           <>
//             {/* ✅ 로그인된 사용자 이메일 표시 */}
//             <Text
//               style={styles.userText}>{`로그인된 사용자: ${userEmail}`}</Text>

//             {/* ✅ 로그아웃 버튼 */}
//             <TouchableOpacity
//               onPress={handleLogout}
//               style={styles.logoutButton}
//               activeOpacity={0.7}>
//               <Text style={styles.buttonText}>로그아웃</Text>
//             </TouchableOpacity>
//           </>
//         ) : (
//           <>
//             {/* ✅ 로그인 버튼 추가 */}
//             <TouchableOpacity
//               onPress={handleLoginNavigate}
//               style={styles.loginButton}
//               activeOpacity={0.7}>
//               <Text style={styles.buttonText}>로그인</Text>
//             </TouchableOpacity>

//             {/* ✅ 회원가입 버튼 추가 */}
//             <TouchableOpacity
//               onPress={handleSignInNavigate}
//               style={styles.SignInButton}
//               activeOpacity={0.7}>
//               <Text style={styles.buttonText}>회원가입</Text>
//             </TouchableOpacity>
//           </>
//         )}

//         {/* ✅ Stage 목록 보기 버튼 */}
//         <TouchableOpacity
//           onPress={handleNavigate}
//           style={styles.button}
//           activeOpacity={0.7}>
//           <Text style={styles.buttonText}>Stage 목록 보기</Text>
//         </TouchableOpacity>
//       </ImageBackground>
//     </View>
//   );
// };

// // ✅ 스타일 정의
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F5E6C4',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   image: {
//     width: width,
//     height: height * 0.9,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: width * 0.05,
//     overflow: 'hidden',
//   },
//   titleImage: {
//     position: 'absolute',
//     top: height * 0.23,
//     width: width * 1.0,
//     height: height * 0.15,
//   },
//   loginButton: {
//     position: 'absolute',
//     top: height * 0.1,
//     right: width * 0.05,
//     backgroundColor: 'rgba(255, 0, 0, 0.6)',
//     paddingVertical: height * 0.015,
//     paddingHorizontal: width * 0.08,
//     borderRadius: width * 0.03,
//   },
//   SignInButton: {
//     position: 'absolute',
//     top: height * 0.1,
//     left: width * 0.05,
//     backgroundColor: 'rgba(0, 255, 0, 0.6)',
//     paddingVertical: height * 0.015,
//     paddingHorizontal: width * 0.08,
//     borderRadius: width * 0.03,
//   },
//   logoutButton: {
//     position: 'absolute',
//     top: height * 0.1,
//     backgroundColor: 'rgba(255, 165, 0, 0.8)', // 🟠 오렌지 색 (로그아웃 버튼)
//     paddingVertical: height * 0.015,
//     paddingHorizontal: width * 0.1,
//     borderRadius: width * 0.03,
//   },
//   button: {
//     position: 'absolute',
//     bottom: height * 0.05,
//     backgroundColor: 'rgba(0, 0, 255, 0.6)',
//     paddingVertical: height * 0.02,
//     paddingHorizontal: width * 0.1,
//     borderRadius: width * 0.03,
//   },
//   buttonText: {
//     color: '#FFFFFF',
//     fontSize: width * 0.045,
//     fontWeight: 'bold',
//   },
//   userText: {
//     position: 'absolute',
//     bottom: height * 0.12, // 로그인 상태 표시 위치 조정
//     color: '#000',
//     fontSize: width * 0.04,
//     fontWeight: 'bold',
//     backgroundColor: 'rgba(255, 255, 255, 0.8)',
//     padding: 10,
//     borderRadius: 5,
//   },
// });

// export default Main;

import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../App';
import {onAuthStateChanged, signOut} from 'firebase/auth';
import {auth} from './firebase.config';

const {width, height} = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

const Main = () => {
  const navigation = useNavigation<NavigationProp>();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // 사용자 로그인 상태 감지
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        setUserEmail(user.email);
        console.log('✅ 로그인 유지됨:', user.email);
      } else {
        setUserEmail(null);
      }
    });
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUserEmail(null);
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  };

  const handleNavigate = () => {
    navigation.navigate('Stage5Camera');
  };

  const handleLoginNavigate = () => {
    navigation.navigate('LogIn');
  };

  const handleSignInNavigate = () => {
    navigation.navigate('SignIn');
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/main.png')}
        style={styles.image}
        resizeMode="cover">
        <Image
          source={require('../assets/main_title.png')}
          style={styles.titleImage}
          resizeMode="contain"
        />

        {userEmail ? (
          <>
            <Text
              style={styles.userText}>{`로그인된 사용자: ${userEmail}`}</Text>
            <TouchableOpacity
              onPress={handleLogout}
              style={styles.logoutButton}
              activeOpacity={0.7}>
              <Text style={styles.buttonText}>로그아웃</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              onPress={handleLoginNavigate}
              style={styles.loginButton}
              activeOpacity={0.7}>
              <Text style={styles.buttonText}>로그인</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSignInNavigate}
              style={styles.SignInButton}
              activeOpacity={0.7}>
              <Text style={styles.buttonText}>회원가입</Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity
          onPress={handleNavigate}
          style={styles.button}
          activeOpacity={0.7}>
          <Text style={styles.buttonText}>Stage 목록 보기</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5E6C4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: width,
    height: height * 0.9,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: width * 0.05,
    overflow: 'hidden',
  },
  titleImage: {
    position: 'absolute',
    top: height * 0.23,
    width: width * 1.0,
    height: height * 0.15,
  },
  loginButton: {
    position: 'absolute',
    top: height * 0.1,
    right: width * 0.05,
    backgroundColor: 'rgba(255, 0, 0, 0.6)',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.08,
    borderRadius: width * 0.03,
  },
  SignInButton: {
    position: 'absolute',
    top: height * 0.1,
    left: width * 0.05,
    backgroundColor: 'rgba(0, 255, 0, 0.6)',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.08,
    borderRadius: width * 0.03,
  },
  logoutButton: {
    position: 'absolute',
    top: height * 0.1,
    backgroundColor: 'rgba(255, 165, 0, 0.8)',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.1,
    borderRadius: width * 0.03,
  },
  button: {
    position: 'absolute',
    bottom: height * 0.05,
    backgroundColor: 'rgba(0, 0, 255, 0.6)',
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.1,
    borderRadius: width * 0.03,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  userText: {
    position: 'absolute',
    bottom: height * 0.12,
    color: '#000',
    fontSize: width * 0.04,
    fontWeight: 'bold',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 5,
  },
});

export default Main;
