// import React, {useEffect, useRef, useState} from 'react';
// import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
// import {Camera, CameraDevice} from 'react-native-vision-camera';

// const Stage1Camera = ({navigation}: {navigation: any}) => {
//   const [permission, setPermission] = useState(false);
//   const [device, setDevice] = useState<CameraDevice | undefined>();
//   const camera = useRef<Camera>(null);

//   useEffect(() => {
//     const checkPermission = async () => {
//       const cameraPermission = await Camera.getCameraPermissionStatus();
//       console.log(`현재 권한 상태: ${cameraPermission}`);

//       if (cameraPermission === 'not-determined') {
//         const status = await Camera.requestCameraPermission();
//         setPermission(status === 'authorized');
//       } else if (cameraPermission === 'authorized') {
//         setPermission(true);
//       } else {
//         setPermission(false);
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

//       let selectedCamera;
//       if (Platform.OS === 'ios') {
//         selectedCamera = availableDevices.find(dev => dev.position === 'back');
//       } else {
//         selectedCamera = availableDevices.find(
//           dev =>
//             dev.position === 'back' ||
//             dev.sensorOrientation === 'landscape-left' ||
//             dev.sensorOrientation === 90,
//         );
//       }

//       console.log('선택된 카메라 상태:', selectedCamera);

//       if (selectedCamera) {
//         setTimeout(() => setDevice(selectedCamera), 100);
//       }
//     };

//     checkPermission();
//     loadDevices();
//   }, []);

//   const takePicture = async () => {
//     if (camera.current) {
//       const photo = await camera.current.takePhoto();
//       console.log(`사진 저장 경로: ${photo.path}`);
//       navigation.goBack();
//     }
//   };

//   if (!device) {
//     return (
//       <Text>⚠️ 카메라 장치를 찾을 수 없습니다. 실제 기기에서 실행하세요.</Text>
//     );
//   }

//   if (!permission) {
//     return <Text>⚠️ 카메라 권한이 필요합니다.</Text>;
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
//       <TouchableOpacity onPress={takePicture} style={styles.captureButton}>
//         <Text style={styles.buttonText}>📸</Text>
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
//     bottom: 40,
//     alignSelf: 'center',
//     backgroundColor: '#fff',
//     padding: 20,
//     borderRadius: 50,
//   },
//   buttonText: {
//     fontSize: 20,
//   },
// });

// export default Stage1Camera;

// import React, {useEffect, useRef, useState} from 'react';
// import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
// import {Camera, CameraDevice} from 'react-native-vision-camera';

// const Stage1Camera = ({navigation}: {navigation: any}) => {
//   const [permission, setPermission] = useState(false);
//   const [device, setDevice] = useState<CameraDevice | undefined>();
//   const [isActive, setIsActive] = useState(false); // ✅ isActive 상태 관리 추가
//   const camera = useRef<Camera>(null);

//   useEffect(() => {
//     const checkPermission = async () => {
//       const cameraPermission = await Camera.getCameraPermissionStatus();
//       console.log(`현재 권한 상태: ${cameraPermission}`);

//       if (cameraPermission === 'not-determined') {
//         const status = await Camera.requestCameraPermission();
//         setPermission(status === 'authorized');
//       } else {
//         setPermission(cameraPermission === 'authorized');
//       }
//     };

//     const loadDevices = async () => {
//       const availableDevices = await Camera.getAvailableCameraDevices();
//       console.log('🔍 사용 가능한 장치 목록:', availableDevices);

//       availableDevices.forEach((dev, index) => {
//         console.log(
//           `📷 장치 ${index}: position = ${dev.position}, sensorOrientation = ${dev.sensorOrientation}`,
//         );
//       });

//       let selectedCamera;

//       if (Platform.OS === 'ios') {
//         // ✅ iOS에서는 'back' + 'portrait' 또는 'landscape'인 장치를 찾음
//         selectedCamera = availableDevices.find(
//           dev =>
//             dev.position === 'back' &&
//             (dev.sensorOrientation === 'portrait' ||
//               dev.sensorOrientation === 'landscape-left'),
//         );
//       } else {
//         // ✅ Android에서는 일반적인 'back' 카메라를 선택
//         selectedCamera = availableDevices.find(dev => dev.position === 'back');
//       }

//       console.log('🎯 선택된 카메라 상태:', selectedCamera);

//       if (selectedCamera) {
//         setDevice(selectedCamera);
//       }
//     };

//     checkPermission();
//     loadDevices();
//   }, []);

//   useEffect(() => {
//     if (device) {
//       console.log('✅ 카메라 장치가 설정됨:', device);
//       setIsActive(true); // ✅ 카메라가 설정되면 활성화
//     }
//   }, [device]);

//   const takePicture = async () => {
//     if (camera.current) {
//       const photo = await camera.current.takePhoto();
//       console.log(`📸 사진 저장 경로: ${photo.path}`);
//       navigation.goBack();
//     }
//   };

//   if (!permission) {
//     return <Text>⚠️ 카메라 권한이 필요합니다.</Text>;
//   }

//   if (!device) {
//     return (
//       <Text>⚠️ 카메라 장치를 찾을 수 없습니다. 실제 기기에서 실행하세요.</Text>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Camera
//         ref={camera}
//         style={[styles.camera, {zIndex: 10}]} // ✅ 카메라가 위로 올라오도록 설정
//         device={device}
//         isActive={isActive} // ✅ 카메라 활성화
//         photo={true}
//       />
//       <TouchableOpacity onPress={takePicture} style={styles.captureButton}>
//         <Text style={styles.buttonText}>📸</Text>
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
//     bottom: 40,
//     alignSelf: 'center',
//     backgroundColor: '#fff',
//     padding: 20,
//     borderRadius: 50,
//   },
//   buttonText: {
//     fontSize: 20,
//   },
// });

