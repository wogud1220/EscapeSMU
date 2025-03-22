//정보검색실

import React from 'react';
import { View, Text, ImageBackground, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../App';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Stage13_8'>;

const { width, height } = Dimensions.get('window');

const Stage13_8 = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleMapPress = () => {
    navigation.navigate('Map');
  };

  const handleNextStage = () => {
    navigation.navigate('Stage13_8');
  };

  return (
    <View style={styles.container}>
      {/* ✅ main.png를 배경으로 설정 */}
      <ImageBackground 
        source={require('../assets/main.png')} 
        style={styles.image}
        resizeMode="cover"
      >
        {/* 🔥 투명 레이어 추가 */}
        <View style={styles.overlay} />

        {/* ✅ 🗺️ 오른쪽 상단의 map.png */}
        <TouchableOpacity onPress={handleMapPress} style={styles.mapButton}>
          <Image 
            source={require('../assets/map.png')}
            style={styles.mapImage}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* ✅ 홈으로 이동 버튼 */}
        <TouchableOpacity onPress={() => navigation.navigate('Main')} style={styles.backButton}>
          <Image 
            source={require('../assets/home.png')}
            style={styles.backImage}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* ✅ 가운데 투명한 흰색 박스 */}
        <View style={styles.box}>
          <Text style={styles.text}>
          이제 도서를 검색해볼거야!
          </Text>
          <Text style={styles.subText}>
          문학 이방인 5권{'\n'}
          문학 노인과바다 4권{'\n'}
          문학 메리골드 마음세탁소 3권{'\n'}
          문학 눈먼 자들의 도시 3권{'\n'}
          문학 흰 =  The Elegy of Whiteness : 한강소설 3권{'\n'}
          문학 불편한 편의점 : 김호연 장편소설 3권 {'\n'}
          문학 인간실격 7권{'\n'}
          문학 듄 1 4권{'\n'}
          문학 눈먼 자들의 도시 3권{'\n'}
          문학 파우스트 4권{'\n'}
          위의 책 제목을 학술정보관 페이지의 자료검색을 통해 청구기호를 찾아서 입력해줘!
          </Text>

        </View>

        {/* ✅ 다음 스테이지로 이동 버튼 */}
        <TouchableOpacity 
          style={styles.nextButton}
          onPress={handleNextStage}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>다음 ➡️</Text>
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
    width: width * 0.8,
    height: height * 0.6, // ✅ 높이 조정 (이미지 공간 포함)
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
    marginTop: height * 0.05,
    color: '#333',
    fontSize: width * 0.055,
    fontWeight: 'bold',
    marginBottom: height * 0.01,
    textAlign: 'center',
    lineHeight: height * 0.035, // ✅ 줄 간격
  },
  subText: {
    color: '#555',
    fontSize: width * 0.045,
    textAlign: 'center',
    marginTop: height * 0.02,
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
  nextButton: {
    position: 'absolute',
    bottom: height * 0.05,
    backgroundColor: 'rgba(0, 0, 255, 0.7)', // ✅ 파란색 버튼
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.2,
    borderRadius: width * 0.03,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: width * 0.045,
    fontWeight: 'bold',
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
    width: width * 0.6,
    height: height * 0.5,
    marginBottom: height * 0.005,
  },
});

export default Stage13_8;
