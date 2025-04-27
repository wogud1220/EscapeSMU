import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../App';
import {useRoute, RouteProp} from '@react-navigation/native';
import {useDepartment} from './Member/DepartmentContext';
import {updateStageData} from '../utils/updateStageData';
import {onAuthStateChanged} from 'firebase/auth';
import {auth} from './firebase.config';
type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Stage10_7'
>;

const {width, height} = Dimensions.get('window');

const Stage10_7 = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<RootStackParamList, 'Stage10_7'>>();
  const {college, department} = route.params || {};
  const [answer, setAnswer] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userId, setUserId] = useState('');
  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user) {
        setUserId(user.uid);
      }
    });
  }, []);
  const handleNextStage = async () => {
    if (answer.trim() === 'H503') {
      let nextStage: keyof RootStackParamList = 'Stage13_1';

      if (department.includes('스포츠융합학부')) {
        await updateStageData(userId, college, 'Stage11_1');
        nextStage = 'Stage11_1';
      } else if (college.includes('예술학부')) {
        nextStage = 'Stage12_1';
      } else if (college === '글로벌인문학부대학' || college === '공과대학') {
        nextStage = 'StageFinal';
      } else if (college.includes('디자인학부')) {
        nextStage = 'RankingBoard';
      }

      Alert.alert('정답입니다!', '다음 스테이지로 이동합니다.', [
        {
          text: '확인',
          onPress: () => navigation.navigate(nextStage, {college, department}),
        },
      ]);
      setIsModalVisible(false);
    } else {
      Alert.alert('오답입니다.', '다시 시도해 보세요!');
    }
  };

  const handleHomePress = () => {
    navigation.navigate('Main');
  };
  const handleMapPress = () => {
    navigation.navigate('Map');
  };
  // ✅ 모달 열기
  const openModal = () => {
    setIsModalVisible(true);
  };

  // ✅ 모달 닫기
  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* ✅ 배경 이미지 설정 */}
      <ImageBackground
        source={require('../assets/main.png')}
        style={styles.image}
        resizeMode="cover">
        {/* ✅ 투명 레이어 추가 */}
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

        {/* ✅ 문제 박스 */}
        <View style={styles.box}>
          <Text style={styles.text}>
            학생회관 5층에는 동아리들이 사용할 수 있는 동방이 있어!
          </Text>
          <Text style={styles.subText}>
            여러 중앙 동아리 중,{' '}
            <View style={styles.inlineContainer}>
              <Image
                source={require('../assets/codecure.png')}
                style={styles.inlineImage}
                resizeMode="contain"
              />
              <Text style={styles.highlight}>CodeCure</Text>
            </View>{' '}
            가 사용하는 동방의 호수는 몇 호일까?
          </Text>
        </View>

        {/* ✅ 입력 필드 → 터치 시 모달 열기 */}
        <TouchableOpacity onPress={openModal} style={styles.inputContainer}>
          <Text style={styles.inputText}>{answer || '정답 입력'}</Text>
        </TouchableOpacity>

        {/* ✅ 모달 */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={closeModal}>
          <TouchableWithoutFeedback onPress={closeModal}>
            <View style={styles.modalBackground}>
              <TouchableWithoutFeedback>
                <View style={styles.modalContainer}>
                  <Text style={styles.modalTitle}>정답을 입력하세요</Text>

                  {/* ✅ 입력 상자 */}
                  <TextInput
                    style={styles.modalInput}
                    value={answer}
                    onChangeText={setAnswer}
                    placeholder="정답 입력"
                    placeholderTextColor="#999"
                    keyboardType="default"
                    autoCapitalize="none"
                    autoFocus={true}
                  />

                  {/* ✅ 제출 버튼 */}
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleNextStage}>
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
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  box: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    marginTop: height * 0.3,
    marginLeft: width * 0.1,
    width: width * 0.8,
    height: height * 0.4,
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
    marginBottom: height * 0.01,
    textAlign: 'center',
  },
  subText: {
    color: '#555',
    fontSize: width * 0.045,
    textAlign: 'center',
  },
  inputContainer: {
    marginTop: height * 0.05,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 5,
    padding: height * 0.01,
    width: width * 0.5,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  inputText: {
    fontSize: width * 0.045,
    color: '#333',
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
    color: '#FFFFFF',
    fontSize: width * 0.045,
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
  wayImage: {
    width: width * 0.7,
    height: height * 0.3,
    marginBottom: height * 0.02,
  },
  inlineContainer: {
    flexDirection: 'row', // 가로 정렬
    alignItems: 'center', // 세로축 중앙 정렬
  },
  inlineImage: {
    width: width * 0.08, // 이미지 크기 조정
    height: width * 0.08,
    marginRight: width * 0.01, // 글씨와의 간격 조정
  },
  highlight: {
    color: '#0000FF', // 파란색 글씨
    fontWeight: 'bold',
    paddingHorizontal: 4,
    borderRadius: 4,
  },
});

export default Stage10_7;
