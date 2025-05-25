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
// import {incrementStageAttempt} from '../utils/incrementStageAttempt';
// import {updateStageData} from '../utils/updateStageData';
// import CustomText from '../CustomText';

// type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Stage5_6'>;

// const {width, height} = Dimensions.get('window');

// const Stage5_6 = () => {
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, user => {
//       if (user) {
//         setUserId(user.uid);
//       }
//     });
//     return unsubscribe;
//   }, []);
//   useEffect(() => {
//     console.log('Stage5_6 log - Department:', department);
//     console.log('Stage5_6 log - College:', college);
//   }, []);
//   const [userId, setUserId] = useState('');
//   const navigation = useNavigation<NavigationProp>();
//   const route = useRoute<RouteProp<RootStackParamList, 'Stage5_6'>>();
//   const {college, department} = route.params || {};
//   const [answer, setAnswer] = useState('');
//   const [isModalVisible, setIsModalVisible] = useState(false);

//   const handleMapPress = () => {
//     navigation.navigate('Map');
//   };

//   const handleNextStage = async () => {
//     let actualCollege = college;
//     if (department === '디지털만화영상' || department === '사진영상') {
//       actualCollege = '융합기술대학';
//     }
//     if (answer.trim() === '시크릿오더') {
//       try {
//         await updateStageData(userId, actualCollege, 'Stage5_7');
//       } catch (err) {
//         console.error('🔥 updateStageData error:', err);
//       }
//       Alert.alert('정답입니다!', '다음 스테이지로 이동합니다.', [
//         {
//           text: '확인',
//           onPress: () =>
//             navigation.navigate('Stage5_7', {
//               college: actualCollege,
//               department,
//             }),
//         },
//       ]);
//       setIsModalVisible(false);
//     } else {
//       incrementStageAttempt(userId, actualCollege);
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
//       {/* ✅ 배경 이미지 설정 */}
//       <ImageBackground
//         source={require('../assets/main.png')}
//         style={styles.image}
//         resizeMode="cover">
//         <View style={styles.overlay} />

//         {/* ✅ 지도 버튼 */}
//         <TouchableOpacity onPress={handleMapPress} style={styles.mapButton}>
//           <Image
//             source={require('../assets/map.png')}
//             style={styles.mapImage}
//             resizeMode="contain"
//           />
//         </TouchableOpacity>

//         {/* ✅ 홈 버튼 */}
//         <TouchableOpacity onPress={handleHomePress} style={styles.backButton}>
//           <Image
//             source={require('../assets/home.png')}
//             style={styles.backImage}
//             resizeMode="contain"
//           />
//         </TouchableOpacity>

//         {/* ✅ 문제 박스 */}
//         <View style={styles.box}>
//           <CustomText style={{fontSize: 25, textAlign: 'center'}}>한누리관 1층으로 다시 돌아왔어!</CustomText>
//           <CustomText style={styles.subText}>
//             한누리관 1층 카페 ing에서는{'\n'}직접 가서 주문해도 되겠지만,{'\n'}
//             비대면 주문이 가능한 거 알아?{'\n'}
//             그렇다면, 어플 이름이 뭘까?{'\n'}
//             카페 앞 배너를 살펴보자!
//           </CustomText>
//         </View>

//         {/* ✅ 입력 필드 → 터치 시 모달 열기 */}
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
//                     <CustomText style={{fontSize: 20, color: 'white'}}>제출하기</CustomText>
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
//     marginTop: height * 0.3,
//     width: width * 0.8,
//     height: height * 0.4,
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
//     color: '#555',
//     fontSize: width * 0.045,
//     textAlign: 'center',
//     marginTop: height * 0.03,
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
//     fontFamily: 'BMHANNAPro',
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
// });

// export default Stage5_6;

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
import {incrementStageAttempt} from '../utils/incrementStageAttempt';
import {updateStageData} from '../utils/updateStageData';
import CustomText from '../CustomText';

const {width, height} = Dimensions.get('window');
const TARGET_COORDS = {lat: 36.834182, lng: 127.179103};

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

const Stage5_6 = () => {
  const [userId, setUserId] = useState('');
  const [answer, setAnswer] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, 'Stage5_6'>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Stage5_6'>>();
  const {college, department} = route.params || {};

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) setUserId(user.uid);
    });
    return unsubscribe;
  }, []);

  const handleNextStage = async () => {
    if (!(await requestLocationPermission())) return;

    Geolocation.getCurrentPosition(
      async pos => {
        const {latitude, longitude} = pos.coords;
        const distance = getDistanceFromLatLonInMeters(
          latitude,
          longitude,
          TARGET_COORDS.lat,
          TARGET_COORDS.lng,
        );

        if (distance > 80) {
          Alert.alert('❌ 위치 제한', '조금 더 가까이 가주세요.');
          return;
        }

        let actualCollege = college;
        if (department === '디지털만화영상' || department === '사진영상') {
          actualCollege = '융합기술대학';
        }

        if (answer.trim() === '시크릿오더') {
          await updateStageData(userId, actualCollege, 'Stage5_7');
          Alert.alert('정답입니다!', '다음 스테이지로 이동합니다.', [
            {
              text: '확인',
              onPress: () =>
                navigation.navigate('Stage5_7', {
                  college: actualCollege,
                  department,
                }),
            },
          ]);
          setIsModalVisible(false);
        } else {
          incrementStageAttempt(userId, actualCollege);
          Alert.alert('오답입니다.', '다시 시도해 보세요!');
        }
      },
      error => {
        console.error('❌ 위치 오류:', error);
        Alert.alert('위치 정보를 가져오지 못했습니다.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 10000,
      },
    );
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

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/main.png')}
        style={styles.image}
        resizeMode="cover">
        <View style={styles.overlay} />

        <TouchableOpacity
          onPress={() => navigation.navigate('Map')}
          style={styles.mapButton}>
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
          <CustomText style={{fontSize: 25, textAlign: 'center'}}>
            한누리관 1층으로 다시 돌아왔어!
          </CustomText>
          <CustomText style={styles.subText}>
            한누리관 1층 카페 ing에서는 직접 가서 주문해도 되겠지만,비대면
            주문이 가능한 거 알아?그렇다면, 어플 이름이 뭘까?카페 앞 배너를
            살펴보자!
          </CustomText>
        </View>

        <TouchableOpacity
          onPress={() => setIsModalVisible(true)}
          style={styles.inputContainer}>
          <CustomText style={styles.inputText}>
            {answer || '정답 입력'}
          </CustomText>
        </TouchableOpacity>

        <Modal
          animationType="fade"
          transparent
          visible={isModalVisible}
          onRequestClose={() => setIsModalVisible(false)}>
          <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
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
                    autoFocus
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
    marginTop: height * 0.3,
    width: width * 0.8,
    height: height * 0.4,
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
    color: '#555',
    fontSize: width * 0.045,
    textAlign: 'center',
    marginTop: height * 0.03,
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
    fontFamily: 'BMHANNAPro',
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
});

export default Stage5_6;
