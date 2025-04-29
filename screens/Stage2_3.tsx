//송백관 마무리 퀴즈

import React, {useState, useEffect} from 'react';
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
import {onAuthStateChanged} from 'firebase/auth';
import {auth} from './firebase.config';
import {updateStageData} from '../utils/updateStageData';
import {incrementStageAttempt} from '../utils/incrementStageAttempt';
import CustomText from '../CustomText';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Stage2_3'>;

const {width, height} = Dimensions.get('window');

const Stage2_3 = () => {
  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user) {
        setUserId(user.uid);
      }
    });
  }, []);
  useEffect(() => {
  }, []);
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<RootStackParamList, 'Stage2_3'>>();
  const {college, department} = route.params || {};
  const [answer, setAnswer] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userId, setUserId] = useState('');

  const handleMapPress = () => {
    navigation.navigate('Map');
  };

  const handleNextStage = () => {
    if (answer.trim() === '이보경') {
      updateStageData(userId, college, 'Stage2_4');
      Alert.alert('정답입니다!', '다음 스테이지로 이동합니다.', [
        {
          text: '확인',
          onPress: () => navigation.navigate('Stage2_4', {college, department}),
        },
      ]);
      setIsModalVisible(false);
    } else {
      incrementStageAttempt(userId, college);
      Alert.alert('오답입니다.', '다시 시도해 보세요!');
    }
  };

  const handleHomePress = () => {
    navigation.navigate('Main');
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
          <CustomText style={styles.text}>
            이 사진을 찍은 사람의 이름을 입력해보자!
          </CustomText>

          {/* ✅ 이미지 추가 */}
          <Image
            source={require('../assets/lee2.png')}
            style={styles.wayImage}
            resizeMode="contain"
          />

          <CustomText style={styles.subText}>한누리관 211호는 이 분의 강의실이기도 해!!</CustomText>
        </View>

        {/* ✅ 입력 필드 → 터치 시 모달 열기 */}
        <TouchableOpacity onPress={openModal} style={styles.inputContainer}>
          <CustomText style={styles.inputText}>{answer || '정답 입력'}</CustomText>
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
                  <CustomText style={styles.modalTitle}>정답을 입력하세요</CustomText>

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
                    <CustomText style={styles.buttonText}>제출하기</CustomText>
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
    marginTop: height * 0.15,
    width: width * 0.8,
    height: height * 0.6,
    padding: height * 0.03,
    borderRadius: width * 0.04,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    elevation: 5,
  },
  text: {
    color: '#333',
    fontSize: width * 0.055,
    marginBottom: height * 0.02,
    textAlign: 'center',
  },
  subText: {
    color: '#555',
    fontSize: width * 0.045,
    textAlign: 'center',
    marginTop: height * 0.02,
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
    fontFamily: 'BMHANNAPro',
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
    height: height * 0.4,
    marginBottom: height * 0.02,
  },
  goBackButton: {
    position: 'absolute',
    top: height * 0.05,
    left: width * 0.18, // 홈 버튼 옆에 배치
    width: width * 0.1,
    height: width * 0.1,
  },
  gogobackButton: {
    position: 'absolute',
    bottom: height * 0.05,
    backgroundColor: 'rgba(0, 0, 255, 0.7)', // ✅ 파란색 버튼
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.05,
    borderRadius: width * 0.03,
    alignItems: 'center',
    alignSelf: 'center',
  },
  buttonText1: {
    color: '#FFFFFF',
    fontSize: width * 0.045,
    textAlign: 'center',
    height: height * 0.025,
  },
  goBackImage: {
    width: '100%',
    height: '100%',
  },
});

export default Stage2_3;
