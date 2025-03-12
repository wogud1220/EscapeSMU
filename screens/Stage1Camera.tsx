import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Camera, CameraDevice } from 'react-native-vision-camera';

const Stage1Camera = ({ navigation }: { navigation: any }) => {
  const [permission, setPermission] = useState(false);
  const [device, setDevice] = useState<CameraDevice | undefined>();
  const camera = useRef<Camera>(null);

  useEffect(() => {
    const checkPermission = async () => {
      const cameraPermission = await Camera.getCameraPermissionStatus();
      console.log(`현재 권한 상태: ${cameraPermission}`);

      if (cameraPermission === 'not-determined') {
        const status = await Camera.requestCameraPermission();
        setPermission(status === 'authorized');
      } else if (cameraPermission === 'authorized') {
        setPermission(true);
      } else {
        setPermission(false);
      }
    };

    const loadDevices = async () => {
      const availableDevices = await Camera.getAvailableCameraDevices();
      console.log('사용 가능한 장치 목록:', availableDevices);

      availableDevices.forEach((dev, index) => {
        console.log(
          `장치 ${index}: position = ${dev.position}, sensorOrientation = ${dev.sensorOrientation}`
        );
      });

      const backCamera = availableDevices.find(
        (dev) =>
          dev.position === 'back' ||
          dev.sensorOrientation === 'landscape-left' ||
          dev.sensorOrientation === 90
      );

      console.log('선택된 백 카메라 상태:', backCamera);

      // ✅ 장치 설정이 늦어질 경우 강제로 상태 갱신
      if (backCamera) {
        setTimeout(() => setDevice(backCamera), 100); // ✅ 살짝 딜레이 후 장치 상태 업데이트
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

  if (!device) {
    return <Text>⚠️ 카메라 장치를 찾을 수 없습니다. 실제 기기에서 실행하세요.</Text>;
  }

  if (!permission) {
    return <Text>⚠️ 카메라 권한이 필요합니다.</Text>;
  }

  return (
    <View style={styles.container}>
      {/* ✅ 카메라 컴포넌트 크기 명확히 설정 */}
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
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    width: '100%', // ✅ 크기 명확히 지정
    height: '100%', // ✅ 크기 명확히 지정
  },
  captureButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 50,
  },
  buttonText: {
    fontSize: 20,
  },
});

export default Stage1Camera;
