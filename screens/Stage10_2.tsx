// //본관 퀴즈(카메라로 글씨 찾기 대신)

// import React, {useState, useEffect} from 'react';
// import {
//   View,
//   Text,
//   ImageBackground,
//   StyleSheet,
//   Dimensions,
//   Image,
//   TouchableOpacity,
//   TextInput,
//   Alert,
//   Modal,
//   TouchableWithoutFeedback,
// } from 'react-native';
// import {NativeStackNavigationProp} from '@react-navigation/native-stack';
// import {useNavigation} from '@react-navigation/native';
// import {RootStackParamList} from '../App';
// import {useRoute, RouteProp} from '@react-navigation/native';
// import {onAuthStateChanged} from 'firebase/auth';
// import {auth} from './firebase.config';
// import {updateStageData} from '../utils/updateStageData';
// import {incrementStageAttempt} from '../utils/incrementStageAttempt';
// import CustomText from '../CustomText';

// type NavigationProp = NativeStackNavigationProp<
//   RootStackParamList,
//   'Stage10_2'
// >;

// const {width, height} = Dimensions.get('window');

// const Stage10_2 = () => {
//   const navigation = useNavigation<NavigationProp>();
//   const route = useRoute<RouteProp<RootStackParamList, 'Stage10_2'>>();
//   const {college = '', department = ''} = route.params || {};
//   const [answer, setAnswer] = useState('');
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [userId, setUserId] = useState('');
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, user => {
//       if (user) {
//         setUserId(user.uid);
//       }
//     });
//     return unsubscribe;
//   }, []);
//   const handleMapPress = () => {
//     navigation.navigate('Map');
//   };

//   const handleNextStage = async () => {
//     if (answer.trim() === '천원의 아침밥' || answer.trim() === '천원의아침밥') {
//       try {
//         await updateStageData(userId, college, 'Stage10_4');
//       } catch (err) {
//         console.error('🔥 updateStageData error:', err);
//       }

//       Alert.alert('정답입니다!', '다음 스테이지로 이동합니다.', [
//         {
//           text: '확인',
//           onPress: () =>
//             navigation.navigate('Stage10_4', {college, department}),
//         },
//       ]);
//       setIsModalVisible(false);
//     } else {
//       incrementStageAttempt(userId, college);
//       Alert.alert('오답입니다.', '다시 시도해 보세요!');
//     }
//   };

//   const handleHomePress = () => {
//     navigation.navigate('Main');
//   };

//   // ✅ 모달 열기
//   const openModal = () => {
//     setIsModalVisible(true);
//   };

//   // ✅ 모달 닫기
//   const closeModal = () => {
//     setIsModalVisible(false);
//   };

//   return (
//     <View style={styles.container}>
//       {/* ✅ main.png를 배경으로 설정 */}
//       <ImageBackground
//         source={require('../assets/main.png')}
//         style={styles.image}
//         resizeMode="cover">
//         {/* 🔥 투명 레이어 추가 */}
//         <View style={styles.overlay} />

//         {/* ✅ 지도 버튼 */}
//         <TouchableOpacity onPress={handleMapPress} style={styles.mapButton}>
//           <Image
//             source={require('../assets/map.png')}
//             style={styles.mapImage}
//             resizeMode="contain"
//           />
//         </TouchableOpacity>

//         {/* ✅ 홈으로 이동 버튼 */}
//         <TouchableOpacity
//           onPress={() => navigation.navigate('Main')}
//           style={styles.backButton}>
//           <Image
//             source={require('../assets/home.png')}
//             style={styles.backImage}
//             resizeMode="contain"
//           />
//         </TouchableOpacity>

//         <View style={styles.box}>
//           <Image
//             source={require('../assets/bab.jpg')}
//             style={styles.wayImage}
//             resizeMode="contain"
//           />
//           <CustomText style={styles.text}>학생회관 1층 식당 쪽으로 들어가보자!</CustomText>
//           <CustomText style={styles.subText}>
//             식당 내에서 아래와 같은 포스터를{'\n'}찾을 수 있을까?{'\n'}
//             {'\n'}이 포스터가 어떤 캠페인을{'\n'}말하고 있는지 써볼래?
//           </CustomText>
//         </View>
//         <TouchableOpacity onPress={openModal} style={styles.inputContainer}>
//           <CustomText style={styles.inputText}>{answer || '정답 입력'}</CustomText>
//         </TouchableOpacity>

//         {/* ✅ 모달 */}
//         <Modal
//           animationType="fade"
//           transparent={true}
//           visible={isModalVisible}
//           onRequestClose={closeModal}>
//           <TouchableWithoutFeedback onPress={closeModal}>
//             <View style={styles.modalBackground}>
//               <TouchableWithoutFeedback>
//                 <View style={styles.modalContainer}>
//                   <CustomText style={styles.modalTitle}>정답을 입력하세요</CustomText>

//                   {/* ✅ 입력 상자 */}
//                   <TextInput
//                     style={styles.modalInput}
//                     value={answer}
//                     onChangeText={setAnswer}
//                     placeholder="정답 입력"
//                     placeholderTextColor="#999"
//                     keyboardType="default"
//                     autoCapitalize="none"
//                     autoFocus={true}
//                   />

//                   {/* ✅ 제출 버튼 */}
//                   <TouchableOpacity
//                     style={styles.submitButton}
//                     onPress={handleNextStage}>
//                     <CustomText style={styles.buttonText}>제출하기</CustomText>
//                   </TouchableOpacity>
//                 </View>
//               </TouchableWithoutFeedback>
//             </View>
//           </TouchableWithoutFeedback>
//         </Modal>
//       </ImageBackground>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   nextButton: {
//     position: 'absolute',
//     bottom: height * 0.05,
//     backgroundColor: 'rgba(0, 0, 255, 0.7)',
//     paddingVertical: height * 0.01,
//     paddingHorizontal: width * 0.05,
//     borderRadius: width * 0.03,
//     alignItems: 'center',
//     alignSelf: 'center',
//   },
//   centerContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   image: {
//     flex: 1,
//     width: '100%',
//     height: '100%',
//   },
//   overlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0, 0, 0, 0.6)',
//   },
//   box: {
//     backgroundColor: 'rgba(255, 255, 255, 0.7)',
//     marginTop: height * 0.15,
//     width: width * 0.8,
//     height: height * 0.7,
//     padding: height * 0.03,
//     borderRadius: width * 0.04,
//     alignItems: 'center',
//     justifyContent: 'center',
//     alignSelf: 'center',
//     elevation: 5,
//   },
//   text: {
//     color: '#333',
//     fontSize: width * 0.06,
//     marginBottom: height * 0.01,
//     textAlign: 'center',
//   },
//   subText: {
//     marginTop: height * 0.02,
//     color: '#555',
//     fontSize: width * 0.045,
//     textAlign: 'center',
//     lineHeight: width * 0.065,
//   },
//   inputContainer: {
//     marginTop: height * 0.05,
//     borderWidth: 1,
//     borderColor: '#999',
//     borderRadius: 5,
//     padding: height * 0.01,
//     width: width * 0.5,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//     alignSelf: 'center',
//   },
//   inputText: {
//     fontSize: width * 0.045,
//     color: '#333',
//   },
//   modalBackground: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContainer: {
//     backgroundColor: '#fff',
//     width: width * 0.8,
//     padding: height * 0.03,
//     borderRadius: width * 0.04,
//     alignItems: 'center',
//     elevation: 5,
//   },
//   modalTitle: {
//     fontSize: width * 0.05,
//     marginBottom: height * 0.02,
//   },
//   modalInput: {
//     width: '100%',
//     borderBottomWidth: 1,
//     borderColor: '#999',
//     fontSize: width * 0.045,
//     paddingVertical: height * 0.01,
//     marginBottom: height * 0.02,
//     color: '#333',
//     fontFamily: 'BMHANNAPro',
//   },
//   submitButton: {
//     backgroundColor: 'rgba(0, 0, 255, 0.7)',
//     paddingVertical: height * 0.015,
//     paddingHorizontal: width * 0.2,
//     borderRadius: width * 0.03,
//   },
//   buttonText: {
//     color: '#FFFFFF',
//     fontSize: width * 0.045,
//   },
//   mapButton: {
//     position: 'absolute',
//     top: height * 0.05,
//     right: width * 0.05,
//     width: width * 0.12,
//     height: width * 0.12,
//   },
//   mapImage: {
//     width: '100%',
//     height: '100%',
//   },
//   backButton: {
//     position: 'absolute',
//     top: height * 0.05,
//     left: width * 0.05,
//     width: width * 0.1,
//     height: width * 0.1,
//   },
//   backImage: {
//     width: '100%',
//     height: '100%',
//   },
//   wayImage: {
//     width: width * 0.7,
//     height: height * 0.3,
//     marginBottom: height * 0.02,
//   },
//   goBackButton: {
//     position: 'absolute',
//     top: height * 0.05,
//     left: width * 0.18, // 홈 버튼 옆에 배치
//     width: width * 0.1,
//     height: width * 0.1,
//   },
//   gogobackButton: {
//     position: 'absolute',
//     bottom: height * 0.05,
//     backgroundColor: 'rgba(0, 0, 255, 0.7)', // ✅ 파란색 버튼
//     paddingVertical: height * 0.01,
//     paddingHorizontal: width * 0.05,
//     borderRadius: width * 0.03,
//     alignItems: 'center',
//     alignSelf: 'center',
//   },
//   buttonText1: {
//     color: '#FFFFFF',
//     fontSize: width * 0.045,
//     fontWeight: 'bold',
//   },
//   goBackImage: {
//     width: '100%',
//     height: '100%',
//   },
// });

// export default Stage10_2;

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  TouchableWithoutFeedback,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../App';
import {useRoute, RouteProp} from '@react-navigation/native';
import {onAuthStateChanged} from 'firebase/auth';
import {auth} from './firebase.config';
import {updateStageData} from '../utils/updateStageData';
import {incrementStageAttempt} from '../utils/incrementStageAttempt';
import CustomText from '../CustomText';

const {width, height} = Dimensions.get('window');
const TARGET_LOCATION = {lat: 36.839093, lng: 127.177579}; // 학생회관 식당 위치

const getDistanceFromLatLonInMeters = (lat1, lon1, lat2, lon2) => {
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
};

const requestLocationPermission = async () => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
};

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Stage10_2'
>;

