// import React, {useEffect, useRef, useState} from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   Dimensions,
//   Modal,
//   ActivityIndicator,
//   Platform,
//   Image,
// } from 'react-native';
// import {Camera, CameraDevice} from 'react-native-vision-camera';
// import {RouteProp, useIsFocused, useRoute} from '@react-navigation/native';
// import axios from 'axios';
// import {RootStackParamList} from '../App';
// import {updateStageData} from '../utils/updateStageData';
// import {incrementStageAttempt} from '../utils/incrementStageAttempt';
// import {onAuthStateChanged} from 'firebase/auth';
// import {auth} from './firebase.config';

// const {width, height} = Dimensions.get('window');
// type Stage1CameraRouteProp = RouteProp<RootStackParamList, 'Stage1Camera'>;

// const SERVER_URL = 'http://34.47.88.216:8000/gpt-compare';

// const Stage1Camera = ({navigation}: {navigation: any}) => {
//   const [permission, setPermission] = useState<boolean | null>(null);
//   const [device, setDevice] = useState<CameraDevice | undefined>();
//   const [isUploading, setIsUploading] = useState(false);
//   const camera = useRef<Camera>(null);
//   const [userId, setUserId] = useState<string>('test-user');
//   const isFocused = useIsFocused();
//   const route = useRoute<Stage1CameraRouteProp>();
//   const {college, department} = route.params || {};

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
//     if (!camera.current || !userId) {
//       Alert.alert('❌ 사용자 정보 오류', '로그인 상태를 확인하세요.');
//       return;
//     }
//     if (!camera.current) return;
//     try {
//       const photo = await camera.current.takePhoto({quality: 90});
//       const fileUri =
//         Platform.OS === 'ios' ? photo.path : `file://${photo.path}`;

//       const formData = new FormData();
//       formData.append('file', {
//         uri: fileUri,
//         name: 'captured.jpg',
//         type: 'image/jpeg',
//       });
//       formData.append('user_id', userId);
//       formData.append('stage', 'stage1');

//       setIsUploading(true);
//       const response = await axios.post(SERVER_URL, formData, {
//         headers: {'Content-Type': 'multipart/form-data'},
//       });
//       setIsUploading(false);

//       let actualCollege = college;
//       if (department === '디지털만화영상' || department === '사진영상') {
//         actualCollege = '융합기술대학';
//       }

//       const result = response.data.result;
//       if (result.includes('같') || result.includes('Pass')) {
//         await updateStageData(userId, actualCollege, 'Stage1_2');
//         Alert.alert('✅ 성공', '정답입니다!', [
//           {
//             text: '다음 단계로',
//             onPress: () =>
//               navigation.navigate('Stage1_2', {
//                 college: actualCollege,
//                 department,
//               }),
//           },
//         ]);
//       } else if (result.includes('다르')) {
//         incrementStageAttempt(userId, actualCollege);
//         Alert.alert('❌ 실패', '다른 이미지입니다. 다시 시도하세요.');
//       } else {
//         incrementStageAttempt(userId, actualCollege);
//         Alert.alert('⚠️ GPT 응답', result);
//       }
//     } catch (err: any) {
//       console.error('🚨 오류:', err);
//       setIsUploading(false);
//       Alert.alert('에러', '처리 중 문제가 발생했습니다.');
//     }
//   };

//   if (permission === null) return <Text>🔄 권한 확인 중...</Text>;
//   if (!permission) return <Text>⚠️ 카메라 권한이 필요합니다.</Text>;
//   if (!device) return <Text>⚠️ 카메라 로딩 실패</Text>;

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
//         style={styles.overlay}
//         resizeMode="contain"
//       />

//       <TouchableOpacity onPress={takePicture} style={styles.captureButton}>
//         <Text style={styles.buttonText}>📸</Text>
//       </TouchableOpacity>

//       <Modal visible={isUploading} transparent>
//         <View style={styles.modalOverlay}>
//           <ActivityIndicator size="large" color="#fff" />
//           <Text style={{color: '#fff', marginTop: 10}}>사진 확인 중...</Text>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {flex: 1, backgroundColor: '#000'},
//   camera: {width: '100%', height: '100%'},
//   overlay: {
//     position: 'absolute',
//     alignSelf: 'center',
//     width: width * 0.8,
//     height: height * 0.8,
//     marginTop: height * 0.05,
//     opacity: 0.4,
//   },
//   captureButton: {
//     position: 'absolute',
//     bottom: 100,
//     alignSelf: 'center',
//     backgroundColor: '#fff',
//     padding: 20,
//     borderRadius: 50,
//   },
//   buttonText: {fontSize: 18, color: '#000', fontWeight: 'bold'},
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.6)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default Stage1Camera;

