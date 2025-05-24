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
// import {decrementStageAttempt} from '../utils/decrementStageAttempt';
// import CustomText from '../CustomText';

// const {width, height} = Dimensions.get('window');

// type Stage3CameraRouteProp = RouteProp<RootStackParamList, 'Stage3Camera'>;

// const SERVER_URL = 'http://34.47.88.216:8000/compare';

// const Stage3Camera = ({navigation}: {navigation: any}) => {
//   const [permission, setPermission] = useState<boolean | null>(null);
//   const [device, setDevice] = useState<CameraDevice | undefined>();
//   const [isUploading, setIsUploading] = useState(false);
//   const [showResult, setShowResult] = useState(false);
//   const [pass, setPass] = useState(false);
//   const [userId, setUserId] = useState<string>('');
//   const camera = useRef<Camera>(null);

//   const route = useRoute<Stage3CameraRouteProp>();
//   const {college, department} = route.params || {};
//   const isFocused = useIsFocused(); // 화면 포커스 상태 가져옴

//   useEffect(() => {
//     if (permission && !device) {
//       const timeout = setTimeout(() => {
//         navigation.replace('Stage3_1', {college, department});
//       }, 100);

//       return () => clearTimeout(timeout);
//     }
//   }, [permission, device]);

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
//       formData.append('stage', 'stage3');

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
//           await updateStageData(userId, actualCollege, 'Stage3_2');
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
//     await updateStageData(userId, actualCollege, 'Stage3_2');
//     navigation.navigate('Stage3_2', {college: actualCollege, department});
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
//         <Text style={{color: '#fff', marginTop: 20, fontSize: 16}}>
//           📸 카메라 기기 불러오는 중..
//         </Text>
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
//         source={require('../assets/maple-removebg-preview.png')}
//         style={styles.backImage}
//         resizeMode="contain"
//       />

//       <TouchableOpacity onPress={takePicture} style={styles.captureButton}>
//         <Text style={styles.buttonText}>📸</Text>
//       </TouchableOpacity>

//       {/* <TouchableOpacity onPress={goToNextStage} style={styles.tempButton}>
//         <Text style={styles.buttonText}>Stage3_2로 이동</Text>
//       </TouchableOpacity> */}

//       <Modal visible={isUploading} transparent>
//         <View style={styles.modalOverlay}>
//           <ActivityIndicator size="large" color="#fff" />
//           <Text style={{color: '#fff', marginTop: 10}}>사진 확인 중...</Text>
//         </View>
//       </Modal>

//       <Modal visible={showResult} transparent animationType="fade">
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContainer}>
//             <CustomText style={styles.modalText}>
//               {pass
//                 ? '✅ 성공! 다음 단계로 이동합니다.'
//                 : '❌ 실패! 다시 시도해주세요.'}
//             </CustomText>
//             <TouchableOpacity
//               style={styles.resultButton}
//               onPress={() => {
//                 setShowResult(false); // ✅ 먼저 모달 닫기
//                 if (pass) {
//                   goToNextStage();
//                 }
//               }}>
//               <CustomText style={styles.buttonText}>
//                 {pass ? '다음으로' : '다시 시도'}
//               </CustomText>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {flex: 1, backgroundColor: '#000'},
//   camera: {width: '100%', height: '100%'},
//   captureButton: {
//     position: 'absolute',
//     bottom: 100,
//     alignSelf: 'center',
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
//   buttonText: {fontSize: 18, color: '#000'},
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

// export default Stage3Camera;

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
import CustomText from '../CustomText';
import Geolocation from '@react-native-community/geolocation';
import {PermissionsAndroid} from 'react-native';

const {width, height} = Dimensions.get('window');
const SERVER_URL = 'http://34.47.88.216:8000/compare';
const STAGE3_LOCATION = {lat: 36.83402, lng: 127.176613}; // example location

const getDistanceFromLatLonInMeters = (lat1, lon1, lat2, lon2) => {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const requestLocationPermission = async () => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
};

type Stage3CameraRouteProp = RouteProp<RootStackParamList, 'Stage3Camera'>;

const Stage3Camera = ({navigation}: {navigation: any}) => {
  const [permission, setPermission] = useState<boolean | null>(null);
  const [device, setDevice] = useState<CameraDevice | undefined>();
  const [isUploading, setIsUploading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [pass, setPass] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const camera = useRef<Camera>(null);
  const route = useRoute<Stage3CameraRouteProp>();
  const {college, department} = route.params || {};
  const isFocused = useIsFocused();

  useEffect(() => {
    if (permission && !device) {
      const timeout = setTimeout(() => {
        navigation.replace('Stage3_1', {college, department});
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

    const hasLocationPermission = await requestLocationPermission();
    if (!hasLocationPermission) {
      Alert.alert('❌ 위치 권한', '위치 권한이 필요합니다.');
      return;
    }

    Geolocation.getCurrentPosition(
      async pos => {
        const {latitude, longitude} = pos.coords;
        const distance = getDistanceFromLatLonInMeters(
          latitude,
          longitude,
          STAGE3_LOCATION.lat,
          STAGE3_LOCATION.lng,
        );

        console.log('📍거리 차이:', distance.toFixed(2), 'm');

        if (distance > 100) {
          // 거리 제한
          Alert.alert('❌ 위치 제한', '식물과학관 내부에서 촬영해주세요.'); //경고 문구
          return;
        }

        try {
          const photo = await camera.current.takePhoto({quality: 90});
          const fileUri =
            Platform.OS === 'ios' ? photo.path : `file://${photo.path}`;

          const formData = new FormData();
          formData.append('file', {
            uri: fileUri,
            name: 'captured.jpg',
            type: 'image/jpeg',
          });
          formData.append('user_id', userId);
          formData.append('stage', 'stage3');

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
            await updateStageData(userId, actualCollege, 'Stage3_2');
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
      },
      error => {
        console.error('❌ 위치 정보 오류:', error);
        Alert.alert(
          '❌ 위치 정보 오류',
          '설정 - EscapeSMU - 항상 허용으로 바꿔주세요',
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  const goToNextStage = async () => {
    let actualCollege = college;
    if (department === '디지털만화영상' || department === '사진영상') {
      actualCollege = '융합기술대학';
    }
    await updateStageData(userId, actualCollege, 'Stage3_2');
    navigation.navigate('Stage3_2', {college: actualCollege, department});
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
        source={require('../assets/maple-removebg-preview.png')}
        style={styles.backImage}
        resizeMode="contain"
      />

      <TouchableOpacity
        onPress={goToNextStage}
        style={[
          styles.captureButton,
          {bottom: 180, backgroundColor: '#1E90FF'},
        ]}>
        <Text style={[styles.buttonText, {color: 'white'}]}>다음 ➡️</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={takePicture} style={styles.captureButton}>
        <Text style={styles.buttonText}>📸</Text>
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
            <CustomText style={styles.modalText}>
              {pass
                ? '✅ 성공! 다음 단계로 이동합니다.'
                : '❌ 실패! 다시 시도해주세요.'}
            </CustomText>
            <TouchableOpacity
              style={styles.resultButton}
              onPress={() => {
                setShowResult(false);
                if (pass) goToNextStage();
              }}>
              <CustomText style={styles.buttonText}>
                {pass ? '다음으로' : '다시 시도'}
              </CustomText>
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
  buttonText: {fontSize: 18, color: '#000'},
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

export default Stage3Camera;
