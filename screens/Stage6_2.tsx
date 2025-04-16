// //독도 가는 화면
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../App';
import {useRoute, RouteProp} from '@react-navigation/native';
import Voice from '@react-native-voice/voice';
import {onAuthStateChanged} from 'firebase/auth';
import {auth} from './firebase.config';
import {updateStageData} from '../utils/updateStageData';
import {increment} from 'firebase/firestore';
import {incrementStageAttempt} from '../utils/incrementStageAttempt';
const {width, height} = Dimensions.get('window');
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Stage6_2'>;

const Stage6_2 = () => {
  const navigation = useNavigation<NavigationProp>();
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const route = useRoute<RouteProp<RootStackParamList, 'Stage6_2'>>();
  const {college, department} = route.params || {};
  const [userId, setUserId] = useState('');
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        setUserId(user.uid);
      }
    });
    return unsubscribe;
  }, []);
  const startListening = async () => {
    try {
      setRecognizedText('');
      setIsListening(true);
      await Voice.start('ko-KR');
    } catch (e) {
      console.error('🎤 start error:', e);
      setIsListening(false);
    }
  };

  const stopListening = async () => {
    let actualCollege = college;
    if (department === '디지털만화영상' || department === '사진영상') {
      actualCollege = '융합기술대학';
    }
    try {
      await Voice.stop();
      setIsListening(false);
      if (recognizedText.trim() === '독도는 우리 땅') {
        // 정답이라면
        await updateStageData(userId, actualCollege, 'Stage6_3'); // 스테이지 진행 정보 저장 (독도)
        Alert.alert('성공', '정답입니다! 다음 스테이지로 이동합니다.', [
          {
            text: '확인',
            onPress: () =>
              navigation.navigate('Stage6_3', {college:actualCollege, department}),
          },
        ]);
      } else {
        // 정답이 아니라면
        incrementStageAttempt(userId, actualCollege); // 시도 횟수 증가
        Alert.alert('실패', '정답이 아닙니다. 다시 시도해보세요.');
      }
    } catch (e) {
      console.error('🛑 stop error:', e);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  useEffect(() => {
    Voice.onSpeechResults = e => {
      const text = e.value?.[0] || '';
      setRecognizedText(text);
    };

    Voice.onSpeechError = e => {
      console.error('Speech Error:', e);
    };
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const handleMapPress = () => {
    navigation.navigate('Map');
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/main.png')}
        style={styles.image}
        resizeMode="cover">
        <View style={styles.overlay} />

        <TouchableOpacity onPress={handleMapPress} style={styles.mapButton}>
          <Image
            source={require('../assets/map.png')}
            style={styles.mapImage}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Main')}
          style={styles.backButton}>
          <Image
            source={require('../assets/home.png')}
            style={styles.backImage}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <View style={styles.box}>
          <Image
            source={require('../assets/shouting.png')}
            style={styles.wayImage}
            resizeMode="contain"
          />
          <Text style={styles.text}>독도 조형물이야!</Text>
          <Text style={styles.subText}>
            실제 독도 모습을 축소한 조형물을 설치해 '독도사랑, 나라사랑' 정신을
            되새기게 하기 위한 목적으로 설치되었어!
          </Text>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={toggleListening}
            activeOpacity={0.7}>
            <Text style={styles.buttonText}>
              {isListening ? '🛑 중지하기' : '🎤 말하기 시작'}
            </Text>
          </TouchableOpacity>
          {recognizedText !== '' && (
            <Text style={styles.recognizedText}>
              👂 인식된 문장: {recognizedText}
            </Text>
          )}
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
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    width: width * 0.8,
    height: height * 0.7,
    padding: height * 0.03,
    borderRadius: width * 0.04,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  text: {
    color: '#333',
    fontSize: width * 0.06,
    fontWeight: 'bold',
    marginBottom: height * 0.01,
    textAlign: 'center',
  },
  subText: {
    color: '#555',
    fontSize: width * 0.045,
    textAlign: 'center',
    marginTop: height * 0.02,
    marginBottom: height * 0.02,
  },
  mapButton: {
    position: 'absolute',
    top: height * 0.05,
    right: width * 0.05,
    width: width * 0.12,
    height: width * 0.12,
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  nextButton: {
    backgroundColor: 'rgba(0, 0, 255, 0.7)',
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.2,
    borderRadius: width * 0.03,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    top: height * 0.05,
    left: width * 0.05,
    width: width * 0.1,
    height: width * 0.1,
  },
  backImage: {
    width: '100%',
    height: '100%',
  },
  wayImage: {
    width: width * 0.6,
    height: height * 0.3,
    marginBottom: height * 0.01,
  },
  recognizedText: {
    marginTop: 10,
    color: '#222',
    fontWeight: '600',
  },
});

export default Stage6_2;
