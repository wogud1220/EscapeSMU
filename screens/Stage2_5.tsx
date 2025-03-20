import React, { useState } from 'react';
import { View, Text, ImageBackground, StyleSheet, Dimensions, Image, TouchableOpacity, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../App';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Stage2_5'>;

const { width, height } = Dimensions.get('window');

// ✅ 정적 배열로 이미지 설정
const puzzleImages = [
  require('../assets/puzzle/1_1_1.png'),
  require('../assets/puzzle/1_1_2.png'),
  require('../assets/puzzle/1_1_3.png'),
  require('../assets/puzzle/1_1_4.png'),
  require('../assets/puzzle/1_1_5.png'),
  require('../assets/puzzle/1_2_1.png'),
  require('../assets/puzzle/1_2_2.png'),
  require('../assets/puzzle/1_2_3.png'),
  require('../assets/puzzle/1_2_4.png'),
  require('../assets/puzzle/1_2_5.png'),
  require('../assets/puzzle/1_3_1.png'),
  require('../assets/puzzle/1_3_2.png'),
  require('../assets/puzzle/1_3_3.png'),
  require('../assets/puzzle/1_3_4.png'),
  require('../assets/puzzle/1_3_5.png'),
  require('../assets/puzzle/1_4_1.png'),
  require('../assets/puzzle/1_4_2.png'),
  require('../assets/puzzle/1_4_3.png'),
  require('../assets/puzzle/1_4_4.png'),
  require('../assets/puzzle/1_4_5.png'),
  require('../assets/puzzle/1_5_1.png'),
  require('../assets/puzzle/1_5_2.png'),
  require('../assets/puzzle/1_5_3.png'),
  require('../assets/puzzle/1_5_4.png'),
  require('../assets/puzzle/1_5_5.png'),
];

const Stage2_5 = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const handleMapPress = () => {
    navigation.navigate('Map');
  };

  const handleHint = () => {
    Alert.alert(
      '힌트',
      '청록관/상록관에서 눈에 띄는 무언가가 있을 거야. 잘 찾아봐!',
      [{ text: '확인' }]
    );
  };

  const handleImagePress = (index: number) => {
    setSelectedImageIndex(index);
    console.log(`Selected Image Index: ${index}`);
  };

  return (
    <View style={styles.container}>
      {/* ✅ 배경 이미지 설정 */}
      <ImageBackground 
        source={require('../assets/main.png')} 
        style={styles.image}
        resizeMode="cover"
      >
        <View style={styles.overlay} />

        {/* ✅ 맵 버튼 */}
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

        {/* ✅ 하얀색 박스 */}
        <View style={styles.box}>
          <Text style={styles.text}>다음 스테이지로 넘어가기 전 마지막 단계야!</Text>
          <Text style={styles.subText}>이 퍼즐을 맞춰보자!</Text>

          {/* ✅ 5x5 퍼즐 그리드 */}
          <View style={styles.grid}>
            {puzzleImages.map((image, index) => (
              <TouchableOpacity 
                key={index} 
                onPress={() => handleImagePress(index)}
                style={[
                  styles.gridItem, 
                  selectedImageIndex === index && styles.selectedGridItem
                ]}
              >
                <Image source={image} style={styles.gridImage} resizeMode="contain" />
              </TouchableOpacity>
            ))}
          </View>
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

// ✅ 그리드 크기 설정
const gridSize = 7;
const gridItemSize = width * 1.0 / gridSize;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5E6C4',
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
    marginTop: height * 0.15,
    marginLeft: width * 0.1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: width * 0.8,
    height: height * 0.65,
    borderRadius: width * 0.04,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  text: {
    color: '#333',
    fontSize: width * 0.05,
    fontWeight: 'bold',
    marginBottom: height * 0.01,
    textAlign: 'center',
  },
  subText: {
    color: '#555',
    fontSize: width * 0.04,
    textAlign: 'center',
    marginBottom: height * 0.02,
  },
  grid: {
    width: width * 0.8,
    height: width * 0.8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridItem: {
    width: gridItemSize,
    height: gridItemSize,
    margin: 0.1,
    backgroundColor: '#ddd',
    borderWidth: 1,
    borderColor: '#aaa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedGridItem: {
    borderColor: '#FF6347',
    borderWidth: 2,
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  hintButton: {
    position: 'absolute',
    bottom: height * 0.07,
    backgroundColor: '#FF6347',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.2,
    borderRadius: width * 0.03,
    marginLeft: width * 0.2,
    alignItems: 'center',
  },
  hintButtonText: {
    color: '#FFFFFF',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  // ✅ 수정된 부분: 고정 크기로 버튼 설정
  mapButton: {
    position: 'absolute',
    top: height * 0.05,
    right: width * 0.05,
    width: 40, // 고정된 크기 설정
    height: 40, // 고정된 크기 설정
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: height * 0.05,
    left: width * 0.05,
    width: 40, // 고정된 크기 설정
    height: 40, // 고정된 크기 설정
  },
  backImage: {
    width: '100%',
    height: '100%',
  },
});


export default Stage2_5;
