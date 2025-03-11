import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../App';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

const Main = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      {/* 이미지 추가 */}
      <Image source={require('../assets/main.png')} style={styles.image} />
      
      {/* 버튼 추가 */}
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('StageList')}
      >
        <Text style={styles.buttonText}>Stage 목록 보기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5E6C4', // 베이지색 배경
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 250,
    height: 400,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4682B4', // 버튼 색상
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF', 
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Main;
