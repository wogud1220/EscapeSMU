import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Animated,
  TextInput,
  Modal,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../App';
import Sound from 'react-native-sound-level';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import { useRoute, RouteProp } from '@react-navigation/native';

const {width, height} = Dimensions.get('window');

const bookList = [
  '이방인',
  '노인과 바다',
  '메리골드 마음세탁소',
  '눈먼 자들의 도시',
  '흰 = The Elegy of Whiteness',
  '불편한 편의점',
  '인간실격',
  '듄 1',
  '파우스트',
];

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Stage13_Sound'
>;

// const Stage13_Sound = () => {
//   const navigation = useNavigation<NavigationProp>();
//   const [randomBook, setRandomBook] = useState<string | null>(null);
//   const [currentDecibel, setCurrentDecibel] = useState<number>(0);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [answer, setAnswer] = useState('');
//   const fadeAnim = useState(new Animated.Value(0))[0];

//   // 최신 데시벨 값을 저장할 useRef
//   const latestDecibelRef = useRef(0);

//   useEffect(() => {
//     rerollBook();
//   }, []);

//   const rerollBook = () => {
//     const randomIndex = Math.floor(Math.random() * bookList.length);
//     setRandomBook(bookList[randomIndex]);
//     Animated.timing(fadeAnim, {
//       toValue: 1,
//       duration: 1000,
//       useNativeDriver: true,
//     }).start();
//   };

//   const requestMicPermission = async () => {
//     console.log('🔍 마이크 권한 요청 시작');

//     const result = await request(
//       Platform.OS === 'ios'
//         ? PERMISSIONS.IOS.MICROPHONE
//         : PERMISSIONS.ANDROID.RECORD_AUDIO,
//     );

//     console.log('🔍 권한 요청 결과:', result);

//     if (result !== RESULTS.GRANTED) {
//       Alert.alert('마이크 권한 필요', '마이크 권한을 허용해주세요.');
//       return false;
//     }

//     console.log('✅ 마이크 권한 허용됨');
//     return true;
//   };

//   useEffect(() => {
//     let intervalId: NodeJS.Timeout;

//     const start = async () => {
//       const granted = await requestMicPermission();
//       if (!granted) return;

//       Sound.start();
//       Sound.onNewFrame = data => {
//         const mapped = Math.floor(data.value + 80);
//         latestDecibelRef.current = mapped;
//       };

//       // 2초마다 최신 데시벨 값을 state에 업데이트
//       intervalId = setInterval(() => {
//         setCurrentDecibel(latestDecibelRef.current);
//       }, 500);
//     };

//     start();

//     return () => {
//       Sound.stop();
//       if (intervalId) clearInterval(intervalId);
//     };
//   }, []);

//   // 모달이 열려있는 상태에서 데시벨이 70을 초과하면 모달을 강제로 닫고 입력값을 초기화
//   useEffect(() => {
//     if (isModalVisible && currentDecibel > 70) {
//       Alert.alert('데시벨 초과', '70dB를 넘어서 창이 닫혔습니다!!');
//       setIsModalVisible(false);
//       setAnswer('');
//     }
//   }, [currentDecibel, isModalVisible]);

//   const handleNextStage = () => {
//     navigation.navigate('StageFinal');
//   };

//   const handleSubmitAnswer = () => {
//     if (answer.trim() === '1') {
//       Alert.alert('정답입니다!', '다음 스테이지로 이동합니다.', [
//         {text: '확인', onPress: handleNextStage},
//       ]);
//       setIsModalVisible(false);
//     } else {
//       Alert.alert('오답입니다.', '다시 시도해 보세요!');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <ImageBackground
//         source={require('../assets/main.png')}
//         style={styles.image}
//         resizeMode="cover">
//         <View style={styles.overlay} />

//         <TouchableOpacity
//           onPress={() => navigation.navigate('Map')}
//           style={styles.mapButton}>
//           <Image
//             source={require('../assets/map.png')}
//             style={styles.mapImage}
//           />
//         </TouchableOpacity>

//         <TouchableOpacity
//           onPress={() => navigation.navigate('Main')}
//           style={styles.backButton}>
//           <Image
//             source={require('../assets/home.png')}
//             style={styles.backImage}
//           />
//         </TouchableOpacity>

//         <TouchableOpacity onPress={rerollBook} style={styles.rerollButton}>
//           <Image
//             source={require('../assets/reroll.png')}
//             style={styles.rerollImage}
//           />
//         </TouchableOpacity>

//         <View style={styles.box}>
//           <Text style={styles.decibelText}>
//             현재 데시벨: {currentDecibel} dB
//           </Text>

//           {randomBook && (
//             <Animated.Text style={[styles.bookTitle, {opacity: fadeAnim}]}>
//               {randomBook}
//             </Animated.Text>
//           )}

//           <Text style={styles.text}>
//             해당 책의 35페이지 3번째 줄에 있는 첫 단어를 입력해보자
//           </Text>

