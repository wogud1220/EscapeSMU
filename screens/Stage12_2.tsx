//계당관 문제 맞추기

import React, { useState } from 'react';
import { View, Text, ImageBackground, StyleSheet, Dimensions, Image, TouchableOpacity, TextInput, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../App';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Stage12_2'>;

const { width, height } = Dimensions.get('window');

const Stage12_2 = () => {
  const navigation = useNavigation<NavigationProp>();
  const [answer, setAnswer] = useState(''); // ✅ 정답 상태값 설정

  const handleMapPress = () => {
    navigation.navigate('Map');
  };

  const handleNextStage = () => {
    // ✅ 정답 체크 로직
    if (answer.trim() === '민정') {
      Alert.alert('정답입니다!', '다음 스테이지로 이동합니다.', [
        { 
          text: '확인', 
          onPress: () => navigation.navigate('Stage12_3') // ✅ 다음 스테이지로 이동
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
          {/* ✅ wayimage 추가 */}  
          <Image 
          source={require('../assets/gyedang2.png')} 
          style={styles.wayImage}
          resizeMode="contain"
          />
          
          <Text style={styles.text}>
            '계당관'이라는 이름은 {'\n'}어디서 따왔을까?
            </Text>
            <Text style={styles.subText}>
              '계당'은 상명대학교 설립자인 {'\n'}'배상명'의 호에서 따왔어.{'\n'}
              그렇다면 '배상명'의 또다른 호는 무엇일까? 한글로 입력해줘!
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
    height: height * 0.6,
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
  wayImage: {
    width: width * 0.6, // ✅ 이미지 크기 설정
    height: height * 0.2, // ✅ 높이 설정 (필요하면 조정 가능)
    marginBottom: height * 0.02, // ✅ 텍스트와의 간격 설정
  },
  
});

export default Stage12_2;
