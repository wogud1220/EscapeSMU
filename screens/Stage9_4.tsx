import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../App';
import {useRoute, RouteProp} from '@react-navigation/native';
import {onAuthStateChanged} from 'firebase/auth';
import {auth} from './firebase.config';
import {updateStageData} from '../utils/updateStageData';
import {incrementStageAttempt} from '../utils/incrementStageAttempt';
import CustomText from '../CustomText';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Stage9_4'>;

const {width, height} = Dimensions.get('window');

const correctPuzzleImages = [
  require('../assets/d_puzzle/d_1_1.png'),
  require('../assets/d_puzzle/d_1_2.png'),
  require('../assets/d_puzzle/d_1_3.png'),
  require('../assets/d_puzzle/d_2_1.png'),
  require('../assets/d_puzzle/d_2_2.png'),
  require('../assets/d_puzzle/d_2_3.png'),
  require('../assets/d_puzzle/d_3_1.png'),
  require('../assets/d_puzzle/d_3_2.png'),
  require('../assets/d_puzzle/d_3_3.png'),
  require('../assets/d_puzzle/d_4_1.png'),
  require('../assets/d_puzzle/d_4_2.png'),
  require('../assets/d_puzzle/d_4_3.png'),
];

const shuffleArray = (array: any[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const Stage9_4 = () => {
  const [userId, setUserId] = useState('');
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) setUserId(user.uid);
    });
    return unsubscribe;
  }, []);
  const navigation = useNavigation<NavigationProp>();
  const [puzzleImages, setPuzzleImages] = useState(() =>
    shuffleArray([...correctPuzzleImages]),
  );
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null,
  );

  const route = useRoute<RouteProp<RootStackParamList, 'Stage9_4'>>();
  const {college, department} = route.params || {};

  // ✅ 경로 문자열로 변환 후 비교하기 위해 미리 변환
  const correctPaths = correctPuzzleImages.map(
    img => Image.resolveAssetSource(img).uri,
  );
  // 함수 추가
  const handleCheckButtonPress = async () => {
    let actualCollege = college;
    if (department === '디지털만화영상' || department === '사진영상') {
      actualCollege = '융합기술대학';
    }
    try {
      await updateStageData(userId, actualCollege, 'Stage9_5');
      navigation.navigate('Stage9_5', {college: actualCollege, department});
    } catch (err) {
      Alert.alert('오류', '단계 저장에 실패했습니다.');
      console.error('🔥 Stage9_5 이동 실패:', err);
    }
  };
  //오답 정답시 stageCleared, AtemCount 증가 추가하기. 4/17
  const checkCompletion = () => {
    const currentPaths = puzzleImages.map(
      img => Image.resolveAssetSource(img).uri,
    );

    if (currentPaths.every((path, index) => path === correctPaths[index])) {
      updateStageData(userId, college, 'Stage9_5');
      Alert.alert('성공 🎉', '퍼즐을 완성했구나! 다음 스테이지로 이동하자!', [
        {
          text: '확인',
          onPress: () => navigation.navigate('Stage9_5', {college, department}),
        },
      ]);
    } else {
      incrementStageAttempt(userId, college);
      Alert.alert('오답 😢', '퍼즐이 아직 완성되지 않았어. 다시 시도해보자!');
    }
  };

  useEffect(() => {
    setPuzzleImages(shuffleArray([...correctPuzzleImages]));
  }, []);

  const handleMapPress = () => {
    navigation.navigate('Map');
  };

  const handleHint = () => {
    navigation.navigate('Stage9Hint', {college, department});
  };

  const handleImagePress = (index: number) => {
    if (selectedImageIndex === null) {
      setSelectedImageIndex(index);
    } else if (selectedImageIndex === index) {
      checkCompletion();
      setSelectedImageIndex(null);
    } else {
      swapImages(selectedImageIndex, index);
      setSelectedImageIndex(null);
    }
  };

  const swapImages = (index1: number, index2: number) => {
    const newPuzzleImages = [...puzzleImages];
    [newPuzzleImages[index1], newPuzzleImages[index2]] = [
      newPuzzleImages[index2],
      newPuzzleImages[index1],
    ];
    setPuzzleImages(newPuzzleImages);
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/main.png')}
        style={styles.image}
        resizeMode="cover">
        <View style={styles.overlay} />
        <TouchableOpacity onPress={handleMapPress} style={styles.mapButton}>
          <Image
            source={require('../assets/map.png')}
            style={styles.mapImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Main')}
          style={styles.backButton}>
          <Image
            source={require('../assets/home.png')}
            style={styles.backImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <View style={styles.box}>
          <CustomText style={styles.text}>토끼가 퍼즐을 풀어달래!!</CustomText>
          <CustomText style={styles.subText}>이 퍼즐을 맞춰보자!</CustomText>

          <View style={styles.grid}>
            {puzzleImages.map((image, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleImagePress(index)}
                style={[
                  styles.gridItem,
                  selectedImageIndex === index && styles.selectedGridItem,
                ]}>
                <Image
                  source={image}
                  style={styles.gridImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </View>
          <CustomText style={styles.subText}>
            두 이미지를 클릭해서 서로의 위치를 교환할 수 있어!{'\n'}
            <CustomText style={styles.highlightText}>
              완성한 것 같으면 아무 이미지나 더블클릭해보자!
            </CustomText>
          </CustomText>
        </View>
        {/* <TouchableOpacity
          onPress={handleCheckButtonPress}
          style={styles.checkButton}>
          <CustomText style={styles.checkButtonText}>확인</CustomText>
        </TouchableOpacity> */}
        <TouchableOpacity
          style={styles.hintButton}
          onPress={handleHint}
          activeOpacity={0.7}>
          <CustomText style={styles.hintButtonText}>힌트 보기 💡</CustomText>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

const gridCols = 3;
const gridRows = 4;
const gridItemSize = (width * 0.85) / gridCols;

const styles = StyleSheet.create({
  // ⬇️ 스타일 추가
  checkButton: {
    position: 'absolute',
    top: height * 0.05,
    right: width * 0.2,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  checkButtonText: {
    color: '#fff',
    fontSize: 16,
  },
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
    marginTop: height * 0.125,
    marginLeft: width * 0.025,
    marginRight: width * 0.025,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: width * 0.95,
    height: height * 0.85,
    borderRadius: width * 0.04,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  text: {
    color: '#333',
    fontSize: width * 0.05,
    marginBottom: height * 0.01,
    textAlign: 'center',
  },
  subText: {
    color: '#555',
    fontSize: width * 0.04,
    textAlign: 'center',
    marginBottom: height * 0.02,
    marginTop: height * 0.015,
  },
  grid: {
    width: width * 0.9,
    height: gridItemSize * gridRows,
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
    bottom: height * 0.04,
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
  },
});

export default Stage9_4;
