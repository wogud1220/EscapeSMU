// import React, {useEffect, useRef, useState} from 'react';
// import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
// import {Camera, CameraDevice} from 'react-native-vision-camera';
// import {useRoute, RouteProp, useIsFocused} from '@react-navigation/native';
// import {RootStackParamList} from '../App';

// const Stage12Camera = ({navigation}: {navigation: any}) => {
//   const [device, setDevice] = useState<CameraDevice | undefined>();
//   const camera = useRef<Camera>(null);
//   const route = useRoute<RouteProp<RootStackParamList, 'Stage12Camera'>>();
//   const {college, department} = route.params || {};
//   const isFocused = useIsFocused(); // 화면 포커스 상태 가져옴
//   useEffect(() => {
//     const checkPermission = async () => {
//       const cameraPermission = await Camera.getCameraPermissionStatus();
//       console.log(`현재 권한 상태: ${cameraPermission}`);

//       if (cameraPermission === 'not-determined') {
//         await Camera.requestCameraPermission();
//       }
//     };

//     const loadDevices = async () => {
//       const availableDevices = await Camera.getAvailableCameraDevices();
//       console.log('사용 가능한 장치 목록:', availableDevices);

//       availableDevices.forEach((dev, index) => {
//         console.log(
//           `장치 ${index}: position = ${dev.position}, sensorOrientation = ${dev.sensorOrientation}`,
//         );
//       });

//       const backCamera = availableDevices.find(
//         dev =>
//           dev.position === 'back' ||
//           dev.sensorOrientation === 'landscape-left' ||
//           dev.sensorOrientation === 90,
//       );

//       console.log('선택된 백 카메라 상태:', backCamera);

//       if (backCamera) {
//         setTimeout(() => setDevice(backCamera), 100);
//       }
//     };

//     checkPermission();
//     loadDevices();
//   }, []);

//   const takePicture = async () => {
//     if (camera.current) {
//       const photo = await camera.current.takePhoto();
//       console.log(`사진 저장 경로: ${photo.path}`);
//       navigation.goBack(); // Stage1으로 복귀
//     }
//   };

//   const goToNextStage = () => {
//     navigation.navigate('Stage12_4', {department});
//   };

//   if (!device) {
//     // ✅ 장치가 없으면 아무것도 렌더링하지 않음
//     return <View style={styles.container} />;
//   }

//   return (
//     <View style={styles.container}>
//       {/* ✅ 카메라 컴포넌트 */}
//       <Camera
//         ref={camera}
//         style={styles.camera}
//         device={device}
//         isActive={isFocused}
//         photo={true}
//       />

//       {/* ✅ 사진 촬영 버튼 */}
//       <TouchableOpacity onPress={takePicture} style={styles.captureButton}>
//         <Text style={styles.buttonText}>📸</Text>
//       </TouchableOpacity>

//       {/* ✅ 다음 버튼 */}
//       <TouchableOpacity onPress={goToNextStage} style={styles.nextButton}>
//         <Text style={styles.buttonText}>다음 ➡️</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#000',
//   },
//   camera: {
//     width: '100%',
//     height: '100%',
//   },
//   captureButton: {
//     position: 'absolute',
//     bottom: 100,
//     alignSelf: 'center',
//     backgroundColor: '#fff',
//     padding: 20,
//     borderRadius: 50,
//   },
//   nextButton: {
//     position: 'absolute',
//     bottom: 30,
//     alignSelf: 'center',
//     backgroundColor: '#1E90FF', // ✅ 파란색 버튼 스타일
//     paddingVertical: 15,
//     paddingHorizontal: 30,
//     borderRadius: 50,
//   },
//   tempButton: {
//     position: 'absolute',
//     bottom: 150, // ✅ 하단에서 약간 위로 배치
//     alignSelf: 'center',
//     backgroundColor: '#32CD32', // ✅ 연두색 스타일
//     paddingVertical: 15,
//     paddingHorizontal: 30,
//     borderRadius: 50,
//   },
//   buttonText: {
//     fontSize: 18,
//     color: '#fff',
//     fontWeight: 'bold',
//   },
// });

// export default Stage12Camera;

import React, {act, useEffect, useRef, useState} from 'react';
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
import {set} from 'date-fns';

const {width, height} = Dimensions.get('window');

type Stage12CameraRouteProp = RouteProp<RootStackParamList, 'Stage12Camera'>;

const SERVER_URL = 'http://34.47.88.216:8000/compare';

const Stage12Camera = ({navigation}: {navigation: any}) => {
  const [permission, setPermission] = useState<boolean | null>(null);
  const [device, setDevice] = useState<CameraDevice | undefined>();
  const [isUploading, setIsUploading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [pass, setPass] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const camera = useRef<Camera>(null);

  const route = useRoute<Stage12CameraRouteProp>();
  const {college, department} = route.params || {};
  const isFocused = useIsFocused(); // 화면 포커스 상태 가져옴
  useEffect(() => {
    if (permission && !device) {
      const timeout = setTimeout(() => {
        navigation.replace('Stage12_3', {college, department});
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
      formData.append('stage', 'stage12');

      setIsUploading(true);
      const response = await axios.post(SERVER_URL, formData, {
        headers: {'Content-Type': 'multipart/form-data'},
        timeout: 10000,
      });
      setIsUploading(false);
      let actualCollege = college;
      if (department === '디지털만화영상' || department === '사진영상') {
        actualCollege = '융합기술대학';
      }
      const data = response.data;
      if (data.result === 'Pass') {
        // goToNextStage();
        setPass(true);
      } else {
        incrementStageAttempt(userId, actualCollege);
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
    let actualCollege = college;
    if (department === '디지털만화영상' || department === '사진영상') {
      actualCollege = '융합기술대학';
    }
    await updateStageData(userId, actualCollege, 'Stage12_4');
    navigation.navigate('Stage12_4', {college: actualCollege, department});
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

      <Image
        source={require('../assets/robot_trans.png')}
        style={styles.backImage}
        resizeMode="contain"
      />

      <TouchableOpacity onPress={takePicture} style={styles.captureButton}>
        <Text style={styles.buttonText}>📸</Text>
      </TouchableOpacity>

      {/* <TouchableOpacity onPress={goToNextStage} style={styles.tempButton}>
        <Text style={styles.buttonText}>Stage12_4로 이동</Text>
      </TouchableOpacity> */}

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
                  setShowResult(false);
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#000'},
  camera: {width: '100%', height: '100%'},
  captureButton: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 50,
  },
  tempButton: {
    position: 'absolute',
    bottom: 160,
    alignSelf: 'center',
    backgroundColor: '#32CD32',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 50,
  },
  buttonText: {fontSize: 18, color: '#000', fontWeight: 'bold'},
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
  },
  resultButton: {
    backgroundColor: '#1E90FF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
});

export default Stage12Camera;
