//프라임홀 클리커 문제

import React, {useEffect} from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../App';
import {useRoute, RouteProp} from '@react-navigation/native';

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Stage13_5'
>;

const {width, height} = Dimensions.get('window');

const Stage13_5 = () => {
  useEffect(() => {
    console.log('Stage13_5 Department:', department);
    console.log('Stage13_5 College:', college);
  }, []);
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<RootStackParamList, 'Stage13_5'>>();
  const {college = '', department = ''} = route.params || {}; // ✅ 안전한 fallback 추가

  const handleMapPress = () => {
    navigation.navigate('Map');
  };

  const handleNextStage = () => {
    navigation.navigate('Stage13_6', {college, department});
  };

  return (
    <View style={styles.container}>
      {/* ✅ main.png를 배경으로 설정 */}
      <ImageBackground
        source={require('../assets/main.png')}
        style={styles.image}
        resizeMode="cover">
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
        <TouchableOpacity
          onPress={() => navigation.navigate('Main')}
          style={styles.backButton}>
          <Image
            source={require('../assets/home.png')}
            style={styles.backImage}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* ✅ 가운데 투명한 흰색 박스 */}
        <View style={styles.box}>
          <Text style={styles.text}>
            좋아! 앞으로 시험기간에 {'\n'}열람실을 이용하기 전에
          </Text>
          <Text style={styles.subText}>
            '클리커'를 이용해서 남는 자리가 있는지{'\n'} 확인해보고 갈 수도
            있겠어!{'\n'}
            {'\n'}
            이제 도서관이 있는 2층으로 올라가보자!
          </Text>
        </View>

        {/* ✅ 다음 스테이지로 이동 버튼 */}
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNextStage}
          activeOpacity={0.7}>
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
    height: height * 0.4, // ✅ 높이 조정 (이미지 공간 포함)
    padding: height * 0.03,
    borderRadius: width * 0.04,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
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

export default Stage13_5;