// import React, {useEffect, useRef, useState} from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   Dimensions,
//   Modal,
//   ActivityIndicator,
//   Platform,
//   Image,
// } from 'react-native';
// import {Camera, CameraDevice} from 'react-native-vision-camera';
// import {RouteProp, useIsFocused, useRoute} from '@react-navigation/native';
// import axios from 'axios';
// import {RootStackParamList} from '../App';
// import {updateStageData} from '../utils/updateStageData';
// import {incrementStageAttempt} from '../utils/incrementStageAttempt';
// import {onAuthStateChanged} from 'firebase/auth';
// import {auth} from './firebase.config';
// import Geolocation from '@react-native-community/geolocation';

// const {width, height} = Dimensions.get('window');
// type Stage1CameraRouteProp = RouteProp<RootStackParamList, 'Stage1Camera'>;
// const SERVER_URL = 'http://34.47.88.216:8000/gpt-compare';

// // 상명대학교 정문 위치
// const FRONT_GATE = {
//   lat: 37.252781,
//   lng: 127.117477,
// };

// function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
//   const R = 6371000;
//   const dLat = ((lat2 - lat1) * Math.PI) / 180;
//   const dLon = ((lon2 - lon1) * Math.PI) / 180;
//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos((lat1 * Math.PI) / 180) *
//       Math.cos((lat2 * Math.PI) / 180) *
//       Math.sin(dLon / 2) *
//       Math.sin(dLon / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c;
// }

// const Stage1Camera = ({navigation}: {navigation: any}) => {
//   const [permission, setPermission] = useState<boolean | null>(null);
//   const [device, setDevice] = useState<CameraDevice | undefined>();
//   const [isUploading, setIsUploading] = useState(false);
//   const camera = useRef<Camera>(null);
//   const [userId, setUserId] = useState<string>('');
//   const isFocused = useIsFocused();
//   const route = useRoute<Stage1CameraRouteProp>();
//   const {college, department} = route.params || {};

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
//     if (!camera.current || !userId) {
//       Alert.alert('❌ 사용자 정보 오류', '로그인 상태를 확인하세요.');
//       return;
//     }

//     Geolocation.getCurrentPosition(
//       async pos => {
//         const {latitude, longitude} = pos.coords;
//         const distance = getDistanceFromLatLonInMeters(
//           latitude,
//           longitude,
//           FRONT_GATE.lat,
//           FRONT_GATE.lng,
//         );
//         console.log('📍거리 차이:', distance.toFixed(2), 'm');

//         if (distance > 30) {
//           Alert.alert('❌ 위치 제한', '30미터 이내에서만 촬영할 수 있습니다.');
//           return;
//         }

//         try {
//           const photo = await camera.current.takePhoto({quality: 90});
//           const fileUri =
//             Platform.OS === 'ios' ? photo.path : `file://${photo.path}`;

//           const formData = new FormData();
//           formData.append('file', {
//             uri: fileUri,
//             name: 'captured.jpg',
//             type: 'image/jpeg',
//           });
//           formData.append('user_id', userId);
//           formData.append('stage', 'stage1');

//           setIsUploading(true);
//           const response = await axios.post(SERVER_URL, formData, {
//             headers: {'Content-Type': 'multipart/form-data'},
//           });
//           setIsUploading(false);

//           let actualCollege = college;
//           if (department === '디지털만화영상' || department === '사진영상') {
//             actualCollege = '융합기술대학';
//           }

//           const result = response.data.result;
//           if (result.includes('같') || result.includes('Pass')) {
//             await updateStageData(userId, actualCollege, 'Stage1_2');
//             Alert.alert('✅ 성공', '정답입니다!', [
//               {
//                 text: '다음 단계로',
//                 onPress: () =>
//                   navigation.navigate('Stage1_2', {
//                     college: actualCollege,
//                     department,
//                   }),
//               },
//             ]);
//           } else {
//             incrementStageAttempt(userId, actualCollege);
//             Alert.alert('❌ 실패', '다른 이미지입니다. 다시 시도하세요.');
//           }
//         } catch (err: any) {
//           console.error('🚨 오류:', err);
//           setIsUploading(false);
//           Alert.alert('에러', '처리 중 문제가 발생했습니다.');
//         }
//       },
//       error => {
//         console.error('🚨 위치 오류:', error);
//         Alert.alert('❌ 위치 정보 오류', '위치를 가져올 수 없습니다.');
//       },
//       {enableHighAccuracy: true, timeout: 10000, maximumAge: 5000},
//     );
//   };

//   if (permission === null) return <Text>🔄 권한 확인 중...</Text>;
//   if (!permission) return <Text>⚠️ 카메라 권한이 필요합니다.</Text>;
//   if (!device) return <Text>⚠️ 카메라 로딩 실패</Text>;

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
//         style={styles.overlay}
//         resizeMode="contain"
//       />

//       <TouchableOpacity onPress={takePicture} style={styles.captureButton}>
//         <Text style={styles.buttonText}>📸</Text>
//       </TouchableOpacity>

