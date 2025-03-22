//계당관 호 맞추기
//모달 적용해봄

import React, { useState } from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../App';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Stage12_5_1'>;

const { width, height } = Dimensions.get('window');

const Stage12_5_1 = () => {
  const navigation = useNavigation<NavigationProp>();
  const [answer, setAnswer] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleMapPress = () => {
    navigation.navigate('Map');
  };

  const handleNextStage = () => {
    if (answer.trim() === '시련') {
      Alert.alert('정답입니다!', '다음 스테이지로 이동합니다.', [
        {
          text: '확인',
          onPress: () => navigation.navigate('Stage12_6'),
        },
      ]);
      setIsModalVisible(false);
    } else {
      Alert.alert('오답입니다.', '다시 시도해 보세요!');
    }
  };

  const handleHomePress = () => {
    navigation.navigate('Main');
  };

  // ✅ 입력 상자를 누르면 모달 활성화
  const openModal = () => {
    setIsModalVisible(true);
  };

  // ✅ 모달 닫기
  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/main.png')}
        style={styles.image}
        resizeMode="cover"
      >
        <View style={styles.overlay} />

        {/* 지도 버튼 */}
        <TouchableOpacity onPress={handleMapPress} style={styles.mapButton}>
          <Image
            source={require('../assets/map.png')}
            style={styles.mapImage}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* 홈 버튼 */}
        <TouchableOpacity onPress={handleHomePress} style={styles.backButton}>
          <Image
            source={require('../assets/home.png')}
            style={styles.backImage}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* 박스 및 텍스트 */}
        <View style={styles.box}>
          <Image 
            source={require('../assets/gyedangposter.jpg')}
            style={styles.wayImage}
            resizeMode="contain"
          />
          <Text style={styles.text}>
            연극의 제목을 찾아보자!
          </Text>
          <Text style={styles.subText}>
            계당관에서 체육관으로 올라가는 계단에는 진행되었던 다양한 연극 포스터들이 있어!{'\n'}{'\n'}
            이 연극은 2022년 7월 2일부터 3일까지 진행되었다는데..
          </Text>
        </View>

        {/* 입력 필드 (모달로 오픈) */}
        <TouchableOpacity onPress={openModal} style={styles.inputContainer}>
          <Text style={styles.inputText}>
            {answer || '정답 입력'}
          </Text>
        </TouchableOpacity>
      </ImageBackground>

      {/* ✅ 입력 모달 */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalBackground}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>정답을 입력하세요</Text>

                {/* ✅ 입력 상자 */}
                <TextInput
                  style={styles.modalInput}
                  value={answer}
                  onChangeText={setAnswer}
                  placeholder="정답 입력"
                  placeholderTextColor="#999"
                  keyboardType="default"
                  autoCapitalize="none"
                  autoFocus={true}
                />
                
                {/* ✅ 제출 버튼 */}
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleNextStage}
                >
                  <Text style={styles.buttonText}>제출하기</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  box: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    marginTop: height * 0.15,
    width: width * 0.8,
    height: height * 0.7,
    padding: height * 0.03,
    borderRadius: width * 0.04,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    elevation: 5,
  },
  text: {
    color: '#333',
    fontSize: width * 0.06,
    fontWeight: 'bold',
    marginBottom: height * 0.01,
    textAlign: 'center',
  },
  subText: {
    color: '#555',
    fontSize: width * 0.045,
    textAlign: 'center',
  },
  inputContainer: {
    marginTop: height * 0.05,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 5,
    padding: height * 0.01,
    width: width * 0.5,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  inputText: {
    fontSize: width * 0.045,
    color: '#333',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    width: width * 0.8,
    padding: height * 0.03,
    borderRadius: width * 0.04,
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    marginBottom: height * 0.02,
  },
  modalInput: {
    width: '100%',
    borderBottomWidth: 1,
    borderColor: '#999',
    fontSize: width * 0.045,
    paddingVertical: height * 0.01,
    marginBottom: height * 0.02,
    color: '#333',
  },
  submitButton: {
    backgroundColor: 'rgba(0, 0, 255, 0.7)',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.2,
    borderRadius: width * 0.03,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  mapButton: {
    position: 'absolute',
    top: height * 0.05,
    right: width * 0.05,
    width: width * 0.12,
    height: width * 0.12,
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: height * 0.05,
    left: width * 0.05,
    width: width * 0.1,
    height: width * 0.1,
  },
  backImage: {
    width: '100%',
    height: '100%',
  },
  wayImage: {
    marginTop: height * -0.05,
    width: width * 0.7,
    height: height * 0.4,
    marginBottom: height * 0.02,
  },
});

export default Stage12_5_1;
