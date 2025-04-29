//식물과학관에서 본관으로 이동하는 화면

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

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Stage4'>;

const {width, height} = Dimensions.get('window');

const Stage4 = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<RootStackParamList, 'Stage4'>>();
  const { college = '', department = '' } = route.params || {};
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  // ✅ navigation을 JS Thread에서 실행할 함수
  const goToNextStage = () => {
    navigation.navigate('Stage4_1', { college, department });
  };

  // ✅ UI Thread → JS Thread 넘어가는 안전한 포장 함수
  const triggerNavigation = () => {
    'worklet';
    runOnJS(goToNextStage)();
  };

  // ✅ 애니메이션 실행 함수 (UI Thread)
  const handleNextStage = () => {
    'worklet';
    scale.value = withSpring(1.2, {}, () => {
      'worklet';
      scale.value = withSpring(1, {}, triggerNavigation);
    });
  };

  // ✅ map 버튼 핸들러는 JS thread이므로 별도 문제 없음
  const handleMapPress = () => {
    navigation.navigate('Map');
  };

  return (
    <Animated.View style={styles.container}>
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
          <Image
            source={require('../assets/waytobongwan.png')}
            style={styles.wayImage}
            resizeMode="contain"
          />
          <CustomText style={{ fontSize: 25, textAlign: 'center' }}>
            다시 이동해볼까?
          </CustomText>
          <CustomText style={styles.subText}>
            우리의 다음 목적지는 본관이야! 본관은 식물 과학관에서 나와서 바로
            정면에 있는 건물이야!{'\n'}사진을 참고해보자!
          </CustomText>
        </View>

        {/* ✅ AnimatedTouchableOpacity 사용 가능 */}
        <AnimatedTouchableOpacity
          style={[styles.nextButton, animatedStyle]}
          onPress={handleNextStage}
          activeOpacity={0.7}>
          <CustomText style={{ fontSize: 20, color: 'white' }}>다음 ➡️</CustomText>
        </AnimatedTouchableOpacity>
      </ImageBackground>
    </Animated.View>
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
    marginBottom: height * 0.01,
    textAlign: 'center',
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

export default Stage4;
