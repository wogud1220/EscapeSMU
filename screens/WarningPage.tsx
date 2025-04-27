import React from 'react';
import { View, Text, ImageBackground, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../App';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'WarningPage'>;
const { width, height } = Dimensions.get('window');

const WarningPage = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<RootStackParamList, 'WarningPage'>>();

  const handleMapPress = () => {
    navigation.navigate('Map');
  };

  const handleNextStage = () => {
    navigation.navigate('StageList');
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
          <Image
            source={require('../assets/rightarrow.png')}
            style={styles.rightarrowImage}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Main')} style={styles.backButton}>
          <Image 
            source={require('../assets/home.png')}
            style={styles.backImage}
            resizeMode="contain"
          />
          <View style={styles.leftArrowRow}>
            <Image
              source={require('../assets/leftarrow.png')}
              style={styles.leftarrowImage}
              resizeMode="contain"
            />
            <Text style={styles.leftArrowText}>{'\n'}{'\n'}{'\n'}이 버튼은 현재 내 위치를 확인할 수 있어!{'\n'}{'\n'}{'\n'}{'\n'}   이 버튼은 메인페이지로{'\n'}   돌아갈 수 있어!{'\n'}{'\n'}</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.box}>
          <Text style={styles.text}>
            {'\n'}권장하는 플레이 시간대는{'\n'}<Text style={styles.highlight}>오전 8시 ~ 오후 5시</Text>야!{'\n'}{'\n'}
            실내에서는 당연히 뛰어다니면 안되겠지?{'\n'}
            가급적 걷기 편한 신발을 착용하고{'\n'}안전사고에 유의하면서 미션을 진행해 줘!{'\n'}{'\n'}
            <Text style={styles.highlight}>미션은 정문에서부터 시작해!</Text>
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.nextButton}
          onPress={handleNextStage}
          activeOpacity={0.7}
        >
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
    width: width * 1.0,
    height: height * 1.0,
    padding: height * 0.03,
    borderRadius: width * 0.04,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  text: {
    color: '#333',
    fontSize: width * 0.055,
    fontWeight: 'bold',
    marginTop: height * 0.3,
    marginBottom: height * 0.01,
    textAlign: 'center',
    lineHeight: height * 0.035,
  },
  subText: {
    color: '#555',
    fontSize: width * 0.045,
    textAlign: 'center',
  },
  mapButton: {
    position: 'absolute',
    top: height * 0.05,
    right: width * 0.05,
    width: width * 0.12,
    height: width * 0.12,
    zIndex: 10,
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  nextButton: {
    position: 'absolute',
    bottom: height * 0.05,
    backgroundColor: 'rgba(0, 0, 255, 0.7)',
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
    zIndex: 10,
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
  dokdoImage: {
    width: width * 0.7,
    height: height * 0.4,
    marginBottom: height * 0.02,
  },
  leftArrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftarrowImage: {
    width: width * 0.6,
    height: width * 0.6,
    marginLeft: width * -0.2,
    marginTop: width * -0.3,
  },
  leftArrowText: {
    color: '#000000',
    width: width * 0.5,
    height: width * 1.0,
    fontSize: width * 0.055,
    fontWeight: 'bold',
    marginLeft: width * -0.25,
    marginTop: width * 0.01,
  },
  rightarrowImage: {
    width: width * 0.3,
    height: width * 0.3,
    alignSelf: 'center',
    marginTop: 2,
    marginRight: width * 0.1,
  },
  highlight: {
    color: 'red',
    fontWeight: 'bold',
  },
});

export default WarningPage;