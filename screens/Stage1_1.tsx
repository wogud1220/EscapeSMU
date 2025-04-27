// //정문  사진찍기 스테이지

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
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../App';
import CustomText from '../CustomText';


type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Stage1_1'>;
type Stage1RouteProp = RouteProp<RootStackParamList, 'Stage1_1'>;

const {width, height} = Dimensions.get('window');

const Stage1_1 = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<Stage1RouteProp>();
  const {college = '', department = ''} = route.params || {};

  const handleMapPress = () => {
    navigation.navigate('Map');
  };

  const handleNextStage = () => {
    
    navigation.navigate('Stage1Camera', {college, department});
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
          <Image
            source={require('../assets/frontdoor.png')}
            style={styles.wayImage}
            resizeMode="contain"
          />
          <CustomText style={{fontSize:30, marginTop: -20, marginBottom: 10}}>상명대학교 정문이야!</CustomText>
          <CustomText style={styles.subText}>
            다음 스테이지에 가기 위해서는{'\n'}카메라를 이용해{'\n'}
            사진을 찍어야 한다는데..{'\n'}(경비실 앞 캠퍼스안내도에서 찍어보자!)
          </CustomText>
        </View>

        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNextStage}
          activeOpacity={0.7}>
          <CustomText style={{fontSize: 20, color: 'white'}}>카메라 📸</CustomText>
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
    height: height * 0.7,
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
    marginTop: height * -0.02,
  },
  subText: {
    color: '#555',
    fontSize: width * 0.05,
    textAlign: 'center',
    marginTop: height * -0.005,
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

export default Stage1_1;
