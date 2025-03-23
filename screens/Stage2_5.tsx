import React, { useState, useEffect } from 'react';
import { View, Text, ImageBackground, StyleSheet, Dimensions, Image, TouchableOpacity, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../App';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Stage2_5'>;

const { width, height } = Dimensions.get('window');

const correctPuzzleImages = [
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

const shuffleArray = (array: any[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const Stage2_5 = () => {
  const navigation = useNavigation<NavigationProp>();
  const [puzzleImages, setPuzzleImages] = useState(() => shuffleArray([...correctPuzzleImages]));
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);


// ✅ 경로 문자열로 변환 후 비교하기 위해 미리 변환
const correctPaths = correctPuzzleImages.map((img) =>
  Image.resolveAssetSource(img).uri
);

const checkCompletion = () => {
  const currentPaths = puzzleImages.map((img) =>
    Image.resolveAssetSource(img).uri
  );

  if (currentPaths.every((path, index) => path === correctPaths[index])) {
    Alert.alert(
      '성공 🎉',
      '퍼즐을 완성했구나! 다음 스테이지로 이동하자!',
      [{ text: '확인', onPress: () => navigation.navigate('Stage3') }]
    );
  }
};
  
  useEffect(() => {
    setPuzzleImages(shuffleArray([...correctPuzzleImages]));
  }, []);



  const handleMapPress = () => {
    navigation.navigate('Map');
  };

  const handleHint = () => {
    Alert.alert(
      '힌트',
      '상록관 카페 뒤쪽으로 가서 왼쪽을 바라보면, 담장에 그림이 있을거야!',
      [{ text: '확인' }]
    );
  };

  const handleImagePress = (index: number) => {
    if (selectedImageIndex === null) {
      setSelectedImageIndex(index);
    } else {
      swapImages(selectedImageIndex, index);
      setSelectedImageIndex(null);
    }
  };

  const swapImages = (index1: number, index2: number) => {
    const newPuzzleImages = [...puzzleImages];
    [newPuzzleImages[index1], newPuzzleImages[index2]] = [newPuzzleImages[index2], newPuzzleImages[index1]];
    setPuzzleImages(newPuzzleImages);

    setTimeout(() => {
      checkCompletion();
    }, 200);
  };

  return (
    <View style={styles.container}>
      <ImageBackground 
        source={require('../assets/main.png')} 
        style={styles.image}
        resizeMode="cover"
      >
        <View style={styles.overlay} />

        <TouchableOpacity onPress={handleMapPress} style={styles.mapButton}>
          <Image 
            source={require('../assets/map.png')}
            style={styles.mapImage}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Main')} style={styles.backButton}>
          <Image 
            source={require('../assets/home.png')}
            style={styles.backImage}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <View style={styles.box}>
          <Text style={styles.text}>다음 스테이지로 넘어가기 전 마지막 단계야!</Text>
          <Text style={styles.subText}>이 퍼즐을 맞춰보자!</Text>

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
          <Text style={styles.subText}>
            두 이미지를 클릭해서 서로의 위치를 교환할 수 있어!{'\n'}
            <Text style={styles.highlightText}>
              완성한 것 같으면 가운데 이미지를 더블클릭해보자!
              </Text>
              </Text>
        </View>

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

const gridSize = 5;
const gridItemSize = width * 0.7 / gridSize;

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

  mapButton: {
    position: 'absolute',
    top: height * 0.05,
    right: width * 0.05,
    width: 40,
    height: 40,
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: height * 0.05,
    left: width * 0.05,
    width: 40,
    height: 40,
  },
  backImage: {
    width: '100%',
    height: '100%',
  },
  highlightText: {
    color: 'red',
    fontWeight: 'bold',
  },
  
});


export default Stage2_5;