// export default Stage1Camera;

/////////////////////////////////////////////////////
// import React, {useEffect, useRef, useState} from 'react';
// import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
// import {Camera, CameraDevice} from 'react-native-vision-camera';

// const Stage1Camera = ({navigation}: {navigation: any}) => {
//   const [permission, setPermission] = useState<boolean | null>(null);
//   const [device, setDevice] = useState<CameraDevice | undefined>();
//   const camera = useRef<Camera>(null);

//   useEffect(() => {
//     const checkPermission = async () => {
//       const cameraPermission = await Camera.getCameraPermissionStatus();
//       console.log(`🔍 현재 권한 상태: ${cameraPermission}`);

//       // 🚀 강제 변환하여 권한 값 정확히 반영
//       const isGranted =
//         cameraPermission === 'granted' || cameraPermission === 'authorized';

//       setTimeout(() => setPermission(isGranted), 100);
//     };

//     const loadDevices = async () => {
//       const availableDevices = await Camera.getAvailableCameraDevices();
//       console.log('📷 사용 가능한 장치 목록:', availableDevices);

//       const selectedCamera = availableDevices.find(
//         dev => dev.position === 'back',
//       );
//       console.log('🎯 선택된 카메라 상태:', selectedCamera);

//       if (selectedCamera) {
//         setTimeout(() => setDevice(selectedCamera), 100);
//       }
//     };

//     checkPermission();
//     loadDevices();
//   }, []);

//   useEffect(() => {
//     console.log(`✅ 카메라 권한 업데이트됨: ${permission}`);
//   }, [permission]);

//   if (permission === null) {
//     return <Text>🔄 권한 확인 중...</Text>;
//   }

//   if (!permission) {
//     return (
//       <Text style={styles.permissionText}>⚠️ 카메라 권한이 필요합니다.{'\n\n'}iOS: Setting -> EscampeSMU -> Camera ON!!</Text>
//     );
//   }

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
//       <TouchableOpacity
//         onPress={() => console.log('📸 사진 촬영')}
//         style={styles.captureButton}>
//         <Text style={styles.buttonText}>📸</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {flex: 1, backgroundColor: '#000'},
//   camera: {width: '100%', height: '100%'},
//   captureButton: {
//     position: 'absolute',
//     bottom: 40,
//     alignSelf: 'center',
//     backgroundColor: '#fff',
//     padding: 20,
//     borderRadius: 50,
//   },
//   buttonText: {fontSize: 20},
//   permissionText: {
//     color: 'black',
//     fontSize: 20,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginTop: 300,
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
  Platform,
} from 'react-native';
import {Camera, CameraDevice} from 'react-native-vision-camera';

const SERVER_URL = 'http://192.168.0.8:8000/compare'; // ✅ 서버 URL

const Stage1Camera = ({navigation}: {navigation: any}) => {
  const [permission, setPermission] = useState<boolean | null>(null);
  const [device, setDevice] = useState<CameraDevice | undefined>();
  const camera = useRef<Camera>(null);

  useEffect(() => {
    const checkPermission = async () => {
      const cameraPermission = await Camera.getCameraPermissionStatus();
      console.log(`🔍 현재 권한 상태: ${cameraPermission}`);

      const isGranted =
        cameraPermission === 'granted' || cameraPermission === 'authorized';

      setPermission(isGranted);
    };

    const loadDevices = async () => {
      const availableDevices = await Camera.getAvailableCameraDevices();
      console.log('📷 사용 가능한 장치 목록:', availableDevices);

      const selectedCamera = availableDevices.find(
        dev => dev.position === 'back',
      );
      setDevice(selectedCamera);
    };

    checkPermission();
    loadDevices();
  }, []);

  useEffect(() => {
    console.log(`✅ 카메라 권한 업데이트됨: ${permission}`);
  }, [permission]);

  const takePicture = async () => {
    if (camera.current) {
      try {
        console.log('📸 촬영 시작...');
        const photo = await camera.current.takePhoto({quality: 90});
        console.log('📸 촬영 완료:', photo.path);

        // ✅ 서버로 전송할 FormData 생성
        const formData = new FormData();
        formData.append('file', {
          uri: `file://${photo.path}`,
          type: 'image/jpeg',
          name: 'captured.jpg',
        });

        console.log('🚀 서버로 전송 중...');
        const response = await fetch(SERVER_URL, {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        const data = await response.json();
        console.log('📝 비교 결과:', data);

        if (data.result === 'Pass') {
          Alert.alert('✅ 성공!', '다음 단계로 이동합니다.');
          navigation.navigate('NextStage'); // ✅ 다음 스테이지로 이동
        } else {
          Alert.alert('❌ 실패', '다시 시도해주세요.');
        }
      } catch (error) {
        console.error('🚨 서버 오류:', error);
        Alert.alert('⚠️ 오류', '사진을 전송할 수 없습니다.');
      }
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#000'},
  camera: {width: '100%', height: '100%'},
  captureButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 50,
  },
  buttonText: {fontSize: 20},
  permissionText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 300,
  },
});

export default Stage1Camera;
