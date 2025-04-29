// import React, {useEffect, useRef, useState} from 'react';
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   Dimensions,
//   Modal,
//   ActivityIndicator,
//   Platform,
// } from 'react-native';
// import {Camera, CameraDevice} from 'react-native-vision-camera';
// import {onAuthStateChanged} from 'firebase/auth';
// import {auth} from './firebase.config';
// import axios from 'axios';
// import {useRoute, RouteProp, useIsFocused} from '@react-navigation/native';
// import {RootStackParamList} from '../App';
// import {updateStageData} from '../utils/updateStageData';
// import {incrementStageAttempt} from '../utils/incrementStageAttempt';
// import {departmentToCollege} from '../utils/departmentToCollege';
// import {useFocusEffect} from '@react-navigation/native';
// const {width, height} = Dimensions.get('window');

// type Stage1CameraRouteProp = RouteProp<RootStackParamList, 'Stage1Camera'>;

// const SERVER_URL = 'http://34.47.88.216:8000/compare';

// const Stage1Camera = ({navigation}: {navigation: any}) => {
//   const [permission, setPermission] = useState<boolean | null>(null);
//   const [device, setDevice] = useState<CameraDevice | undefined>();
//   const [isUploading, setIsUploading] = useState(false);
//   const [showResult, setShowResult] = useState(false);
//   const [pass, setPass] = useState(false);
//   const [userId, setUserId] = useState<string>('');
//   const camera = useRef<Camera>(null);

//   const route = useRoute<Stage1CameraRouteProp>();
//   const {college, department} = route.params || {};

//   const isFocused = useIsFocused(); // 화면 포커스 상태 가져옴

//   useEffect(() => {
//     const checkPermission = async () => {
//       const cameraPermission = await Camera.requestCameraPermission();
//       setPermission(cameraPermission === 'granted');
//     };

//     const loadDevices = async () => {
//       const devices = await Camera.getAvailableCameraDevices();
//       const selected = devices.find(dev => dev.position === 'back');
//       setDevice(selected);
//     };

//     const fetchUser = () => {
//       const unsubscribe = onAuthStateChanged(auth, user => {
//         if (user) {
//           setUserId(user.uid);
//         }
//       });
//       return unsubscribe;
//     };

//     checkPermission();
//     loadDevices();
//     const unsubscribeAuth = fetchUser();

//     return () => unsubscribeAuth();
//   }, []);

//   const takePicture = async () => {
//     if (!camera.current || !userId) return;

//     try {
//       const photo = await camera.current.takePhoto({quality: 90});
//       const fileUri =
//         Platform.OS === 'ios' ? photo.path : `file://${photo.path}`;

//       const formData = new FormData();
//       const fileData = {
//         uri: fileUri,
//         name: 'captured.jpg',
//         type: 'image/jpeg',
//       };
//       formData.append('file', fileData);
//       formData.append('user_id', userId);
//       formData.append('stage', 'stage1');

//       setIsUploading(true);
//       const response = await axios.post(SERVER_URL, formData, {
//         headers: {'Content-Type': 'multipart/form-data'},
//         timeout: 10000,
//       });
//       setIsUploading(false);
//       let actualCollege = college;
//       if (department === '디지털만화영상' || department === '사진영상') {
//         actualCollege = '융합기술대학';
//       }

//       const data = response.data;
//       if (data.result === 'Pass') {
//         try {
//           await updateStageData(userId, actualCollege, 'Stage1_2');
//         } catch (err) {
//           console.error('🔥 updateStageData error:', err);
//         }
//         setPass(true);
//       } else {
//         incrementStageAttempt(userId, actualCollege);
//         setPass(false);
//       }
//       setShowResult(true);
//     } catch (error: any) {
//       setIsUploading(false);
//       console.error('🚨 서버 오류:', error);
//       Alert.alert('❌ 실패', '서버 연결에 실패했습니다.');
//     }
//   };

//   const goToNextStage = async () => {
//     let actualCollege = college;
//     if (department === '디지털만화영상' || department === '사진영상') {
//       actualCollege = '융합기술대학';
//     }
//     await updateStageData(userId, actualCollege, 'Stage1_2');
//     navigation.navigate('Stage1_2', {college: actualCollege, department});
//   };

//   if (permission === null) return <Text>🔄 권한 확인 중...</Text>;
//   if (!permission) {
//     return (
//       <Text style={styles.permissionText}>
//         ⚠️ 카메라 권한이 필요합니다. iOS: 설정 → EscampeSMU → 카메라 ON!
//       </Text>
//     );
//   }

//   if (!device) {
//     return (
//       <View style={styles.modalOverlay}>
//         <ActivityIndicator size="large" color="#fff" />
//         <Text style={{color: '#fff', marginTop: 10}}>뒤로 갔다가 다시 실행해주세요!</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Camera
//         ref={camera}
//         style={styles.camera}
//         device={device}
//         isActive={isFocused}
//         photo={true}
//       />

//       <Image
//         source={require('../assets/jeongmoon.png')}
//         style={styles.backImage}
//         resizeMode="contain"
//       />

//       <TouchableOpacity onPress={takePicture} style={styles.captureButton}>
//         <Text style={styles.buttonText}>📸</Text>
//       </TouchableOpacity>