//           <TouchableOpacity
//             onPress={() => {
//               // 버튼 클릭 시 입력값 초기화 후 모달 오픈
//               setAnswer('');
//               setIsModalVisible(true);
//             }}
//             style={styles.inputContainer}>
//             <Text style={styles.inputText}>정답 입력하기</Text>
//           </TouchableOpacity>

//           <Text style={styles.noticeText}>
//             위의 버튼을 누르면 전부 대출되어서{'\n'}책이 없는 상황일 때 다시
//             랜덤으로 초기화해주는 버튼이야!
//           </Text>
//         </View>

//         <Modal animationType="fade" transparent visible={isModalVisible}>
//           <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
//             <View style={styles.modalBackground}>
//               <TouchableWithoutFeedback>
//                 <View style={styles.modalContainer}>
//                   <Text style={styles.modalTitle}>정답을 입력하세요</Text>
//                   <TextInput
//                     style={styles.modalInput}
//                     value={answer}
//                     onChangeText={setAnswer}
//                     placeholder="정답 입력"
//                     autoFocus
//                   />
//                   <TouchableOpacity
//                     onPress={handleSubmitAnswer}
//                     style={styles.submitButton}>
//                     <Text style={styles.buttonText}>제출하기</Text>
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
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   box: {
//     backgroundColor: 'rgba(255, 255, 255, 0.7)',
//     width: width * 0.8,
//     height: height * 0.6,
//     padding: height * 0.03,
//     borderRadius: width * 0.04,
//     alignItems: 'center',
//     justifyContent: 'center',
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 4},
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 5,
//     alignSelf: 'center',
//     marginTop: height * 0.2,
//   },
//   decibelText: {
//     fontSize: width * 0.05,
//     fontWeight: 'bold',
//     color: 'red',
//     marginBottom: height * 0.01,
//   },
//   bookTitle: {
//     marginTop: height * 0.05,
//     fontSize: width * 0.06,
//     fontWeight: 'bold',
//     color: '#FF5733',
//     marginVertical: height * 0.01,
//     textAlign: 'center',
//   },
//   inputContainer: {
//     marginTop: height * 0.05,
//     padding: 10,
//     backgroundColor: 'rgba(0, 0, 255, 0.7)',
//     borderRadius: 5,
//   },
//   text: {
//     marginTop: height * 0.05,
//     color: '#333',
//     fontSize: width * 0.055,
//     fontWeight: 'bold',
//     marginBottom: height * 0.01,
//     textAlign: 'center',
//     lineHeight: height * 0.035,
//   },
//   inputText: {
//     fontSize: width * 0.04,
//     color: '#FFFFFF',
//   },
//   rerollButton: {
//     position: 'absolute',
//     top: height * 0.055,
//     left: width * 0.45,
//     width: width * 0.1,
//     height: width * 0.1,
//   },
//   rerollImage: {
//     width: '100%',
//     height: '100%',
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
//     fontWeight: 'bold',
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
//   },
//   submitButton: {
//     backgroundColor: 'rgba(0, 0, 255, 0.7)',
//     paddingVertical: height * 0.015,
//     paddingHorizontal: width * 0.2,
//     borderRadius: width * 0.03,
//   },
//   buttonText: {
//     color: '#FFFddd',
//     fontSize: width * 0.045,
//     fontWeight: 'bold',
//   },
//   image: {
//     flex: 1,
//     width: '100%',
//     height: '100%',
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
//   overlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0, 0, 0, 0.6)',
//   },
//   noticeText: {
//     marginTop: height * 0.05,
//     fontSize: width * 0.04,
//     color: '#555',
//     textAlign: 'center',
//     lineHeight: height * 0.03,
//   },
// });

// export default Stage13_Sound;

