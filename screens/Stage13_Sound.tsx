import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Animated,
  TextInput,
  Modal,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../App';
import Sound from 'react-native-sound-level';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {useRoute, RouteProp} from '@react-navigation/native';
import {onAuthStateChanged} from 'firebase/auth';
import {auth} from './firebase.config';
import {updateStageData} from '../utils/updateStageData';
import {incrementStageAttempt} from '../utils/incrementStageAttempt';
import CustomText from '../CustomText';

const {width, height} = Dimensions.get('window');

const bookList = [
  '이방인',
  '노인과 바다',
  '메리골드 마음세탁소',
  '눈먼 자들의 도시',
  '흰 = The Elegy of Whiteness',
  '불편한 편의점',
  '인간실격',
  '듄 1',
  '파우스트',
];

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Stage13_Sound'
>;

const Stage13_Sound = () => {
  useEffect(() => {
    console.log('Stage13_Sound log - Department:', department);
    console.log('Stage13_Sound log - College:', college);
  }, []);
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<RootStackParamList, 'Stage13_Sound'>>();
  const {college, department} = route.params || {};
  const [randomBook, setRandomBook] = useState<string | null>(null);
  const [currentDecibel, setCurrentDecibel] = useState<number>(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [answer, setAnswer] = useState('');
  const [userDepartment, setUserDepartment] = useState(college || '');
  const fadeAnim = useState(new Animated.Value(0))[0];
  const [userId, setUserId] = useState('');

  // 최신 데시벨 값을 저장할 useRef
  const latestDecibelRef = useRef(0);

  useEffect(() => {
    rerollBook();
  }, []);
  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user) {
        setUserId(user.uid);
      }
    });
  }, []);

  const rerollBook = () => {
    const randomIndex = Math.floor(Math.random() * bookList.length);
    setRandomBook(bookList[randomIndex]);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  const requestMicPermission = async () => {
    console.log('🔍 마이크 권한 요청 시작');

    const result = await request(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.MICROPHONE
        : PERMISSIONS.ANDROID.RECORD_AUDIO,
    );

    console.log('🔍 권한 요청 결과:', result);

    if (result !== RESULTS.GRANTED) {
      Alert.alert('마이크 권한 필요', '마이크 권한을 허용해주세요.');
      return false;
    }

    console.log('✅ 마이크 권한 허용됨');
    return true;
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const start = async () => {
      const granted = await requestMicPermission();
      if (!granted) return;

      Sound.start();
      Sound.onNewFrame = data => {
        const rawDbfs = data.value; // e.g. -60 ~ 0
        const dbSPL = convertToSPL(rawDbfs);
        const mapped = Math.floor(dbSPL); // 정수로 사용
        latestDecibelRef.current = mapped;

        // console.log('🔊 dBFS 원본:', rawDbfs);
        // console.log('🎧 변환된 dB SPL:', dbSPL);
      };

      intervalId = setInterval(() => {
        setCurrentDecibel(latestDecibelRef.current);
      }, 500);
    };

    const convertToSPL = (dbFS: number): number => {
      const referenceLevel = 94;
      const dbSPL = referenceLevel + 20 * Math.log10(Math.pow(10, dbFS / 20));
      const adjustedSPL = dbSPL - 25; // 도서관에서 직접 수정하기
      return Math.min(Math.max(adjustedSPL, 0), 94);
    };

    start();

    return () => {
      Sound.stop();
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  // 모달이 열려있는 상태에서 데시벨이 60을 초과하면 모달을 강제로 닫고 입력값을 초기화
  useEffect(() => {
    if (isModalVisible && currentDecibel > 60) {
      Alert.alert('데시벨 초과', '60dB를 넘어서 창이 닫혔습니다!!');
      setIsModalVisible(false);
      setAnswer('');
    }
  }, [currentDecibel, isModalVisible]);

  const handleNextStage = () => {
    let actualCollege = college;
    if (department === '디지털만화영상' || department === '사진영상') {
      actualCollege = '융합기술대학';
    }

    if (userDepartment === '글로벌인문학부대학') {
      updateStageData(userId, actualCollege, 'Stage5');
      navigation.navigate('Stage5', {college: actualCollege, department});
    }
    // + 식품공학도 공대루트
    else if (userDepartment === '공과대학') {
      updateStageData(userId, actualCollege, 'Stage4');
      navigation.navigate('Stage4', {college: actualCollege, department});
    } else if (department === '스포츠융합학부') {
      updateStageData(userId, actualCollege, 'Stage5');
      navigation.navigate('Stage5', {college: actualCollege, department});
    }
    //예술학부지만 융기대 루트 타는 학과
    else if (department === '디지털만화영상' || department === '사진영상') {
      updateStageData(userId, actualCollege, 'Stage2_1');
      navigation.navigate('Stage2', {college: actualCollege, department});
    } else if (userDepartment === '디자인학부') {
      updateStageData(userId, actualCollege, 'Stage5');
      navigation.navigate('Stage5', {college: actualCollege, department});
    } else if (userDepartment === '전체') {
      updateStageData(userId, actualCollege, 'Stage2_1');
      navigation.navigate('Stage2', {college: actualCollege, department});
    }
  };

  const handleSubmitAnswer = async () => {
    let actualCollege = college;
    if (department === '디지털만화영상' || department === '사진영상') {
      actualCollege = '융합기술대학';
    }
    if (
      answer.trim() === '오늘' ||
      answer.trim() === '그는' ||
      answer.trim() === '그' ||
      answer.trim() === '봄' ||
      answer.trim() === '노란' ||
      answer.trim() === '흰' ||
      answer.trim() === '출근' ||
      answer.trim() === '나' ||
      answer.trim() === '연대기' ||
      answer.trim() === '너희들' ||
      answer.trim() === '너희'
    ) {
      // ⛔ 데시벨 수집 중단
      Sound.stop();
      Alert.alert('정답입니다!', '다음 스테이지로 이동합니다.', [
        //       '이방인', - 오늘
        // '노인과 바다', - 그는/그
        // '메리골드 마음세탁소', - 봄
        // '눈먼 자들의 도시', - 노란
        // '흰 = The Elegy of Whiteness', - 흰
        // '불편한 편의점 2', - 출근
        // '인간실격', - 나
        // '페스트', - 연대기
        // '파우스트'(Goethe, Johann Wolfgang von) - 너희들

        {text: '확인', onPress: handleNextStage},
      ]);

      setIsModalVisible(false);
    } else {
      incrementStageAttempt(userId, actualCollege);
      Alert.alert('오답입니다.', '다시 시도해 보세요!');
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/main.png')}
        style={styles.image}
        resizeMode="cover">
        <View style={styles.overlay} />

        <TouchableOpacity
          onPress={() => navigation.navigate('Map')}
          style={styles.mapButton}>
          <Image
            source={require('../assets/map.png')}
            style={styles.mapImage}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Main')}
          style={styles.backButton}>
          <Image
            source={require('../assets/home.png')}
            style={styles.backImage}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={rerollBook} style={styles.rerollButton}>
          <Image
            source={require('../assets/reroll.png')}
            style={styles.rerollImage}
          />
        </TouchableOpacity>

        <View style={styles.box}>
          <CustomText style={styles.decibelText}>
            현재 데시벨: {currentDecibel} dB
          </CustomText>

          {randomBook && (
            <Animated.Text style={[styles.bookTitle, {opacity: fadeAnim}]}>
              {randomBook}
            </Animated.Text>
          )}

          <CustomText style={styles.text}>
            책의 서론을 제외한 본문에서의 첫 번째 단어를 입력해보자!
          </CustomText>

          <TouchableOpacity
            onPress={() => {
              // 버튼 클릭 시 입력값 초기화 후 모달 오픈
              setAnswer('');
              setIsModalVisible(true);
            }}
            style={styles.inputContainer}>
            <CustomText style={styles.inputText}>정답 입력하기</CustomText>
          </TouchableOpacity>

          <CustomText style={styles.noticeText}>
            위의 버튼을 누르면 전부 대출되어서{'\n'}책이 없는 상황일 때 다시
            랜덤으로 초기화해주는 버튼이야!
          </CustomText>
        </View>

        <Modal animationType="fade" transparent visible={isModalVisible}>
          <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
            <View style={styles.modalBackground}>
              <TouchableWithoutFeedback>
                <View style={styles.modalContainer}>
                  <Text style={styles.modalTitle}>정답을 입력하세요</Text>
                  <TextInput
                    style={styles.modalInput}
                    value={answer}
                    onChangeText={setAnswer}
                    placeholder="정답 입력"
                    autoFocus
                  />
                  <TouchableOpacity
                    onPress={handleSubmitAnswer}
                    style={styles.submitButton}>
                    <Text style={styles.buttonText}>제출하기</Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    width: width * 0.8,
    height: height * 0.6,
    padding: height * 0.03,
    borderRadius: width * 0.04,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    alignSelf: 'center',
    marginTop: height * 0.25,
  },
  decibelText: {
    fontSize: width * 0.05,
    color: 'red',
    marginBottom: height * 0.01,
  },
  bookTitle: {
    marginTop: height * 0.05,
    fontSize: width * 0.06,
    color: '#FF5733',
    marginVertical: height * 0.01,
    textAlign: 'center',
    fontFamily: 'BMHANNAPro',
  },
  inputContainer: {
    marginTop: height * 0.05,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 255, 0.7)',
    borderRadius: 5,
  },
  text: {
    marginTop: height * 0.05,
    color: '#333',
    fontSize: width * 0.055,
    marginBottom: height * 0.01,
    textAlign: 'center',
    lineHeight: height * 0.035,
  },
  inputText: {
    fontSize: width * 0.04,
    color: '#FFFFFF',
  },
  rerollButton: {
    position: 'absolute',
    top: height * 0.055,
    left: width * 0.45,
    width: width * 0.1,
    height: width * 0.1,
  },
  rerollImage: {
    width: '100%',
    height: '100%',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    width: width * 0.8,
    padding: height * 0.03,
    borderRadius: width * 0.04,
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    marginBottom: height * 0.02,
  },
  modalInput: {
    width: '100%',
    borderBottomWidth: 1,
    borderColor: '#999',
    fontSize: width * 0.045,
    paddingVertical: height * 0.01,
    marginBottom: height * 0.02,
    color: '#333',
  },
  submitButton: {
    backgroundColor: 'rgba(0, 0, 255, 0.7)',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.2,
    borderRadius: width * 0.03,
  },
  buttonText: {
    color: '#FFFddd',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  noticeText: {
    marginTop: height * 0.05,
    fontSize: width * 0.04,
    color: '#555',
    textAlign: 'center',
    lineHeight: height * 0.03,
  },
});

export default Stage13_Sound;
