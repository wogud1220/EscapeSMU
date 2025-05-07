import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  Modal,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {Camera, CameraDevice} from 'react-native-vision-camera';
import {onAuthStateChanged} from 'firebase/auth';
import {auth} from './firebase.config';
import axios from 'axios';
import {useRoute, RouteProp, useIsFocused} from '@react-navigation/native';
import {RootStackParamList} from '../App';
import {updateStageData} from '../utils/updateStageData';
import {incrementStageAttempt} from '../utils/incrementStageAttempt';
import {decrementStageAttempt} from '../utils/decrementStageAttempt';

const {width, height} = Dimensions.get('window');

type Stage7CameraRouteProp = RouteProp<RootStackParamList, 'Stage7Camera'>;

const SERVER_URL = 'http://34.47.88.216:8000/compare';

const Stage7Camera = ({navigation}: {navigation: any}) => {
  const [permission, setPermission] = useState<boolean | null>(null);
  const [device, setDevice] = useState<CameraDevice | undefined>();
  const [isUploading, setIsUploading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [pass, setPass] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const camera = useRef<Camera>(null);

  const [hintVisible, setHintVisible] = useState(false);
  const openHintModal = () => setHintVisible(true);
  const closeHintModal = () => setHintVisible(false);

  const route = useRoute<Stage7CameraRouteProp>();
  const {college, department} = route.params || {};
  const isFocused = useIsFocused(); // 화면 포커스 상태 가져옴

  useEffect(() => {
    if (permission && !device) {
      const timeout = setTimeout(() => {
        navigation.replace('Stage7_6', { college, department });
      }, 100);
  
      return () => clearTimeout(timeout);
    }
  }, [permission, device]);

  useEffect(() => {
    const checkPermission = async () => {
      const cameraPermission = await Camera.requestCameraPermission();
      setPermission(cameraPermission === 'granted');
    };

    const loadDevices = async () => {
      const devices = await Camera.getAvailableCameraDevices();
      const selected = devices.find(dev => dev.position === 'back');
      setDevice(selected);
    };

    const fetchUser = () => {
      const unsubscribe = onAuthStateChanged(auth, user => {
        if (user) {
          setUserId(user.uid);
        }
      });
      return unsubscribe;
    };

    checkPermission();
    loadDevices();
    const unsubscribeAuth = fetchUser();

    return () => unsubscribeAuth();
  }, []);

  const takePicture = async () => {
    if (!camera.current || !userId) return;

    try {
      const photo = await camera.current.takePhoto({quality: 90});
      const fileUri =
        Platform.OS === 'ios' ? photo.path : `file://${photo.path}`;

      const formData = new FormData();
      const fileData = {
        uri: fileUri,
        name: 'captured.jpg',
        type: 'image/jpeg',
      };
      formData.append('file', fileData);
      formData.append('user_id', userId);
      formData.append('stage', 'stage7');

      setIsUploading(true);
      const response = await axios.post(SERVER_URL, formData, {
        headers: {'Content-Type': 'multipart/form-data'},
        timeout: 10000,
      });
      setIsUploading(false);

      const data = response.data;
      if (data.result === 'Pass') {
        goToNextStage();
        setPass(true);
      } else {
        incrementStageAttempt(userId, college);
        setPass(false);
      }
      setShowResult(true);
    } catch (error: any) {
      setIsUploading(false);
      console.error('🚨 서버 오류:', error);
      Alert.alert('❌ 실패', '서버 연결에 실패했습니다.');
    }
  };

  const goToNextStage = async () => {
    await updateStageData(userId, college, 'Stage7_7');
    navigation.navigate('Stage7_7', {college, department});
  };

  if (permission === null) return <Text>🔄 권한 확인 중...</Text>;
  if (!permission) {
    return (
      <Text style={styles.permissionText}>
        ⚠️ 카메라 권한이 필요합니다. iOS: 설정 → EscampeSMU → 카메라 ON!
      </Text>
    );
  }

  if (!device) {
    return (
      <View style={styles.modalOverlay}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={{color: '#fff', marginTop: 20, fontSize: 16}}>
          📸 카메라 기기 불러오는 중..
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={camera}
        style={styles.camera}
        device={device}
        isActive={isFocused}
        photo={true}
      />

      <TouchableOpacity onPress={openHintModal} style={styles.hintButton}>
        <Text style={styles.hintButtonText}>💡 힌트</Text>
      </TouchableOpacity>

      <Image
        source={require('../assets/songrule2.png')}
        style={styles.backImage}
        resizeMode="contain"
      />

      {/* <TouchableOpacity onPress={takePicture} style={styles.captureButton}>
        <Text style={styles.buttonText}>📸</Text>
      </TouchableOpacity> */}

      <TouchableOpacity onPress={goToNextStage} style={styles.tempButton}>
        <Text style={styles.buttonText}>Stage7_7로 이동</Text>
      </TouchableOpacity>

      <Modal visible={isUploading} transparent>
        <View style={styles.modalOverlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={{color: '#fff', marginTop: 10}}>사진 확인 중...</Text>
        </View>
      </Modal>

      <Modal visible={showResult} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>
              {pass
                ? '✅ 성공! 다음 단계로 이동합니다.'
                : '❌ 실패! 다시 시도해주세요.'}
            </Text>
            <TouchableOpacity
              style={styles.resultButton}
              onPress={() => {
                if (pass) {
                  goToNextStage();
                } else {
                  setShowResult(false);
                }
              }}>
              <Text style={styles.buttonText}>
                {pass ? '다음으로' : '다시 시도'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        visible={hintVisible}
        transparent
        animationType="fade"
        onRequestClose={closeHintModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>
              📌 만약, 네모칸을 못 맞춰서 글자를 얻기 힘들다면{'\n'} 휴게실 앞의
              2글자 4번의 6번째 글자{'\n'}4번의 20번째 글자{'\n'}5번의 15번째
              글자를 살펴보자!
            </Text>
            <TouchableOpacity
              style={styles.resultButton}
              onPress={closeHintModal}>
              <Text style={styles.buttonText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#000'},
  camera: {width: '100%', height: '100%'},
  captureButton: {
    position: 'absolute',
    bottom: 100,
    left: '30%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 50,
  },
  tempButton: {
    position: 'absolute',
    marginTop: height * 0.1,
    bottom: 160,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 255, 0.7)',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 50,
  },
  buttonText: {fontSize: 18, color: 'white', fontWeight: 'bold'},
  permissionText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 300,
  },
  backImage: {
    position: 'absolute',
    alignSelf: 'center',
    width: width * 0.8,
    height: height * 0.8,
    marginBottom: height * 0.005,
    marginTop: height * 0.05,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  resultButton: {
    backgroundColor: '#1E90FF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  hintButton: {
    position: 'absolute',
    top: height * 0.07,
    right: width * 0.05,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    zIndex: 10,
  },
  hintButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Stage7Camera;
