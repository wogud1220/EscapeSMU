import React from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../App';

const { width, height } = Dimensions.get('window'); // ✅ 반응형 값 가져오기

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'StageList'>;

const StageList = () => {
  const navigation = useNavigation<NavigationProp>();

  const buttons = [
    '글로벌인문학부대학', 
    '디자인대학', 
    '예술대학', 
    '융합기술대학', 
    '스포츠융합학부', 
    '공과대학', 
    '자유전공학부대학',
    '전체 탐험하기'
  ];

  const handlePress = (title: string) => {
    if (title === '전체 탐험하기') {
      navigation.navigate('Stage1'); // 🔥 Stage1으로 이동
    } else {
      console.log(`${title} 버튼 클릭됨`);
    }
  };

  return (
    <View style={styles.container}>
      {/* ✅ 배경 이미지 설정 */}
      <ImageBackground 
        source={require('../assets/main.png')} 
        style={styles.image}
        resizeMode="cover"
      >
        {/* ✅ 투명 레이어 추가 */}
        <View style={styles.overlay}>
          {buttons.map((title, index) => (
            <TouchableOpacity 
              key={index}
              style={styles.button}
              onPress={() => handlePress(title)}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>{title}</Text>
            </TouchableOpacity>
          ))}
        </View>
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
    width: width , // ✅ 너비를 비율로 설정
    height: height * 0.8, // ✅ 높이 비율로 설정
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(134, 134, 134, 0.5)', // ✅ 투명 레이어 색상 및 투명도 설정
    justifyContent: 'center',
    alignItems: 'center',
    gap: height * 0.015, // ✅ gap도 비율 기반으로 설정
  },
  button: {
    backgroundColor: 'rgba(68, 68, 236, 0.7)',
    paddingVertical: height * 0.02, // ✅ 높이에 비례한 padding
    paddingHorizontal: width * 0.1, // ✅ 너비에 비례한 padding
    borderRadius: width * 0.03, // ✅ 반응형 borderRadius
    width: width * 0.7, // ✅ 버튼 너비를 화면 비율로 설정
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: width * 0.045, // ✅ 폰트 크기를 너비 비율로 설정
    fontWeight: 'bold',
  },
});

export default StageList;