//       <TouchableOpacity onPress={goToNextStage} style={styles.tempButton}>
//         <Text style={styles.buttonText}>Stage1_2로 이동</Text>
//       </TouchableOpacity>

//       <Modal visible={isUploading} transparent>
//         <View style={styles.modalOverlay}>
//           <ActivityIndicator size="large" color="#fff" />
//           <Text style={{color: '#fff', marginTop: 10}}>사진 확인 중...</Text>
//         </View>
//       </Modal>

//       {/* <Modal visible={showResult} transparent animationType="fade"> */}
//       {/* <View style={styles.modalOverlay}> */}
//       {/* <View style={styles.modalContainer}> */}
//       {/* <Text style={styles.modalText}>
//               {pass
//                 ? '✅ 성공! 다음 단계로 이동합니다.'
//                 : '❌ 실패! 다시 시도해주세요.'}
//             </Text>
//             <TouchableOpacity
//               style={styles.resultButton}
//               onPress={() => {
//                 if (pass) {
//                   goToNextStage();
//                 } else {
//                   setShowResult(false);
//                 }
//               }}>
//               <Text style={styles.buttonText}>
//                 {pass ? '다음으로' : '다시 시도'}
//               </Text>
//             </TouchableOpacity> */}
//       {/* </View> */}
//       {/* </View> */}
//       {/* </Modal> */}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {flex: 1, backgroundColor: '#000'},
//   camera: {width: '100%', height: '100%'},
//   captureButton: {
//     position: 'absolute',
//     bottom: 100,
//     left: '30%',
//     backgroundColor: '#fff',
//     padding: 20,
//     borderRadius: 50,
//   },
//   tempButton: {
//     position: 'absolute',
//     bottom: 160,
//     alignSelf: 'center',
//     backgroundColor: '#32CD32',
//     paddingVertical: 15,
//     paddingHorizontal: 30,
//     borderRadius: 50,
//   },
//   buttonText: {fontSize: 18, color: '#000', fontWeight: 'bold'},
//   permissionText: {
//     color: 'black',
//     fontSize: 20,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginTop: 300,
//   },
//   backImage: {
//     position: 'absolute',
//     alignSelf: 'center',
//     width: width * 0.8,
//     height: height * 0.8,
//     marginBottom: height * 0.005,
//     marginTop: height * 0.05,
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.6)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContainer: {
//     backgroundColor: '#fff',
//     padding: 30,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   modalText: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 20,
//   },
//   resultButton: {
//     backgroundColor: '#1E90FF',
//     paddingVertical: 12,
//     paddingHorizontal: 30,
//     borderRadius: 30,
//   },
// });

// export default Stage1Camera;

// ✅ 1. Stage1Camera.tsx 수정 버전
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  Modal,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {Camera, CameraDevice} from 'react-native-vision-camera';
import {useIsFocused} from '@react-navigation/native';
import RNFS from 'react-native-fs';
import axios from 'axios';

const {width, height} = Dimensions.get('window');

const SERVER_URL = 'http://34.47.88.216:8000/gpt-compare'; // 백엔드에 새 라우트 필요

const Stage1Camera = ({navigation}: {navigation: any}) => {
  const [permission, setPermission] = useState<boolean | null>(null);
  const [device, setDevice] = useState<CameraDevice | undefined>();
  const [isUploading, setIsUploading] = useState(false);
  const camera = useRef<Camera>(null);
  const isFocused = useIsFocused();

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
    checkPermission();
    loadDevices();
  }, []);

  const takePicture = async () => {
    if (!camera.current) return;
    try {
      const photo = await camera.current.takePhoto({quality: 90});
      const fileUri =
        Platform.OS === 'ios' ? photo.path : `file://${photo.path}`;
      const base64Image = await RNFS.readFile(fileUri, 'base64');

      setIsUploading(true);
      const response = await axios.post(SERVER_URL, {image: base64Image});
      setIsUploading(false);

      const result = response.data.result;
      if (result.includes('같')) {
        Alert.alert('✅ 성공', '정답입니다!');
      } else if (result.includes('다르')) {
        Alert.alert('❌ 실패', '다른 이미지입니다. 다시 시도하세요.');
      } else {
        Alert.alert('⚠️ GPT 응답', result);
      }
    } catch (err: any) {
      console.error('🚨 오류:', err);
      setIsUploading(false);
      Alert.alert('에러', '처리 중 문제가 발생했습니다.');
    }
  };

  if (permission === null) return <Text>🔄 권한 확인 중...</Text>;
  if (!permission) return <Text>⚠️ 카메라 권한이 필요합니다.</Text>;
  if (!device) return <Text>⚠️ 카메라 로딩 실패</Text>;

  return (
    <View style={styles.container}>
      <Camera
        ref={camera}
        style={styles.camera}
        device={device}
        isActive={isFocused}
        photo={true}
      />
      <TouchableOpacity onPress={takePicture} style={styles.captureButton}>
        <Text style={styles.buttonText}>📸</Text>
      </TouchableOpacity>
      <Modal visible={isUploading} transparent>
        <View style={styles.modalOverlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={{color: '#fff', marginTop: 10}}>사진 확인 중...</Text>
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
  buttonText: {fontSize: 18, color: '#000', fontWeight: 'bold'},
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Stage1Camera;
