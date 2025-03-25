import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ImageBackground, 
  StyleSheet, 
  Dimensions, 
  Image, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../App';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Stage7_3'>;

const { width, height } = Dimensions.get('window');

// ✅ 객관식 옵션 설정
const options = [
  { label: '① 기본으로 자유롭게 이용 가능하며, 우선 사용이 필요할 시 예약도 가능하다', value: 1 },
  { label: '② 스터디룸 이용 가능 시간은 평일 19시 50분까지이다.', value: 2 },
  { label: '③ 총 5개의 방을 예약할 수 있으며, 수용 인원 최대 인원은 8명이다.', value: 3 },
  { label: '④ 우선 사용이 필요할 시, 최소 하루 전에 예약을 해야 하며 당일 예약이 불가능하다.', value: 4 },
  { label: '⑤ 취식이 금지되고 있다.', value: 5 },
];

const Stage7_3 = () => {
  const navigation = useNavigation<NavigationProp>();
  const [disabled, setDisabled] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  // ✅ 카운트다운 타이머 설정
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown !== null) {
      timer = setInterval(() => {
        setCountdown((prev) => (prev !== null ? prev - 1 : null));
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

  const handleOptionPress = (value: number) => {
    if (disabled) return;

    if (value === 3) {
      Alert.alert('정답입니다!', '다음 스테이지로 이동합니다.', [
        { text: '확인', onPress: () => navigation.navigate('Stage7_4') },
      ]);
    } else {
      Alert.alert('오답입니다.', '5분 뒤에 다시 시도해 보세요!');
      setDisabled(true);
      setCountdown(300); // ✅ 5분 타이머 설정
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

        {/* ✅ 지도 버튼 */}
        <TouchableOpacity onPress={handleMapPress} style={styles.mapButton}>
          <Image 
            source={require('../assets/map.png')}
            style={styles.mapImage}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* ✅ 홈 버튼 */}
        <TouchableOpacity onPress={handleHomePress} style={styles.backButton}>
          <Image 
            source={require('../assets/home.png')}
            style={styles.backImage}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* ✅ 흰색 박스 */}
        <View style={styles.box}>
          <Text style={styles.text}>
            다음중 라운지 스터디룸 이용 방법으로{'\n'}옳지 <Text style={styles.highlight}>않은</Text> 것은 무엇일까?
          </Text>
          <Text style={styles.subText}>
            스터디룸 문에 붙어 있는 종이를 확인하자!{'\n'}
            틀릴 시에는 다시 입력하기까지 <Text style={styles.highlight}>5분</Text>을 기다려야해... 신중하자!
          </Text>

          {/* ✅ 타이머 표시 */}
          {countdown !== null && (
            <Text style={styles.timerText}>
              {`다시 시도 가능까지: ${Math.floor(countdown / 60)}:${(countdown % 60).toString().padStart(2, '0')}`}
            </Text>
          )}

          {/* ✅ 객관식 버튼 */}
          <View style={styles.buttonContainer}>
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionButton,
                  disabled && styles.disabledButton
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
    height: height * 0.8,
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
    marginTop: height * 0.02,
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
    textAlign: 'center',
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
  wayImage: {
    marginTop: height * -0.1, // ✅ 이미지와 텍스트 간격
    width: width * 0.6,
    height: height * 0.5,
    marginBottom: height * 0.005, // ✅ 이미지와 텍스트 간격
  },
});

export default Stage7_3;
