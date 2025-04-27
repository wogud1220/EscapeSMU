//멀베리 설명

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
import CustomText from '../CustomText';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Stage5'>;

const {width, height} = Dimensions.get('window');

const Stage5_2 = () => {
  useEffect(() => {
    console.log('Stage5_2 log - Department:', department);
    console.log('Stage5_2 log - College:', college);
  }, []);
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<RootStackParamList, 'Stage5_2'>>();
  const {college, department} = route.params || {};

  const handleMapPress = () => {
    navigation.navigate('Map');
  };

  const handleNextStage = () => {
    navigation.navigate('Stage5_3', {college, department}); // ✅ Stage4_4로 이동
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

        <View style={styles.box}>
          <CustomText style={{fontSize: 25, textAlign: 'center'}}>교직원 식당은!</CustomText>
          <CustomText style={styles.subText}>
            오전 11시부터 오후 1시 30분까지{'\n'}운영하고 있어!{'\n'}
            명칭은 교직원 식당이지만{'\n'}학생들도 이용 가능해.{'\n'}자율 배식이니 언제든지 방문해보자!
          </CustomText>
        </View>

        {/* ✅ 다음 스테이지로 이동 버튼 */}
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNextStage}
          activeOpacity={0.7}>
          <CustomText style={{fontSize: 20, color: 'white'}}>다음 ➡️</CustomText>
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
    height: height * 0.35,
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
    color: '#333',
    fontSize: width * 0.06,
    marginBottom: height * 0.01,
    textAlign: 'center',
  },
  subText: {
    color: '#555',
    fontSize: width * 0.045,
    textAlign: 'center',
    marginTop: height * 0.04,
    marginBottom: height * 0.02,
    lineHeight: width * 0.065
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
    width: width * 0.6, // ✅ bae.png 크기 조정
    height: height * 0.45,
    marginBottom: height * 0.005, // ✅ 이미지와 텍스트 간격
  },
});

export default Stage5_2;