const Stage10_2 = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<RootStackParamList, 'Stage10_2'>>();
  const {college = '', department = ''} = route.params || {};
  const [answer, setAnswer] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        setUserId(user.uid);
      }
    });
    return unsubscribe;
  }, []);

  const handleMapPress = () => {
    navigation.navigate('Map');
  };

  const handleNextStage = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert('❌ 위치 권한', '위치 권한이 필요합니다.');
      return;
    }

    Geolocation.getCurrentPosition(
      async pos => {
        const {latitude, longitude} = pos.coords;
        const distance = getDistanceFromLatLonInMeters(
          latitude,
          longitude,
          TARGET_LOCATION.lat,
          TARGET_LOCATION.lng,
        );

        console.log('📍 위치 거리:', distance.toFixed(2), 'm');

        if (distance > 50) {
          //거리 제한
          Alert.alert(
            '❌ 위치 제한',
            '학생회관 내부로 들어가서 답을 입력해보자!',
          ); //경고 문구
          return;
        }

        if (
          answer.trim() === '천원의 아침밥' ||
          answer.trim() === '천원의아침밥'
        ) {
          try {
            await updateStageData(userId, college, 'Stage10_4');
          } catch (err) {
            console.error('🔥 updateStageData error:', err);
          }

          Alert.alert('정답입니다!', '다음 스테이지로 이동합니다.', [
            {
              text: '확인',
              onPress: () =>
                navigation.navigate('Stage10_4', {college, department}),
            },
          ]);
          setIsModalVisible(false);
        } else {
          incrementStageAttempt(userId, college);
          Alert.alert('오답입니다.', '다시 시도해 보세요!');
        }
      },
      error => {
        console.error('❌ 위치 오류:', error);
        Alert.alert('위치 정보를 가져올 수 없습니다.');
      },
      {enableHighAccuracy: true, timeout: 10000, maximumAge: 10000},
    );
  };

  const handleHomePress = () => {
    navigation.navigate('Main');
  };

  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

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

        <TouchableOpacity onPress={handleHomePress} style={styles.backButton}>
          <Image
            source={require('../assets/home.png')}
            style={styles.backImage}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <View style={styles.box}>
          <Image
            source={require('../assets/bab.jpg')}
            style={styles.wayImage}
            resizeMode="contain"
          />
          <CustomText style={styles.text}>
            학생회관 1층 식당 쪽으로 들어가보자!
          </CustomText>
          <CustomText style={styles.subText}>
            식당 내에서 아래와 같은 포스터를 찾을 수 있을까?이 포스터가 어떤
            캠페인을말하고 있는지 써볼래?
          </CustomText>
        </View>

        <TouchableOpacity onPress={openModal} style={styles.inputContainer}>
          <CustomText style={styles.inputText}>
            {answer || '정답 입력'}
          </CustomText>
        </TouchableOpacity>

        <Modal
          animationType="fade"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={closeModal}>
          <TouchableWithoutFeedback onPress={closeModal}>
            <View style={styles.modalBackground}>
              <TouchableWithoutFeedback>
                <View style={styles.modalContainer}>
                  <CustomText style={styles.modalTitle}>
                    정답을 입력하세요
                  </CustomText>

                  <TextInput
                    style={styles.modalInput}
                    value={answer}
                    onChangeText={setAnswer}
                    placeholder="정답 입력"
                    placeholderTextColor="#999"
                    keyboardType="default"
                    autoCapitalize="none"
                    autoFocus={true}
                  />

                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleNextStage}>
                    <CustomText style={{fontSize: 20, color: 'white'}}>
                      제출하기
                    </CustomText>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  nextButton: {
    position: 'absolute',
    bottom: height * 0.05,
    backgroundColor: 'rgba(0, 0, 255, 0.7)',
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.05,
    borderRadius: width * 0.03,
    alignItems: 'center',
    alignSelf: 'center',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    marginTop: height * 0.15,
    width: width * 0.8,
    height: height * 0.7,
    padding: height * 0.03,
    borderRadius: width * 0.04,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    elevation: 5,
  },
  text: {
    color: '#333',
    fontSize: width * 0.06,
    marginBottom: height * 0.01,
    textAlign: 'center',
  },
  subText: {
    marginTop: height * 0.02,
    color: '#555',
    fontSize: width * 0.045,
    textAlign: 'center',
    lineHeight: width * 0.065,
  },
  inputContainer: {
    marginTop: height * 0.05,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 5,
    padding: height * 0.01,
    width: width * 0.5,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  inputText: {
    fontSize: width * 0.045,
    color: '#333',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    width: width * 0.8,
    padding: height * 0.03,
    borderRadius: width * 0.04,
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontSize: width * 0.05,
    marginBottom: height * 0.02,
  },
  modalInput: {
    width: '100%',
    borderBottomWidth: 1,
    borderColor: '#999',
    fontSize: width * 0.045,
    paddingVertical: height * 0.01,
    marginBottom: height * 0.02,
    color: '#333',
    fontFamily: 'BMHANNAPro',
  },
  submitButton: {
    backgroundColor: 'rgba(0, 0, 255, 0.7)',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.2,
    borderRadius: width * 0.03,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: width * 0.045,
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
    width: width * 0.7,
    height: height * 0.3,
    marginBottom: height * 0.02,
  },
  goBackButton: {
    position: 'absolute',
    top: height * 0.05,
    left: width * 0.18, // 홈 버튼 옆에 배치
    width: width * 0.1,
    height: width * 0.1,
  },
  gogobackButton: {
    position: 'absolute',
    bottom: height * 0.05,
    backgroundColor: 'rgba(0, 0, 255, 0.7)', // ✅ 파란색 버튼
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.05,
    borderRadius: width * 0.03,
    alignItems: 'center',
    alignSelf: 'center',
  },
  buttonText1: {
    color: '#FFFFFF',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  goBackImage: {
    width: '100%',
    height: '100%',
  },
});

export default Stage10_2;
