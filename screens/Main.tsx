import React from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../App';

const { width, height } = Dimensions.get('window'); // ✅ 화면 크기 가져오기

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

const Main = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleNavigate = () => {
    navigation.navigate('StageList');
  };

  return (
    <View style={styles.container}>
      {/* ✅ 이미지 배경 설정 */}
      <ImageBackground
        source={require('../assets/main.png')}
        style={styles.image}
        resizeMode="cover"
      >
        {/* ✅ 메인 타이틀 이미지 추가 */}
        <Image
          source={require('../assets/main_title.png')}
          style={styles.titleImage}
          resizeMode="contain"
        />

        {/* ✅ 버튼을 이미지 위에 배치 */}
        <TouchableOpacity
          onPress={handleNavigate}
          style={styles.button}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>Stage 목록 보기</Text>
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
    width: width, // ✅ 화면 너비의 100%
    height: height * 0.9, // ✅ 화면 높이의 90%
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: width * 0.05, // ✅ 화면 비율에 맞게 둥근 모서리 설정
    overflow: 'hidden',
  },
  titleImage: {
    position: 'absolute',
    top: height * 0.23, // ✅ 상단에서 화면 높이의 10% 위치
    width: width * 1.0, // ✅ 화면 너비의 60% 크기
    height: height * 0.15, // ✅ 화면 높이의 15% 크기
  },
  button: {
    position: 'absolute',
    bottom: height * 0.05, // ✅ 화면 하단에서 높이의 5% 위치
    backgroundColor: 'rgba(0, 0, 255, 0.6)',
    paddingVertical: height * 0.02, // ✅ 비율 기반 패딩
    paddingHorizontal: width * 0.1,
    borderRadius: width * 0.03, // ✅ 반응형 둥근 모서리
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: width * 0.045, // ✅ 비율 기반 폰트 크기 설정
    fontWeight: 'bold',
  },
});

export default Main;