//       <Modal visible={isUploading} transparent>
//         <View style={styles.modalOverlay}>
//           <ActivityIndicator size="large" color="#fff" />
//           <Text style={{color: '#fff', marginTop: 10}}>사진 확인 중...</Text>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {flex: 1, backgroundColor: '#000'},
//   camera: {width: '100%', height: '100%'},
//   overlay: {
//     position: 'absolute',
//     alignSelf: 'center',
//     width: width * 0.8,
//     height: height * 0.8,
//     marginTop: height * 0.05,
//     opacity: 0.4,
//   },
//   captureButton: {
//     position: 'absolute',
//     bottom: 100,
//     alignSelf: 'center',
//     backgroundColor: '#fff',
//     padding: 20,
//     borderRadius: 50,
//   },
//   buttonText: {fontSize: 18, color: '#000', fontWeight: 'bold'},
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.6)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default Stage1Camera;

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
  Image,
  PermissionsAndroid,
} from 'react-native';
import {Camera, CameraDevice} from 'react-native-vision-camera';
import {RouteProp, useIsFocused, useRoute} from '@react-navigation/native';
import axios from 'axios';
import {RootStackParamList} from '../App';
import {updateStageData} from '../utils/updateStageData';
import {incrementStageAttempt} from '../utils/incrementStageAttempt';
import {onAuthStateChanged} from 'firebase/auth';
import {auth} from './firebase.config';
import Geolocation from '@react-native-community/geolocation';

const {width, height} = Dimensions.get('window');
type Stage1CameraRouteProp = RouteProp<RootStackParamList, 'Stage1Camera'>;
const SERVER_URL = 'http://34.47.88.216:8000/gpt-compare';

const FRONT_GATE = {
  lat: 37.252781,
  lng: 127.117477,
};

function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
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
}

const requestLocationPermission = async () => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
};

const Stage1Camera = ({navigation}: {navigation: any}) => {
  const [permission, setPermission] = useState<boolean | null>(null);
  const [device, setDevice] = useState<CameraDevice | undefined>();
  const [isUploading, setIsUploading] = useState(false);
  const camera = useRef<Camera>(null);
  const [userId, setUserId] = useState<string>('');
  const isFocused = useIsFocused();
  const route = useRoute<Stage1CameraRouteProp>();
  const {college, department} = route.params || {};

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
    if (!camera.current || !userId) {
      Alert.alert('❌ 사용자 정보 오류', '로그인 상태를 확인하세요.');
      return;
    }

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
          FRONT_GATE.lat,
          FRONT_GATE.lng,
        );
        console.log('📍거리 차이:', distance.toFixed(2), 'm');

        if (distance > 30) {
          Alert.alert('❌ 위치 제한', '30미터 이내에서만 촬영할 수 있습니다.');
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
          formData.append('stage', 'stage1');

          setIsUploading(true);
          const response = await axios.post(SERVER_URL, formData, {
            headers: {'Content-Type': 'multipart/form-data'},
          });
          setIsUploading(false);

          let actualCollege = college;
          if (department === '디지털만화영상' || department === '사진영상') {
            actualCollege = '융합기술대학';
          }

          const result = response.data.result;
          if (result.includes('같') || result.includes('Pass')) {
            await updateStageData(userId, actualCollege, 'Stage1_2');
            Alert.alert('✅ 성공', '정답입니다!', [
              {
                text: '다음 단계로',
                onPress: () =>
                  navigation.navigate('Stage1_2', {
                    college: actualCollege,
                    department,
                  }),
              },
            ]);
          } else {
            incrementStageAttempt(userId, actualCollege);
            Alert.alert('❌ 실패', '다른 이미지입니다. 다시 시도하세요.');
          }
        } catch (err: any) {
          console.error('🚨 오류:', err);
          setIsUploading(false);
          Alert.alert('에러', '처리 중 문제가 발생했습니다.');
        }
      },
      error => {
        console.error('🚨 위치 오류:', error);
        Alert.alert('❌ 위치 정보 오류', '위치를 가져올 수 없습니다.');
      },
      {enableHighAccuracy: true, timeout: 10000, maximumAge: 5000},
    );
  };

  if (permission === null) return <Text>🔄 권한 확인 중...</Text>;
  if (!permission) return <Text>⚠️ 카메라 권한이 필요합니다.</Text>;
  if (!device) {
    return (
      <View style={styles.modalOverlay}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={{color: '#fff', marginTop: 10}}>뒤로 갔다가 다시 실행해주세요!</Text>
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
        source={require('../assets/jeongmoon.png')}
        style={styles.overlay}
        resizeMode="contain"
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
  overlay: {
    position: 'absolute',
    alignSelf: 'center',
    width: width * 0.8,
    height: height * 0.8,
    marginTop: height * 0.05,
    opacity: 0.4,
  },
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
