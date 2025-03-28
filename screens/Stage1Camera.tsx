// import React, {useEffect, useRef, useState} from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   Platform,
// } from 'react-native';
// import {Camera, CameraDevice} from 'react-native-vision-camera';

// const SERVER_URL = 'https://escapesmu.onrender.com/compare'; // ✅ 서버 URL

// const Stage1Camera = ({navigation}: {navigation: any}) => {
//   const [permission, setPermission] = useState<boolean | null>(null);
//   const [device, setDevice] = useState<CameraDevice | undefined>();
//   const camera = useRef<Camera>(null);

//   useEffect(() => {
//     const checkPermission = async () => {
//       const cameraPermission = await Camera.getCameraPermissionStatus();
//       console.log(`🔍 현재 권한 상태: ${cameraPermission}`);

//       const isGranted = cameraPermission === 'granted';

//       setPermission(isGranted);
//     };

//     const loadDevices = async () => {
//       const availableDevices = await Camera.getAvailableCameraDevices();
//       console.log('📷 사용 가능한 장치 목록:', availableDevices);

//       const selectedCamera = availableDevices.find(
//         dev => dev.position === 'back',
//       );
//       setDevice(selectedCamera);
//     };

//     checkPermission();
//     loadDevices();
//   }, []);

//   useEffect(() => {
//     console.log(`✅ 카메라 권한 업데이트됨: ${permission}`);
//   }, [permission]);

//   const takePicture = async () => {
//     if (camera.current) {
//       try {
//         console.log('📸 촬영 시작...');
//         const photo = await camera.current.takePhoto({quality: 90});
//         console.log('📸 촬영 완료:', photo.path);

//         // ✅ 서버로 전송할 FormData 생성
//         const formData = new FormData();
//         formData.append('file', {
//           uri: `file://${photo.path}`,
//           type: 'image/jpeg',
//           name: 'captured.jpg',
//         });

//         console.log('🚀 서버로 전송 중...');
//         const response = await fetch(SERVER_URL, {
//           method: 'POST',
//           body: formData,
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         });
//         const data = await response.json();
//         console.log('📝 비교 결과:', data);

//         if (data.result === 'Pass') {
//           Alert.alert('✅ 성공!', '다음 단계로 이동합니다.');
//           navigation.navigate('Stage1_2'); // ✅ 다음 스테이지로 이동
//         } else {
//           Alert.alert('❌ 실패', '다시 시도해주세요.');
//         }
//       } catch (error) {
//         console.error('서버 오류:', error);
//         Alert.alert('오류', '사진을 전송할 수 없습니다.');
//       }
//     }
//   };

//   if (permission === null) return <Text>🔄 권한 확인 중...</Text>;

//   if (!permission) {
//     return (
//       <Text style={styles.permissionText}>
//         ⚠️ 카메라 권한이 필요합니다.{'\n\n'}
//         iOS: 설정 → EscampeSMU → 카메라 ON!
//       </Text>
//     );
//   }
//   const goToNextStage = () => {
//     navigation.navigate('Stage1_2'); // ✅ Stage1_2로 이동
//   };

//   if (!device) {
//     return (
//       <Text>⚠️ 카메라 장치를 찾을 수 없습니다. 실제 기기에서 실행하세요.</Text>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Camera
//         ref={camera}
//         style={styles.camera}
//         device={device}
//         isActive={true}
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

//       {/* ✅ 임시 Stage1_2 이동 버튼 */}
//       <TouchableOpacity onPress={goToNextStage} style={styles.tempButton}>
//         <Text style={styles.buttonText}>Stage1_2로 이동</Text>
//       </TouchableOpacity>
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
//   permissionText: {
//     color: 'black',
//     fontSize: 20,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginTop: 300,
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

// export default Stage1Camera;

import React, {useEffect, useRef, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import {Camera, CameraDevice} from 'react-native-vision-camera';

// const SERVER_URL = 'https://escapesmu.onrender.com/compare';
const SERVER_URL = 'http://34.64.239.59:8000/compare'; // ✅ 서버 URL, GCP 서버 주소로 변경

const Stage1Camera = ({navigation}: {navigation: any}) => {
  const [permission, setPermission] = useState<boolean | null>(null);
  const [device, setDevice] = useState<CameraDevice | undefined>();
  const camera = useRef<Camera>(null);

  useEffect(() => {
    const checkPermission = async () => {
      const cameraPermission = await Camera.getCameraPermissionStatus();
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
      const formData = new FormData();
      formData.append('file', {
        uri: `file://${photo.path}`,
        type: 'image/jpeg',
        name: 'captured.jpg',
      });

      const startTime = Date.now();
      const response = await fetch(SERVER_URL, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const elapsed = Date.now() - startTime;
      console.log(`⏱️ 서버 응답 시간: ${elapsed}ms`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ 서버 에러 응답:', errorText);
        Alert.alert('❌ 실패', '응답 실패. 다시 시도해주세요.');
        return;
      }

      const data = await response.json();
      console.log('📝 비교 결과:', data);

      if (data.result === 'Pass') {
        Alert.alert('✅ 성공!', '다음 단계로 이동합니다.');
        navigation.navigate('Stage1_2');
      } else {
        Alert.alert('❌ 실패', '다시 시도해주세요.');
      }
    } catch (error) {
      console.error('🚨 서버 오류:', error);
      Alert.alert('❌ 실패', '서버 응답이 없습니다. 다시 시도해주세요.');
    }
  };

  if (permission === null) return <Text>🔄 권한 확인 중...</Text>;

  if (!permission) {
    return (
      <Text style={styles.permissionText}>
        ⚠️ 카메라 권한이 필요합니다.{'\n\n'}
        iOS: 설정 → EscampeSMU → 카메라 ON!
      </Text>
    );
  }

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
      <TouchableOpacity onPress={takePicture} style={styles.captureButton}>
        <Text style={styles.buttonText}>📸</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('Stage1_2')}
        style={styles.nextButton}>
        <Text style={styles.buttonText}>다음 ➡️</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('Stage1_2')}
        style={styles.tempButton}>
        <Text style={styles.buttonText}>Stage1_2로 이동</Text>
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
    alignSelf: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 50,
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
    backgroundColor: '#1E90FF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 50,
  },
  tempButton: {
    position: 'absolute',
    bottom: 150,
    alignSelf: 'center',
    backgroundColor: '#32CD32',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 50,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Stage1Camera;
