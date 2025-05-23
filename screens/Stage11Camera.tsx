import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Camera, CameraDevice} from 'react-native-vision-camera';
import {useRoute, RouteProp, useIsFocused} from '@react-navigation/native';
import {RootStackParamList} from '../App';

const Stage11Camera = ({navigation}: {navigation: any}) => {
  const [device, setDevice] = useState<CameraDevice | undefined>();
  const camera = useRef<Camera>(null);
  const route = useRoute<RouteProp<RootStackParamList, 'Stage11Camera'>>();
  const {college, department} = route.params || {};
  const isFocused = useIsFocused(); // 화면 포커스 상태 가져옴
  useEffect(() => {
    const checkPermission = async () => {
      const cameraPermission = await Camera.getCameraPermissionStatus();
      console.log(`현재 권한 상태: ${cameraPermission}`);

      if (cameraPermission === 'not-determined') {
        await Camera.requestCameraPermission();
      }
    };

    const loadDevices = async () => {
      const availableDevices = await Camera.getAvailableCameraDevices();
      console.log('사용 가능한 장치 목록:', availableDevices);

      availableDevices.forEach((dev, index) => {
        console.log(
          `장치 ${index}: position = ${dev.position}, sensorOrientation = ${dev.sensorOrientation}`,
        );
      });

      const backCamera = availableDevices.find(
        dev =>
          dev.position === 'back' ||
          dev.sensorOrientation === 'landscape-left' ||
          dev.sensorOrientation === 90,
      );

      console.log('선택된 백 카메라 상태:', backCamera);

      if (backCamera) {
        setTimeout(() => setDevice(backCamera), 100);
      }
    };

    checkPermission();
    loadDevices();
  }, []);

  const takePicture = async () => {
    if (camera.current) {
      const photo = await camera.current.takePhoto();
      console.log(`사진 저장 경로: ${photo.path}`);
      navigation.goBack(); // Stage1으로 복귀
    }
  };

  const goToNextStage = () => {
    navigation.navigate('Stage12_1', {college, department});
  };

  if (!device) {
    // ✅ 장치가 없으면 아무것도 렌더링하지 않음
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      {/* ✅ 카메라 컴포넌트 */}
      <Camera
        ref={camera}
        style={styles.camera}
        device={device}
        isActive={isFocused}
        photo={true}
      />

      {/* ✅ 사진 촬영 버튼 */}
      <TouchableOpacity onPress={takePicture} style={styles.captureButton}>
        <Text style={styles.buttonText}>📸</Text>
      </TouchableOpacity>

      {/* ✅ 다음 버튼 */}
      {/* <TouchableOpacity onPress={goToNextStage} style={styles.nextButton}>
        <Text style={styles.buttonText}>다음 ➡️</Text>
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  captureButton: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 50,
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
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Stage11Camera;
