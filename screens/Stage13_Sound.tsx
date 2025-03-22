import React, { useEffect, useState } from 'react';
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
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../App';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Stage13_Sound'>;

const { width, height } = Dimensions.get('window');

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

const Stage13_Sound = () => {
  const navigation = useNavigation<NavigationProp>();
  const [randomBook, setRandomBook] = useState<string | null>(null);
  const [currentDecibel, setCurrentDecibel] = useState<number>(0); // ✅ 데시벨 상태 추가
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [answer, setAnswer] = useState('');
  const fadeAnim = useState(new Animated.Value(0))[0];

  // ✅ 책 제목 무작위 선택 및 애니메이션 효과
  useEffect(() => {
    rerollBook();
  }, []);

  // ✅ 무작위 책 제목 선택 함수
  const rerollBook = () => {
    const randomIndex = Math.floor(Math.random() * bookList.length);
    setRandomBook(bookList[randomIndex]);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  // ✅ 데시벨 측정 값 업데이트 (실제 장치에서 연결 가능)
  useEffect(() => {
    const interval = setInterval(() => {
      const newDecibel = Math.floor(Math.random() * 100); // 임시값 (0~100dB)
      setCurrentDecibel(newDecibel);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleMapPress = () => {
    navigation.navigate('Map');
  };

  const handleNextStage = () => {
    navigation.navigate('StageFinal');
  };

  // ✅ 모달 열기
  const openModal = () => {
    setIsModalVisible(true);
  };

  // ✅ 모달 닫기
  const closeModal = () => {
    setIsModalVisible(false);
  };

  // ✅ 정답 체크 로직
  const handleSubmitAnswer = () => {
    if (answer.trim() === '1') {
      Alert.alert('정답입니다!', '다음 스테이지로 이동합니다.', [
        { text: '확인', onPress: handleNextStage },
      ]);
      closeModal();
    } else {
      Alert.alert('오답입니다.', '다시 시도해 보세요!');
    }
  };

  return (
    <View style={styles.container}>
      {/* ✅ 배경 설정 */}
      <ImageBackground 
        source={require('../assets/main.png')} 
        style={styles.image}
        resizeMode="cover"
      >
        {/* ✅ 투명 레이어 */}
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
        <TouchableOpacity onPress={() => navigation.navigate('Main')} style={styles.backButton}>
          <Image 
            source={require('../assets/home.png')}
            style={styles.backImage}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* ✅ 리롤 버튼 */}
        <TouchableOpacity onPress={rerollBook} style={styles.rerollButton}>
          <Image 
            source={require('../assets/reroll.png')}
            style={styles.rerollImage}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* ✅ 가운데 박스 */}
        <View style={styles.box}>
          <Text style={styles.decibelText}>
            현재 데시벨: {currentDecibel} dB
          </Text>

          {randomBook && (
            <Animated.Text style={[styles.bookTitle, { opacity: fadeAnim }]}>
              {randomBook}
            </Animated.Text>
          )}

          <Text style={styles.text}>
            해당 책의 35페이지 3번째 줄에 있는 첫 단어를 입력해보자
          </Text>

          <TouchableOpacity onPress={openModal} style={styles.inputContainer}>
            <Text style={styles.inputText}>정답 입력하기</Text>
          </TouchableOpacity>

          <Text style={styles.noticeText}>
            위의 가운데 버튼을 누르면 전부 대출되어서 {'\n'} 책이 없는 상황일 때 찾아야 하는 책을{'\n'} 다시 랜덤으로 초기화해주는 버튼이야!
            </Text>
        </View>

        {/* ✅ 모달 */}
        <Modal animationType="fade" transparent visible={isModalVisible}>
          <TouchableWithoutFeedback onPress={closeModal}>
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
                  <TouchableOpacity onPress={handleSubmitAnswer} style={styles.submitButton}>
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
    flex: 1, // ✅ 부모 컴포넌트가 화면 전체 차지하도록 설정
    justifyContent: 'center', // ✅ 세로 중앙 정렬
    alignItems: 'center', // ✅ 가로 중앙 정렬
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
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    alignSelf: 'center', // ✅ 부모의 정렬 상태 상속받기
    marginTop: height * 0.2, // ✅ 값 줄이기
  },
  decibelText: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: 'red',
    marginBottom: height * 0.01,
  },
  bookTitle: {
    marginTop: height * 0.05,
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#FF5733',
    marginVertical: height * 0.01,
    textAlign: 'center',
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
    fontWeight: 'bold',
    marginBottom: height * 0.01,
    textAlign: 'center',
    lineHeight: height * 0.035, // ✅ 줄 간격
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
