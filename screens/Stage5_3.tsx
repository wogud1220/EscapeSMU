//한누리관 휴게실 퀴즈(틀릴 시 5분)

import React, { useState, useEffect } from 'react';
import { View, Text, ImageBackground, StyleSheet, Dimensions, Image, TouchableOpacity, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../App';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Stage5_4'>;

const { width, height } = Dimensions.get('window');

const options = [
  { label: '8층', value: 8 },
  { label: '7층', value: 7 },
  { label: '6층', value: 6 },
  { label: '3층', value: 3 },
];

const Stage5_3 = () => {
  const navigation = useNavigation<NavigationProp>();
  const [disabled, setDisabled] = useState(false); // ✅ 버튼 활성화 상태
  const [countdown, setCountdown] = useState<number | null>(null); // ✅ 남은 시간 상태

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown !== null) {
      // ✅ 매 초마다 countdown 감소
      timer = setInterval(() => {
        setCountdown((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);

      if (countdown === 0) {
        clearInterval(timer);
        setDisabled(false);
        setCountdown(null); // ✅ 타이머 초기화
      }
    }

    return () => clearInterval(timer); // ✅ 컴포넌트 언마운트 시 클리어
  }, [countdown]);

  const handleMapPress = () => {
    navigation.navigate('Map');
  };

  const handleOptionPress = (value: number) => {
    if (disabled) return;

    if (value === 6) {
      Alert.alert('정답입니다!', '다음 스테이지로 이동합니다.', [
        { text: '확인', onPress: () => navigation.navigate('Stage5_4') },
      ]);
    } else {
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
        resizeMode="cover"
      >
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
          <Text style={styles.text}>
            다음 중 휴게실이 존재하지 <Text style={styles.highlight}>않는</Text> 층수로{"\n"}옳은 것은?
          </Text>

          {/* 서브텍스트 추가 */}
          <Text style={styles.subText}>
            한누리관에는 다양한 층에 휴게실이 있지만 {"\n"}일부 층에는 존재하지 않아. {"\n"}{"\n"}틀릴 시에는 다시 입력하기까지 <Text style={styles.highlight}>5분</Text>을 기다려야해... 신중하자!
          </Text>

          {/* ✅ 타이머 표시 */}
          {countdown !== null && (
            <Text style={styles.timerText}>
              {`다시 시도 가능까지: ${Math.floor(countdown / 60)}:${(countdown % 60).toString().padStart(2, '0')}`}
            </Text>
          )}

          {/* 버튼 생성 */}
          <View style={styles.buttonContainer}>
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionButton,
                  disabled && styles.disabledButton // ✅ 비활성화 시 스타일 적용
                ]}
                onPress={() => handleOptionPress(option.value)}
                disabled={disabled}
              >
                <Text style={styles.optionText}>{option.label}</Text>
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
    height: height * 0.65,
    padding: height * 0.03,
    borderRadius: width * 0.04,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#333',
    fontSize: width * 0.05,
    fontWeight: 'bold',
    marginBottom: height * 0.01,
    textAlign: 'center',
  },
  highlight: {
    color: 'red',
    fontWeight: 'bold',
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
    fontWeight: 'bold',
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
    fontWeight: 'bold',
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

export default Stage5_3;
