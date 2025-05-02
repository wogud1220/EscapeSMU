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
import CustomText from '../CustomText';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

const {width, height} = Dimensions.get('window');

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const Main = () => {
  const navigation = useNavigation<NavigationProp>();
  const [userEmail, setUserEmail] = useState<string | null>(null);

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

  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: scale.value}],
    };
  });

  const handleStartPress = () => {
    scale.value = withSpring(1.2, {}, () => {
      scale.value = withSpring(1, {}, () => {
        runOnJS(handleNavigate)();
      });
    });
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUserEmail(null);
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  };

  const handleNavigate = () => {
    navigation.navigate('StageFinal');
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
          <View style={styles.bottomButtonContainer}>
            <AnimatedTouchableOpacity
              onPress={handleStartPress}
              style={[styles.button, animatedStyle]}
              activeOpacity={0.7}>
              <CustomText style={{fontSize: 25, color: 'white'}}>
                시작하기
              </CustomText>
            </AnimatedTouchableOpacity>

            <TouchableOpacity
              onPress={handleLogout}
              style={styles.logoutButton}
              activeOpacity={0.7}>
              <CustomText style={{fontSize: 25, color: 'white'}}>
                로그아웃
              </CustomText>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <TouchableOpacity
              onPress={handleLoginNavigate}
              style={styles.loginButton}
              activeOpacity={0.7}>
              <CustomText style={styles.buttonText}>로그인</CustomText>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSignInNavigate}
              style={styles.SignInButton}
              activeOpacity={0.7}>
              <CustomText style={styles.buttonText}>회원가입</CustomText>
            </TouchableOpacity>

            <AnimatedTouchableOpacity
              onPress={handleStartPress}
              style={[styles.button, animatedStyle]}
              activeOpacity={0.7}>
              <CustomText style={{fontSize: 30, color: 'white'}}>
                시작하기
              </CustomText>
            </AnimatedTouchableOpacity>
          </>
        )}
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
    width: width * 0.6,
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
  button: {
    backgroundColor: 'rgba(0, 0, 255, 0.6)',
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.07,
    borderRadius: width * 0.03,
    marginRight: width * 0.03, // 버튼 사이 띄우기
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 165, 0, 0.8)',
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.07,
    borderRadius: width * 0.03,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: width * 0.045,
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
  bottomButtonContainer: {
    position: 'absolute',
    bottom: height * 0.05,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Main;
