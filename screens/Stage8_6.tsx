//PC에서 문제 풀고 단어 입력하기

import React, { useState } from 'react';
import { View, Text, ImageBackground, StyleSheet, Dimensions, Image, TouchableOpacity, TextInput, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../App';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Stage8_6'>;

const { width, height } = Dimensions.get('window');

const Stage8_6 = () => {
  const navigation = useNavigation<NavigationProp>();
  const [answer, setAnswer] = useState(''); // ✅ 정답 상태값 설정

  const handleMapPress = () => {
    navigation.navigate('Map');
  };

  const handleNextStage = () => {
    // ✅ 정답 체크 로직
    if (answer.trim() === '1') {
      Alert.alert('정답입니다!', '다음 스테이지로 이동합니다.', [
        { 
          text: '확인', 
          onPress: () => navigation.navigate('Stage9_1') // ✅ 다음 스테이지로 이동
        },
      ]);
    } else {
      Alert.alert('오답입니다.', '다시 시도해 보세요!');
    }
  };

  const handleHomePress = () => {
    navigation.navigate('Main');
  };

  return (
    <View style={styles.container}>
      {/* ✅ 배경 이미지 설정 */}
      <ImageBackground 
        source={require('../assets/main.png')} 
        style={styles.image}
        resizeMode="cover"
      >
        {/* ✅ 투명 레이어 추가 */}
        <View style={styles.overlay} />

        {/* ✅ 오른쪽 상단의 지도 버튼 */}
        <TouchableOpacity onPress={handleMapPress} style={styles.mapButton}>
          <Image 
            source={require('../assets/map.png')}
            style={styles.mapImage}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* ✅ 홈으로 이동 버튼 */}
        <TouchableOpacity onPress={handleHomePress} style={styles.backButton}>
          <Image 
            source={require('../assets/home.png')}
            style={styles.backImage}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* ✅ 가운데 흰색 박스 */}
        <View style={styles.box}>
          <Text style={styles.text}>컴퓨터를 사용해서 (www.www.com)에 접속해보자!</Text>
          <Text style={styles.subText}>
            PC 사용하기 불가능한 상황이라면 핸드폰을 통해 접속해도 괜찮아!{'\n'}{'\n'}
            사이트에 접속하니 문제들이 있잖아??{'\n'}
            문제를 풀고 사이트에서 제공하는 단어를 입력해보자!{'\n'}
          </Text>
        </View>

        {/* ✅ 입력 필드 + 제출 버튼 */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={answer}
            onChangeText={setAnswer}
            placeholder="정답 입력"
            placeholderTextColor="#999"
            keyboardType="default" // ✅ 문자 입력 가능하도록 설정
            autoCapitalize="none" // ✅ 대소문자 구분 없음
          />
          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleNextStage}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>제출하기</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5E6C4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  box: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    marginTop: height * 0.15,
    width: width * 0.8,
    height: height * 0.5,
    padding: height * 0.03,
    borderRadius: width * 0.04,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
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
    marginTop: height * 0.005,
  },
  inlineImage: {
    width: width * 0.7,
    height: height * 0.4,
    marginVertical: height * 0.01, // ✅ 이미지 상하 간격 최소화
  },
  inputContainer: {
    flexDirection: 'row',
    marginTop: height * 0.05, // ✅ 간격 축소
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: width * 0.5,
    height: height * 0.05,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: width * 0.045,
    color: '#333',
    backgroundColor: '#fff',
    marginRight: width * 0.02,
    marginBottom: height * 0.1, // ✅ 간격 줄임
  },
  submitButton: {
    backgroundColor: 'rgba(0, 0, 255, 0.7)',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.06,
    borderRadius: width * 0.03,
    marginBottom: height * 0.1, // ✅ 간격 줄임
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
});

export default Stage8_6;
