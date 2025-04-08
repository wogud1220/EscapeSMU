// //본관 사진찍기 화면(임시구성)

// import React, { useEffect, useRef, useState } from 'react';
// import { StyleSheet, Text, TouchableOpacity, View, Image, Dimensions } from 'react-native';
// import { Camera, CameraDevice } from 'react-native-vision-camera';
// import { useRoute, RouteProp } from '@react-navigation/native';
// import { RootStackParamList } from '../App';

// type Stage4CameraRouteProp = RouteProp<RootStackParamList, 'Stage4Camera'>;

// const { width, height } = Dimensions.get('window');

// const Stage4Camera = ({ navigation }: { navigation: any }) => {
//   const [device, setDevice] = useState<CameraDevice | undefined>();
//   const camera = useRef<Camera>(null);
//   const route = useRoute<RouteProp<RootStackParamList, 'Stage4Camera'>>();
//   const { department } = route.params;

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
//           `장치 ${index}: position = ${dev.position}, sensorOrientation = ${dev.sensorOrientation}`
//         );
//       });

//       const backCamera = availableDevices.find(
//         (dev) =>
//           dev.position === 'back' ||
//           dev.sensorOrientation === 'landscape-left' ||
//           dev.sensorOrientation === 90
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
//     navigation.navigate('Stage4_3', {department});
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
//         isActive={true}
//         photo={true}
//       />

//                   <Image
//                   source={require('../assets/teduri1.png')}
//                   style={styles.backImage}
//                   resizeMode="contain"
//                   />

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
//   backImage: {
//     position: 'absolute',
//     alignSelf: 'center',
//     width: width * 0.9,
//     height: height * 0.9,
//     marginBottom: height * 0.005,
//     marginTop: height * 0.05,
//   },
// });

// export default Stage4Camera;

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
import {useRoute, RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../App';

const {width, height} = Dimensions.get('window');

type Stage1CameraRouteProp = RouteProp<RootStackParamList, 'Stage1Camera'>;

const SERVER_URL = 'http://34.47.88.216:8000/compare';

const Stage4Camera = ({navigation}: {navigation: any}) => {
  const [permission, setPermission] = useState<boolean | null>(null);
  const [device, setDevice] = useState<CameraDevice | undefined>();
  const [isUploading, setIsUploading] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const camera = useRef<Camera>(null);

  const route = useRoute<Stage1CameraRouteProp>();
  const {college, department} = route.params || {};

  useEffect(() => {
    console.log('Stage4Camera log - Department:', department);
    console.log('Stage4Camera log - College:', college);
  }, []);

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
      console.log('📸 파일 URI:', fileUri);

      const formData = new FormData();
      const fileData = {
        uri: fileUri,
        name: 'captured.jpg',
        type: 'image/jpeg',
      };
      formData.append('file', fileData);
      formData.append('user_id', userId);
      formData.append('stage', 'stage4');

      console.log('📦 FormData 구성 완료:', fileData);

      setIsUploading(true);
      const startTime = Date.now();

      const response = await axios.post(SERVER_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 10000,
      });

      const elapsed = Date.now() - startTime;
      console.log(`⏱️ 서버 응답 시간: ${elapsed}ms`);
      setIsUploading(false);

      const data = response.data;
      console.log('📝 비교 결과:', data);

      if (data.result === 'Pass') {
        Alert.alert('✅ 성공!', '다음 단계로 이동합니다.');
        navigation.navigate('Stage4_3', {college, department});
      } else {
        Alert.alert('❌ 실패', '다시 시도해주세요.');
      }
    } catch (error: any) {
      setIsUploading(false);
      console.error('🚨 서버 오류:', error);
      Alert.alert('❌ 실패', '서버 연결에 실패했습니다.');
    }
  };

  if (permission === null) return <Text>🔄 권한 확인 중...</Text>;
  if (!permission) {
    return (
      <Text style={styles.permissionText}>
        ⚠️ 카메라 권한이 필요합니다. iOS: 설정 → EscampeSMU → 카메라 ON!
      </Text>
    );
  }
  const goToNextStage = () => {
    navigation.navigate('Stage4_3', {college, department});
  };

  if (!device) {
    return (
      <Text>⚠️ 카메라 장치를 찾을 수 없습니다. 실제 기기에서 실행하세요.</Text>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={camera}
        style={styles.camera}
        device={device}
        isActive={true}
        photo={true}
      />

      <Image
        source={require('../assets/teduri1.png')}
        style={styles.backImage}
        resizeMode="contain"
      />

      <TouchableOpacity onPress={takePicture} style={styles.captureButton}>
        <Text style={styles.buttonText}>📸</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Stage4_3', {college, department})}
        style={styles.greenButton}>
        <Text style={styles.greenButtonText}>➡️</Text>
      </TouchableOpacity>

      {/* ✅ 임시 Stage1_2 이동 버튼 */}
      <TouchableOpacity onPress={goToNextStage} style={styles.tempButton}>
        <Text style={styles.buttonText}>Stage4_3로 이동</Text>
      </TouchableOpacity>
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
  greenButton: {
    position: 'absolute',
    bottom: 100,
    right: '30%',
    backgroundColor: 'green',
    padding: 20,
    borderRadius: 50,
  },
  buttonText: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
  },
  greenButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  permissionText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 300,
  },
  nextButton: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: '#1E90FF', // ✅ 파란색 버튼 스타일
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 50,
  },
  tempButton: {
    position: 'absolute',
    bottom: 150, // ✅ 하단에서 약간 위로 배치
    alignSelf: 'center',
    backgroundColor: '#32CD32', // ✅ 연두색 스타일
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 50,
  },
  backImage: {
    position: 'absolute',
    alignSelf: 'center',
    width: width * 0.8,
    height: height * 0.8,
    marginBottom: height * 0.005,
    marginTop: height * 0.05,
  },
});

export default Stage4Camera;
