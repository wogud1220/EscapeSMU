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
  Keyboard,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../App';
import {useDepartment} from './Member/DepartmentContext';
import CustomText from '../CustomText';
import {onAuthStateChanged} from 'firebase/auth';
import {auth} from './firebase.config';
import {updateStageData} from '../utils/updateStageData';
import {increment} from 'firebase/firestore';
import {incrementStageAttempt} from '../utils/incrementStageAttempt';

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Stage5_5'
>;

const {width, height} = Dimensions.get('window');

const Stage5_5 = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<RootStackParamList, 'Stage5_5'>>();
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
  const handleMapPress = () => {
    navigation.navigate('Map');
  };

  const handleGoToGuestbook = () => {
    navigation.navigate('Guestbook', {college, department});
  };
  
  const handleNextStage = async () => {
    let actualCollege = college;
    if (department === '디지털만화영상' || department === '사진영상') {
      actualCollege = '융합기술대학';
    }
    if (answer.trim() === '한누리관1층') {
      try {
        await updateStageData(userId, actualCollege, 'Stage5_6');
      } catch (err) {
        console.error('🔥 updateStageData error:', err);
      }
      Alert.alert('정답입니다!', '다음 스테이지로 이동합니다.', [
        {
          text: '확인',
          onPress: () =>
            navigation.navigate('Stage5_6', {
              college: actualCollege,
              department,
            }),
        },
      ]);
      setIsModalVisible(false);
    } else {
      incrementStageAttempt(userId, actualCollege);
      Alert.alert('오답입니다.', '다시 시도해 보세요!');
    }
  };

  const handleHomePress = () => {
    navigation.navigate('Main');
  };

  const openModal = () => {
    setIsModalVisible(true);
  };

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

        <TouchableOpacity onPress={handleMapPress} style={styles.mapButton}>
          <Image
            source={require('../assets/map.png')}
            style={styles.mapImage}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleHomePress} style={styles.backButton}>
          <Image
            source={require('../assets/home.png')}
            style={styles.backImage}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <View style={styles.box}>
          <CustomText style={{fontSize: 25, textAlign: 'center'}}>
            혹시 방명록에 수뭉이가 {'\n'} 남긴 글을 봤어??
          </CustomText>
          <CustomText style={styles.subText}>
            그렇다면, 수뭉이가 어디로 가라고 했는지 말해볼래? {'\n'}(띄어쓰기 없이 입력해줘!)
          </CustomText>
          <TouchableOpacity
            style={[styles.guestbookButton]}
            onPress={handleGoToGuestbook}
            activeOpacity={0.7}>
            <CustomText style={styles.guestbookButtonText}>방명록 확인하기</CustomText>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={openModal} style={styles.inputContainer}>
          <CustomText style={styles.inputText}>
            {answer || '정답 입력'}
          </CustomText>
        </TouchableOpacity>
      </ImageBackground>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeModal}>
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
            closeModal();
          }}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <CustomText style={styles.modalTitle}>
                정답을 입력하세요
              </CustomText>
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
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleNextStage}>
                <CustomText style={styles.buttonText}>제출하기</CustomText>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
    width: width * 0.8,
    height: height * 0.4,
    padding: height * 0.03,
    borderRadius: width * 0.04,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
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
    marginTop: height * 0.05,
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
    fontSize: width * 0.035,
    color: '#333',
    fontFamily: 'BMHANNAPro',
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
    fontFamily: 'BMHANNAPro'
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
    marginTop: height * 0.05,
    alignItems: 'center',
  },
  guestbookButtonText: {
    color: '#FFFFFF',
    fontSize: width * 0.045,
    fontFamily: 'BMHANNAPro',
  },
});

export default Stage5_5;
