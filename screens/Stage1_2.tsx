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
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../App';
import {updateStageData} from '../utils/updateStageData';
import {onAuthStateChanged} from 'firebase/auth';
import {auth} from './firebase.config';
import {incrementStageAttempt} from '../utils/incrementStageAttempt';
import {departmentToCollege} from '../utils/departmentToCollege';
import CustomText from '../CustomText';

const {width, height} = Dimensions.get('window');

const Stage1_2 = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, 'Stage1_2'>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Stage1_2'>>();
  const {college = '', department = ''} = route.params || {};

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
    let actualCollege = college;
    if (department === '디지털만화영상' || department === '사진영상') {
      actualCollege = '융합기술대학';
    }
    if (answer.trim() === '1985') {
      setIsModalVisible(false);
      try {
        await updateStageData(userId, actualCollege, 'Stage13_1');
      } catch (err) {
        console.error('🔥 updateStageData error:', err);
      }
      navigation.navigate('Stage13_1', {college: actualCollege, department});

      Alert.alert('정답입니다!', '다음 스테이지로 이동합니다.');
    } else {
      try {
        await incrementStageAttempt(userId, actualCollege);
      } catch (err) {
        console.error('🔥 incrementStageAttempt error:', err);
      }
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
          <CustomText style={{fontSize: 30, color: '#333',
    marginBottom: height * 0.01,
    fontWeight: '500',
    textAlign: 'center',}}>
            정문에서 풀어야 할 문제가 발견되었어!{'\n'}
          </CustomText>
          <CustomText style={styles.subText}>
            1984년 6월 29일에{'\n'}천안 캠퍼스를 준공하였고{'\n'}{'\n'}
            1984년 10월 6일에{'\n'}상명 여자 대학
            천안 캠퍼스{'\n'}개설 인가를 받았어!{'\n'}
            {'\n'}
            그렇다면, 상명대학교 천안캠퍼스가 {'\n'}개교한 연도는 언제일까?
          </CustomText>
        </View>

        <TouchableOpacity
          onPress={() => setIsModalVisible(true)}
          style={styles.inputContainer}>
          <CustomText style={styles.inputText}>{answer || '정답 입력'}</CustomText>
        </TouchableOpacity>
      </ImageBackground>

      <Modal
  animationType="fade"
  transparent
  visible={isModalVisible}
  onRequestClose={() => setIsModalVisible(false)}>
  <TouchableWithoutFeedback
    onPress={() => {
      Keyboard.dismiss();
      setIsModalVisible(false); // 모달도 닫기
    }}>
    <View style={styles.modalBackground}>
      <View style={styles.modalContainer}>
        <CustomText style={{fontSize: 25}}>정답을 입력하세요</CustomText>
        <TextInput
          style={styles.modalInput}
          value={answer}
          onChangeText={setAnswer}
          placeholder="정답 입력"
          placeholderTextColor="#999"
          keyboardType="numeric"
          autoCapitalize="none"
          autoFocus
        />
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleNextStage}>
          <CustomText style={{fontSize: 25, color: 'white'}}>제출하기</CustomText>
        </TouchableOpacity>
      </View>
    </View>
  </TouchableWithoutFeedback>
</Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  image: {flex: 1, width: '100%', height: '100%'},
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  box: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    marginTop: height * 0.25,
    width: width * 0.8,
    height: height * 0.5,
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
    fontSize: width * 0.05,
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
    fontSize: width * 0.05,
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
});

export default Stage1_2;
