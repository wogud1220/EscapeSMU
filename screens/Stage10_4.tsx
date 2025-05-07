//학생회관 편의시설 퀴즈!

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Alert,
  BackHandler,
  
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import { useCallback } from 'react';
import {RootStackParamList} from '../App';
import {useRoute, RouteProp} from '@react-navigation/native';
import {incrementStageAttempt} from '../utils/incrementStageAttempt';
import {onAuthStateChanged} from 'firebase/auth';
import {auth} from './firebase.config';
import {updateStageData} from '../utils/updateStageData';
import CustomText from '../CustomText';

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Stage10_4'
>;

const {width, height} = Dimensions.get('window');

const options = [
  {label: '기념품점', value: 1},
  {label: '안경점', value: 2},
  {label: '미용실', value: 3},
  {label: '우체국', value: 4},
];

const Stage10_4 = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<RootStackParamList, 'Stage10_4'>>();
  const {college, department} = route.params || {};
  const [disabled, setDisabled] = useState(false); // ✅ 버튼 활성화 상태
  const [countdown, setCountdown] = useState<number | null>(null); // ✅ 남은 시간 상태
  const [userId, setUserId] = useState('');
  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => true
      );
      
      return () => backHandler.remove();
    }, [])
  );

  // ✅ Firebase 인증 처리 useEffect
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        setUserId(user.uid);
      }
    });
    return unsubscribe;
  }, []);

  // ✅ 카운트다운 처리 useEffect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown !== null) {
      timer = setInterval(() => {
        setCountdown(prev => (prev !== null ? prev - 1 : null));
      }, 1000);

      if (countdown === 0) {
        clearInterval(timer);
        setDisabled(false);
        setCountdown(null);
      }
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleMapPress = () => {
    navigation.navigate('Map');
  };

  const handleOptionPress = async (value: number) => {
    if (disabled) return;

    if (value === 4) {
      try {
        await updateStageData(userId, college, 'Stage10_5');
      } catch (err) {
        console.error('🔥 updateStageData error:', err);
      }
      Alert.alert('정답입니다!', '다음 스테이지로 이동합니다.', [
        {
          text: '확인',
          onPress: () =>
            navigation.navigate('Stage10_5', {college, department}),
        },
      ]);
    } else {
      incrementStageAttempt(userId, college); // ✅ 오답 시 시도 횟수 증가
      Alert.alert('오답입니다.', '5분 뒤에 다시 시도해 보세요!');

      // ✅ 5분(300초) 동안 버튼 비활성화 + 타이머 시작
      setDisabled(true);
      setCountdown(300); // 180초 (3분)
    }
  };

  const handleHomePress = () => {
    navigation.navigate('Main');
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/main.png')}
        style={styles.image}
        resizeMode="cover">
        <View style={styles.overlay} />

        {/* 지도 버튼 */}
        <TouchableOpacity onPress={handleMapPress} style={styles.mapButton}>
          <Image
            source={require('../assets/map.png')}
            style={styles.mapImage}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* 홈 버튼 */}
        <TouchableOpacity onPress={handleHomePress} style={styles.backButton}>
          <Image
            source={require('../assets/home.png')}
            style={styles.backImage}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* 흰색 박스 */}
        <View style={styles.box}>
          <CustomText style={styles.text}>
            학생회관에는 식당 뿐만 아니라, 다양한 편의시설도 존재하고 있어.
            그렇다면 다음 보기 중 학생회관에 존재하지{' '}
            <CustomText style={styles.highlight}>않는</CustomText> 시설을 골라봐!
          </CustomText>

          {/* 서브텍스트 추가 */}
          <CustomText style={styles.subText}>
            서점은 2025년 1학기에 없어졌어... {'\n'}
            {'\n'}틀릴 시에는 다시 입력하기까지{' '}
            <Text style={styles.highlight}>5분</Text>을 기다려야해... 신중하자!
          </CustomText>

          {/* ✅ 타이머 표시 */}
          {countdown !== null && (
            <CustomText style={styles.timerText}>
              {`다시 시도 가능까지: ${Math.floor(countdown / 60)}:${(
                countdown % 60
              )
                .toString()
                .padStart(2, '0')}`}
            </CustomText>
          )}

          {/* 버튼 생성 */}
          <View style={styles.buttonContainer}>
            {options.map(option => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionButton,
                  disabled && styles.disabledButton, // ✅ 비활성화 시 스타일 적용
                ]}
                onPress={() => handleOptionPress(option.value)}
                disabled={disabled}>
                <CustomText style={styles.optionText}>{option.label}</CustomText>
              </TouchableOpacity>
            ))}
          </View>
        </View>
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
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  box: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    marginTop: height * 0.12,
    width: width * 0.85,
    height: height * 0.7,
    padding: height * 0.03,
    borderRadius: width * 0.04,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#333',
    fontSize: width * 0.05,
    marginBottom: height * 0.01,
    textAlign: 'center',
    lineHeight: width * 0.065,
  },
  highlight: {
    color: 'red',
  },
  subText: {
    color: '#555',
    fontSize: width * 0.04,
    marginBottom: height * 0.02,
    textAlign: 'center',
    lineHeight: width * 0.05,
  },
  timerText: {
    color: '#ff4500',
    fontSize: width * 0.045,

    marginBottom: height * 0.02,
  },
  buttonContainer: {
    width: '100%',
    marginTop: height * 0.01,
    alignItems: 'center',
  },
  optionButton: {
    backgroundColor: 'rgba(0, 0, 255, 0.7)',
    width: width * 0.6,
    paddingVertical: height * 0.015,
    borderRadius: width * 0.03,
    marginVertical: height * 0.008,
    alignItems: 'center',
  },
  optionText: {
    color: '#FFF',
    fontSize: width * 0.045,
    height: width * 0.06,
  },
  disabledButton: {
    backgroundColor: 'gray',
  },
  mapButton: {
    position: 'absolute',
    top: height * 0.05,
    right: width * 0.05,
    width: width * 0.1, // ✅ 크기 고정 설정
    height: width * 0.1, // ✅ 크기 고정 설정
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: height * 0.05,
    left: width * 0.05,
    width: width * 0.1, // ✅ 크기 고정 설정
    height: width * 0.1, // ✅ 크기 고정 설정
  },
  backImage: {
    width: '100%',
    height: '100%',
  },
});

export default Stage10_4;
