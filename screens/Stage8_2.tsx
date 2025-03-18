//학생생활관 오름라운지 퀴즈

import React, { useState } from 'react';
import { View, Text, ImageBackground, StyleSheet, Dimensions, Image, TouchableOpacity, TextInput, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../App';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Stage8_2'>;

const { width, height } = Dimensions.get('window');

const Stage8_2 = () => {
  const navigation = useNavigation<NavigationProp>();
  const [answer, setAnswer] = useState('');

  const handleMapPress = () => {
    navigation.navigate('Map');
  };

  const handleNextStage = () => {
    if (answer.trim() === 'qwer1234') {
      Alert.alert('정답입니다!', '다음 스테이지로 이동합니다.', [
        { 
          text: '확인', 
          onPress: () => navigation.navigate('Stage8_3'),
        },
      ]);
    } else {
      Alert.alert('오답입니다.', '다시 시도해 보세요!');
    }
  };

  const handleHomePress = () => {
    navigation.navigate('Main');
  };

  // ✅ 힌트 팝업
  const handleHint = () => {
    Alert.alert(
      '힌트', 
      '오름라운지 내의 기둥에 어떤 종이가 붙어 있는 것 같은데...?',
      [{ text: '확인' }]
    );
  };

  return (
    <View style={styles.container}>
      {/* ✅ 배경 이미지 */}
      <ImageBackground 
        source={require('../assets/main.png')} 
        style={styles.image}
        resizeMode="cover"
      >
        {/* ✅ 투명 레이어 */}
        <View style={styles.overlay} />

        {/* ✅ 지도 버튼 */}
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

        {/* ✅ 흰색 박스 */}
        <View style={styles.box}>
          <Text style={styles.text}>학생생활관 1층에는{'\n'}'오름라운지'가 존재해!</Text>
          <Text style={styles.subText}>
            오름라운지는 기숙사생이 아니더라도{'\n'}이용 가능한 공간이야.
            {'\n'}
            오름라운지에서는 학생들이 사용할 수 있는 와이파이를 제공하고 있어.
            {'\n'}
            {'\n'}
            그렇다면, SM1F-1_wifi의 비밀번호를 입력해보자!
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
            keyboardType="default"
            autoCapitalize="none"
          />
          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleNextStage}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>제출하기</Text>
          </TouchableOpacity>
        </View>

        {/* ✅ 힌트 버튼 */}
        <TouchableOpacity 
          style={styles.hintButton}
          onPress={handleHint}
          activeOpacity={0.7}
        >
          <Text style={styles.hintButtonText}>힌트 보기 💡</Text>
        </TouchableOpacity>
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
    marginTop: height * 0.12,
    width: width * 0.85,
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
    marginTop: height * 0.01,
  },
  inputContainer: {
    flexDirection: 'row',
    marginTop: height * 0.03,
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
  },
  submitButton: {
    backgroundColor: 'rgba(0, 0, 255, 0.7)',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.06,
    borderRadius: width * 0.03,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  hintButton: {
    marginTop: height * 0.02,
    backgroundColor: '#FF6347',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.06,
    borderRadius: width * 0.03,
  },
  hintButtonText: {
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

export default Stage8_2;
