import React, { useEffect, useState } from 'react';
import { View, Text, ImageBackground, StyleSheet, Dimensions, Image, TouchableOpacity, Animated } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../App';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Stage13_8'>;

const { width, height } = Dimensions.get('window');

const bookList = [
  '이방인',
  '노인과 바다',
  '메리골드 마음세탁소',
  '눈먼 자들의 도시',
  '흰 = The Elegy of Whiteness',
  '불편한 편의점',
  '인간실격',
  '듄 1',
  '파우스트',
];

const Stage13_8 = () => {
  const navigation = useNavigation<NavigationProp>();
  const [randomBook, setRandomBook] = useState<string | null>(null);
  const fadeAnim = useState(new Animated.Value(0))[0];

  // ✅ 책 제목 무작위 선택 및 애니메이션 효과
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * bookList.length);
    setRandomBook(bookList[randomIndex]);

    // ✅ 페이드 인 애니메이션 설정
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleMapPress = () => {
    navigation.navigate('Map');
  };

  const handleNextStage = () => {
    navigation.navigate('Stage13_9');
  };

  return (
    <View style={styles.container}>
      {/* ✅ 배경 설정 */}
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

        {/* ✅ 홈 버튼 */}
        <TouchableOpacity onPress={() => navigation.navigate('Main')} style={styles.backButton}>
          <Image 
            source={require('../assets/home.png')}
            style={styles.backImage}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* ✅ 가운데 박스 */}
        <View style={styles.box}>
          <Text style={styles.text}>
            이제 도서를 검색해볼거야!
          </Text>

          {/* ✅ 무작위 책 제목 애니메이션 적용 */}
          {randomBook && (
            <Animated.Text style={[styles.bookTitle, { opacity: fadeAnim }]}>
              {randomBook}
            </Animated.Text>
          )}

          <Text style={styles.subText}>
            위의 책 제목을 학술정보관 페이지의 자료검색을 통해 청구기호를 찾아서 입력해줘!
          </Text>
        </View>

        {/* ✅ 다음 스테이지 버튼 */}
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
    width: width * 0.85,
    height: height * 0.4,
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
    fontSize: width * 0.05,
    fontWeight: 'bold',
    marginBottom: height * 0.02,
    textAlign: 'center',
  },
  bookTitle: {
    color: '#FF5733', // ✅ 강조 색상 (주황색)
    fontSize: width * 0.07, // ✅ 폰트 크기 증가
    fontWeight: 'bold', // ✅ 굵게 표시
    textAlign: 'center',
    marginVertical: height * 0.01,
    textShadowColor: 'rgba(0, 0, 0, 0.3)', // ✅ 텍스트에 그림자 효과 추가
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
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
    backgroundColor: 'rgba(0, 0, 255, 0.7)',
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
});

export default Stage13_8;
