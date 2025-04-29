//청록관 가는 화면

import React from 'react';
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
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from 'react-native-reanimated';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Stage2'>;

const {width, height} = Dimensions.get('window');

const Stage2 = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<RootStackParamList, 'Stage2'>>();
  const {college, department} = route.params || {};
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

const handleNextStage = () => {
  scale.value = withSpring(1.2, {}, () => {
    scale.value = withSpring(1, {}, () => {
      runOnJS(navigation.navigate)('Stage2_1', {college, department});
    });
  });
};

  const handleMapPress = () => {
    navigation.navigate('Map');
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
          {/* ✅ 하얀색 박스 위에 waytostage2.png 추가 */}
          <Image
            source={require('../assets/waytostage2.png')}
            style={styles.wayImage}
            resizeMode="contain"
          />
          <CustomText style={{fontSize: 25, textAlign: 'center'}}>정문 문제를 풀었구나!</CustomText>
          <CustomText style={styles.subText}>
            이제 캠퍼스 안으로 들어가보자!
          </CustomText>
        </View>

        {/* ✅ 다음 스테이지로 이동 버튼 */}
        <AnimatedTouchableOpacity
          style={[styles.nextButton, animatedStyle]}
          onPress={handleNextStage}
          activeOpacity={0.7}>
          <CustomText style={{fontSize: 20, color: 'white'}}>다음 ➡️</CustomText>
        </AnimatedTouchableOpacity>
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
    height: height * 0.7, // ✅ 높이 조정 (이미지 공간 포함)
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
    fontWeight: 'bold',
    marginBottom: height * 0.01,
    textAlign: 'center',
    marginTop: height * -0.04,
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
    width: width * 0.6, // ✅ waytostage2.png 크기 조정
    height: height * 0.5,
    marginBottom: height * 0.005, // ✅ 이미지와 텍스트 간격
  },
});

export default Stage2;