const Stage13_Sound = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<RootStackParamList, 'Stage13_Sound'>>();
const { department } = route.params;
  const [randomBook, setRandomBook] = useState<string | null>(null);
  const [currentDecibel, setCurrentDecibel] = useState<number>(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [answer, setAnswer] = useState('');
  const [userDepartment, setUserDepartment] = useState('글로벌인문학부'); // Add department state
  const fadeAnim = useState(new Animated.Value(0))[0];

  // 최신 데시벨 값을 저장할 useRef
  const latestDecibelRef = useRef(0);

  useEffect(() => {
    rerollBook();
  }, []);

  const rerollBook = () => {
    const randomIndex = Math.floor(Math.random() * bookList.length);
    setRandomBook(bookList[randomIndex]);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  const requestMicPermission = async () => {
    console.log('🔍 마이크 권한 요청 시작');

    const result = await request(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.MICROPHONE
        : PERMISSIONS.ANDROID.RECORD_AUDIO,
    );

    console.log('🔍 권한 요청 결과:', result);

    if (result !== RESULTS.GRANTED) {
      Alert.alert('마이크 권한 필요', '마이크 권한을 허용해주세요.');
      return false;
    }

    console.log('✅ 마이크 권한 허용됨');
    return true;
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const start = async () => {
      const granted = await requestMicPermission();
      if (!granted) return;

      Sound.start();
      Sound.onNewFrame = data => {
        const mapped = Math.floor(data.value + 80);
        latestDecibelRef.current = mapped;
      };

      // 2초마다 최신 데시벨 값을 state에 업데이트
      intervalId = setInterval(() => {
        setCurrentDecibel(latestDecibelRef.current);
      }, 500);
    };

    start();

    return () => {
      Sound.stop();
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  // 모달이 열려있는 상태에서 데시벨이 70을 초과하면 모달을 강제로 닫고 입력값을 초기화
  useEffect(() => {
    if (isModalVisible && currentDecibel > 70) {
      Alert.alert('데시벨 초과', '70dB를 넘어서 창이 닫혔습니다!!');
      setIsModalVisible(false);
      setAnswer('');
    }
  }, [currentDecibel, isModalVisible]);

  const handleNextStage = () => {
    if (userDepartment === '글로벌인문학부') {
      navigation.navigate('Stage5'); // Move to Stage5 if department is '글로벌인문학부'
    } else {
      navigation.navigate('StageFinal'); // Otherwise move to StageFinal
    }
  };

  const handleSubmitAnswer = () => {
    if (answer.trim() === '1') {
      Alert.alert('정답입니다!', '다음 스테이지로 이동합니다.', [
        {text: '확인', onPress: handleNextStage},
      ]);
      setIsModalVisible(false);
    } else {
      Alert.alert('오답입니다.', '다시 시도해 보세요!');
    }
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
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Main')}
          style={styles.backButton}>
          <Image
            source={require('../assets/home.png')}
            style={styles.backImage}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={rerollBook} style={styles.rerollButton}>
          <Image
            source={require('../assets/reroll.png')}
            style={styles.rerollImage}
          />
        </TouchableOpacity>

        <View style={styles.box}>
          <Text style={styles.decibelText}>
            현재 데시벨: {currentDecibel} dB
          </Text>

          {randomBook && (
            <Animated.Text style={[styles.bookTitle, {opacity: fadeAnim}]}>
              {randomBook}
            </Animated.Text>
          )}

          <Text style={styles.text}>
            해당 책의 35페이지 3번째 줄에 있는 첫 단어를 입력해보자
          </Text>

          <TouchableOpacity
            onPress={() => {
              // 버튼 클릭 시 입력값 초기화 후 모달 오픈
              setAnswer('');
              setIsModalVisible(true);
            }}
            style={styles.inputContainer}>
            <Text style={styles.inputText}>정답 입력하기</Text>
          </TouchableOpacity>

          <Text style={styles.noticeText}>
            위의 버튼을 누르면 전부 대출되어서{'\n'}책이 없는 상황일 때 다시
            랜덤으로 초기화해주는 버튼이야!
          </Text>
        </View>

        <Modal animationType="fade" transparent visible={isModalVisible}>
          <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
            <View style={styles.modalBackground}>
              <TouchableWithoutFeedback>
                <View style={styles.modalContainer}>
                  <Text style={styles.modalTitle}>정답을 입력하세요</Text>
                  <TextInput
                    style={styles.modalInput}
                    value={answer}
                    onChangeText={setAnswer}
                    placeholder="정답 입력"
                    autoFocus
                  />
                  <TouchableOpacity
                    onPress={handleSubmitAnswer}
                    style={styles.submitButton}>
                    <Text style={styles.buttonText}>제출하기</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
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
    alignSelf: 'center',
    marginTop: height * 0.2,
  },
  decibelText: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: 'red',
    marginBottom: height * 0.01,
  },
  bookTitle: {
    marginTop: height * 0.05,
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#FF5733',
    marginVertical: height * 0.01,
    textAlign: 'center',
  },
  inputContainer: {
    marginTop: height * 0.05,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 255, 0.7)',
    borderRadius: 5,
  },
  text: {
    marginTop: height * 0.05,
    color: '#333',
    fontSize: width * 0.055,
    fontWeight: 'bold',
    marginBottom: height * 0.01,
    textAlign: 'center',
    lineHeight: height * 0.035,
  },
  inputText: {
    fontSize: width * 0.04,
    color: '#FFFFFF',
  },
  rerollButton: {
    position: 'absolute',
    top: height * 0.055,
    left: width * 0.45,
    width: width * 0.1,
    height: width * 0.1,
  },
  rerollImage: {
    width: '100%',
    height: '100%',
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
    fontWeight: 'bold',
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
  },
  submitButton: {
    backgroundColor: 'rgba(0, 0, 255, 0.7)',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.2,
    borderRadius: width * 0.03,
  },
  buttonText: {
    color: '#FFFddd',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  noticeText: {
    marginTop: height * 0.05,
    fontSize: width * 0.04,
    color: '#555',
    textAlign: 'center',
    lineHeight: height * 0.03,
  },
});

export default Stage13_Sound;
