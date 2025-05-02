//학생회관 2층

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

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Stage10_6'
>;

const {width, height} = Dimensions.get('window');

const Stage10_6 = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<RootStackParamList, 'Stage10_6'>>();
  const {college, department} = route.params || {};

  const handleMapPress = () => {
    navigation.navigate('Map');
  };

  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

const handleNextStage = () => {
  scale.value = withSpring(1.2, {}, () => {
    scale.value = withSpring(1, {}, () => {
      runOnJS(navigation.navigate)('Stage10_7', {college, department});
    });
  });
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
          {/* ✅ 텍스트 위에 이미지 추가 */}
          <Image
            source={require('../assets/sharelounge3.png')}
            style={styles.dokdoImage}
            resizeMode="contain"
          />
          <CustomText style={styles.text}>
            이곳은 학생회관 '쉐어라운지'야!{'\n'}
          </CustomText>
          <CustomText style={styles.subText}>
          누구나 자유롭게 사용할 수 있고,{'\n'}
          쉐어라운지 내의 세미나실은 예약 없이 선착순으로 사용할 수 있어!
          </CustomText>
        </View>

        {/* ✅ 다음 스테이지로 이동 버튼 */}
        <AnimatedTouchableOpacity
          style={[styles.nextButton, animatedStyle]}
          onPress={handleNextStage}
          activeOpacity={0.7}>
          <CustomText style={styles.buttonText}>다음 ➡️</CustomText>
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
    height: height * 0.6,
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
    fontSize: width * 0.055,
    marginTop: height * -0.05, // ✅ 위쪽 간격
    marginBottom: height * 0.01,
    textAlign: 'center',
    lineHeight: height * 0.035, // ✅ 줄 간격
  },
  subText: {
    color: '#555',
    fontSize: width * 0.045,
    textAlign: 'center',
    lineHeight: width * 0.065,
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
    marginTop: height * 0.02,
  },
  dokdoImage: {
    width: width * 0.7, // ✅ 이미지 크기 설정
    height: height * 0.4, // ✅ 이미지 높이 설정
    marginTop: height * -0.05, // ✅ 이미지와 텍스트 사이 간격 조정
  },
});

export default Stage10_6;
