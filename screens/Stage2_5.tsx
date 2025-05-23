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
import {updateStageData} from '../utils/updateStageData';
import {incrementStageAttempt} from '../utils/incrementStageAttempt';
import {onAuthStateChanged} from 'firebase/auth';
import {auth} from './firebase.config';
import CustomText from '../CustomText';
import {LayoutAnimation, UIManager, Platform} from 'react-native';
import Geolocation from '@react-native-community/geolocation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Stage2_5'>;

const {width, height} = Dimensions.get('window');
const TARGET_COORDS = {lat: 36.833505, lng: 127.177536}; // 정문 위치 예시

function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

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
  const [userId, setUserId] = useState('');

  const navigation = useNavigation<NavigationProp>();
  const [puzzleImages, setPuzzleImages] = useState(() =>
    shuffleArray([...correctPuzzleImages]),
  );
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null,
  );
  const route = useRoute<RouteProp<RootStackParamList, 'Stage2_5'>>();
  const {college, department} = route.params || {};

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user) {
        setUserId(user.uid);
      }
    });

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental &&
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);
  // ✅ 경로 문자열로 변환 후 비교하기 위해 미리 변환
  const correctPaths = correctPuzzleImages.map(
    img => Image.resolveAssetSource(img).uri,
  );

  const checkCompletion = () => {
    let actualCollege = college;
    if (department === '디지털만화영상' || department === '사진영상') {
      actualCollege = '융합기술대학';
    }
    const currentPaths = puzzleImages.map(
      img => Image.resolveAssetSource(img).uri,
    );

    if (currentPaths.every((path, index) => path === correctPaths[index])) {
      updateStageData(userId, actualCollege, 'Stage3');
      Alert.alert('성공 🎉', '퍼즐을 완성했구나! 다음 스테이지로 이동하자!', [
        {
          text: '확인',
          onPress: () => navigation.navigate('Stage3', {college, department}),
        },
      ]);
    } else {
      incrementStageAttempt(userId, actualCollege);
      Alert.alert('정답이 아닌 것 같아..', '퍼즐을 다시 맞춰보자!');
    }
  };

  useEffect(() => {
    setPuzzleImages(shuffleArray([...correctPuzzleImages]));
  }, []);

  const handleMapPress = () => {
    navigation.navigate('Map');
  };

  const handleHint = () => {
    navigation.navigate('Stage2_Hint', {college, department});
  };
  const handleNextStage = () => {
    let actualCollege = college;
    if (department === '디지털만화영상' || department === '사진영상') {
      actualCollege = '융합기술대학';
    }
    updateStageData(userId, actualCollege, 'Stage3');
    navigation.navigate('Stage3', {college, department});
  };

  const handleImagePress = (index: number) => {
    if (selectedImageIndex === null) {
      setSelectedImageIndex(index);
    } else {
      swapImages(selectedImageIndex, index);
      setSelectedImageIndex(null);
    }
  };
  //원래 정답 이동 코드
  // const handleImageDoublePress = (index: number) => {
  //   const centerIndex = Math.floor(puzzleImages.length / 2);
  //   if (index === centerIndex) {
  //     checkCompletion();
  //   }
  // };

  const handleImageDoublePress = (index: number) => {
    console.log('길게 누른 이미지 버튼 인덱스 표시 번호 ', index);
    const centerIndex = Math.floor(puzzleImages.length / 2);
    if (index !== centerIndex) {
      console.log('Center image 아님. 무시함');
      return;
    }

    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        const distance = getDistanceFromLatLonInMeters(
          latitude,
          longitude,
          TARGET_COORDS.lat,
          TARGET_COORDS.lng,
        );

        console.log(`📍 퍼즐 제출 위치 거리: ${distance.toFixed(2)}m`);

        if (distance > 100) {
          Alert.alert('❌ 위치 제한', '조금 더 가까이 가주세요.');
          return;
        }

        checkCompletion();
      },
      error => {
        console.log('📛 위치 오류:', error);
        Alert.alert('위치 정보를 가져오지 못했습니다.');
      },
      {enableHighAccuracy: true, timeout: 10000, maximumAge: 0},
    );
  };
  //10000

  const swapImages = (index1: number, index2: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

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
          <CustomText style={{fontSize: 25, textAlign: 'center'}}>
            다음 스테이지로 넘어가기 전 마지막 단계야!
          </CustomText>
          <CustomText style={styles.subText}>이 퍼즐을 맞춰보자!</CustomText>

          <View style={styles.grid}>
            {puzzleImages.map((image, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleImagePress(index)}
                onLongPress={() => handleImageDoublePress(index)}
                delayLongPress={300}
                style={[
                  styles.gridItem,
                  selectedImageIndex === index && styles.selectedGridItem,
                ]}>
                <Image
                  source={image}
                  style={styles.gridImage}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            ))}
          </View>
          <CustomText style={styles.subText}>
            두 이미지를 클릭해서{'\n'}서로의 위치를 교환할 수 있어!{'\n'}
            {'\n'}
            <Text style={{fontSize: 15, color: 'red'}}>
              완성한 것 같으면 가운데 이미지를 꾹 눌러보자!
            </Text>
          </CustomText>
        </View>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNextStage}
          activeOpacity={0.7}>
          <Text style={styles.nextButtonText}>다음 ➡️</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.hintButton}
          onPress={handleHint}
          activeOpacity={0.7}>
          <CustomText style={{fontSize: 15, color: 'white'}}>
            힌트 보기 💡
          </CustomText>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

const gridSize = 5;
const gridItemSize = (width * 0.7) / gridSize;

const styles = StyleSheet.create({
  nextButton: {
    position: 'absolute',
    bottom: height * 0.14, // 힌트 버튼 위
    backgroundColor: 'rgba(0, 0, 255, 0.7)',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.2,
    borderRadius: width * 0.03,
    marginLeft: width * 0.2,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: width * 0.045,
    fontWeight: 'bold',
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
    marginTop: height * 0.01,
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
