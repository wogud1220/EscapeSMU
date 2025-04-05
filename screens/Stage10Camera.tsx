import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Platform, Alert } from 'react-native';
import { Camera, CameraDevice } from 'react-native-vision-camera';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import {onAuthStateChanged} from 'firebase/auth';

const Stage10Camera = ({ navigation }: { navigation: any }) => {
  const [permission, setPermission] = useState<boolean | null>(null);
  const [device, setDevice] = useState<CameraDevice | undefined>();
  const [isUploading, setIsUploading] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const camera = useRef<Camera>(null);
  
  const route = useRoute<RouteProp<RootStackParamList, 'Stage10Camera'>>();
const { department } = route.params;

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
      formData.append('stage', 'stage10');

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
        navigation.navigate('Stage1_2');
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
        onPress={() => navigation.navigate('Stage10_4')}
        style={styles.greenButton}>
        <Text style={styles.greenButtonText}>➡️</Text>
      </TouchableOpacity>

      <Modal visible={isUploading} transparent>
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>업로드 중...</Text>
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
  loadingOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    marginTop: 10,
  },
});

export default Stage10Camera;
