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
import {incrementStageAttempt} from '../utils/incrementStageAttempt';
import {updateStageData} from '../utils/updateStageData';
import {onAuthStateChanged} from 'firebase/auth';
import {auth} from './firebase.config';
import CustomText from '../CustomText';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Stage9_5'>;

const {width, height} = Dimensions.get('window');

const Stage9_5 = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<RootStackParamList, 'Stage9_5'>>();
  const {college, department} = route.params || {};
  const [answer, setAnswer] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const handleMapPress = () => {
    navigation.navigate('Map');
  };

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user) {
        setUserId(user.uid);
      }
    });
  }, []);
  // const handleNextStage = () => {
  //   if (answer.trim().toLowerCase() === 'bluepot') {
  //     updateStageData(userId, college, 'Stage10_1');
  //     Alert.alert('정답입니다!', '다음 스테이지로 이동합니다.', [
  //       {
  //         text: '확인',
  //         onPress: () =>
  //           navigation.navigate('Stage10_1', {college, department}),
  //       },
  //     ]);
  //     setIsModalVisible(false);
  //   } else {
  //     incrementStageAttempt(userId, college);
  //     Alert.alert('오답입니다.', '다시 시도해 보세요!');
  //   }
  // };

  const handleNextStage = () => {
    if (answer.trim().toLowerCase() === 'bluepot') {
      if (college.includes('디자인')) {
        updateStageData(userId, college, 'Stage10_1');
        Alert.alert('정답입니다!', '다음 스테이지로 이동합니다.', [
          {
            text: '확인',
            onPress: () =>
              navigation.navigate('Stage10_1', {college, department}),
          },
        ]);
      } else if (college.includes('전체')) {
        updateStageData(userId, college, 'Stage11');
        Alert.alert('정답입니다!', '다음 스테이지로 이동합니다.', [
          {
            text: '확인',
            onPress: () =>
              navigation.navigate('Stage11_1', {college, department}),
          },
        ]);
      }

      setIsModalVisible(false);
    } else {
      incrementStageAttempt(userId, college);
      Alert.alert('오답입니다.', '다시 시도해 보세요!');
    }
  };

  const handleHomePress = () => {
    navigation.navigate('Main');
  };

  const handleGoToGuestbook = () => {
    navigation.navigate('Guestbook', {college, department});
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
          <Image
            source={require('../assets/bluepot.png')}
            style={styles.wayImage}
            resizeMode="contain"
          />
          <CustomText style={styles.text}>
            마지막 문제야! {'\n'}디자인관 1층에서 다음 로고를 찾아보자
          </CustomText>
          <CustomText style={styles.subText}>
            해당 로고를 가진 곳의 이름을 영어로 입력해볼까?
          </CustomText>
        </View>

        {/* ✅ 입력 필드 → 터치 시 모달 열기 */}
        <TouchableOpacity onPress={openModal} style={styles.inputContainer}>
          <CustomText style={styles.inputText}>
            {answer || '정답 입력'}
          </CustomText>
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
                  <CustomText style={styles.modalTitle}>
                    정답을 입력하세요
                  </CustomText>

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
    marginTop: height * 0.2,
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
    marginBottom: height * 0.01,
    textAlign: 'center',
    lineHeight: width * 0.065,
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
    height: height * 0.3,
    marginBottom: height * 0.02,
  },
  guestbookButton: {
    backgroundColor: '#FFA500', // ✅ 오렌지색 버튼
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.1,
    borderRadius: width * 0.03,
    marginTop: height * 0.02,
    alignItems: 'center',
  },
  guestbookButtonText: {
    color: '#FFFFFF',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
});

export default Stage9_5;
