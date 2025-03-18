// // import React, {useRef, useEffect, useState} from 'react';
// // import {
// //   View,
// //   StyleSheet,
// //   Alert,
// //   Text,
// //   TouchableOpacity,
// //   Platform,
// //   PermissionsAndroid,
// // } from 'react-native';
// // import WebView from 'react-native-webview';
// // import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
// // // import Geolocation from 'react-native-geolocation-service';
// // import {useNavigation} from '@react-navigation/native';
// // import Geolocation from '@react-native-community/geolocation';
// // const KAKAO_MAP_HTML = `
// // <!DOCTYPE html>
// // <html lang="ko">
// // <head>
// //     <meta charset="utf-8">
// //     <meta name="viewport" content="width=device-width, initial-scale=1">
// //     <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
// //     <title>Kakao 지도 시작하기</title>
// //     <script type="text/javascript" src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=9d681cdfc0dc6764e525f7c54dca0e0e"></script>
// //     <style>
// //         html, body { margin: 0; padding: 0; width: 100%; height: 100%; }
// //         #map { width: 100%; height: 100%; }
// //     </style>
// // </head>
// // <body>
// //     <div id="map"></div>
// // <script>
// //     let map;
// //     let marker = null; // 기존 마커를 추적하는 변수

// //     function initializeMap() {
// //         console.log("✅ Kakao Maps API 로드 완료");
// //         var container = document.getElementById('map');
// //         var options = {
// //             center: new kakao.maps.LatLng(37.5665, 126.9780), // 기본 서울 좌표
// //             level: 3
// //         };
// //         map = new kakao.maps.Map(container, options);
// //     }

// //     function updateLocation(lat, lng) {
// //         console.log("📍 지도 위치 업데이트 실행됨:", lat, lng);
// //         var moveLatLon = new kakao.maps.LatLng(lat, lng);
// //         map.setCenter(moveLatLon);

// //         if (marker) {
// //             marker.setMap(null);
// //         }

// //         marker = new kakao.maps.Marker({ position: moveLatLon, map: map });
// //     }

// //     window.addEventListener("message", function(event) {
// //         console.log("📩 WebView에서 메시지 수신:", event.data);
// //         try {
// //             var data = JSON.parse(event.data);
// //             if (data.lat && data.lng) {
// //                 updateLocation(data.lat, data.lng);
// //             }
// //         } catch (error) {
// //             console.error("❌ WebView 메시지 처리 중 오류 발생:", error);
// //         }
// //     });

// //     document.addEventListener("DOMContentLoaded", function() {
// //         console.log("📡 Kakao Maps HTML 로드됨");
// //         initializeMap();
// //         window.ReactNativeWebView?.postMessage(JSON.stringify({ type: "loaded" }));
// //     });
// // </script>
// // </body>
// // </html>
// // `;

// // const Map = () => {
// //   const webViewRef = useRef<WebView>(null);
// //   const navigation = useNavigation(); // ✅ Navigation 훅 추가
// //   const [location, setLocation] = useState<{lat: number; lng: number} | null>(
// //     null,
// //   );
// //   const [webViewLoaded, setWebViewLoaded] = useState(false);

// //   useEffect(() => {
// //     requestLocationPermission();
// //     if (location && webViewLoaded && webViewRef.current) {
// //       console.log('📡 WebView에 위치 전송:', location);
// //       webViewRef.current.injectJavaScript(`
// //         updateLocation(${location.lat}, ${location.lng});
// //       `);
// //     }
// //   }, [location, webViewLoaded]);

// //   // iOS 위치 권한 요청
// //   const requestLocationPermission = async () => {
// //     const permission = PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
// //     const result = await request(permission);

// //     if (result === RESULTS.GRANTED) {
// //       console.log('✅ 위치 권한 허용됨');
// //       getCurrentLocation();
// //     } else {
// //       console.log('⚠️ 위치 권한 필요');
// //       Alert.alert('위치 권한 필요', '위치를 가져오려면 권한을 허용해주세요.');
// //     }
// //   };

// //   //진짜 권한 요청
// //   // const requestLocationPermission = async () => {
// //   //   let permission;

// //   //   if (Platform.OS === 'ios') {
// //   //     permission = PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
// //   //   } else {
// //   //     // ✅ 안드로이드에서는 ACCESS_FINE_LOCATION 요청
// //   //     permission = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
// //   //   }

// //   //   const result = await request(permission);

// //   //   if (result === RESULTS.GRANTED) {
// //   //     console.log('✅ 위치 권한 허용됨');
// //   //     getCurrentLocation(); // ✅ 위치 가져오기 실행
// //   //   } else {
// //   //     console.log('⚠️ 위치 권한 필요');
// //   //     Alert.alert('위치 권한 필요', '위치를 가져오려면 권한을 허용해주세요.');
// //   //   }
// //   // };

// //   //Android 위치 권한 요청
// //   // const requestLocationPermission = async () => {
// //   //   try {
// //   //     // 현재 권한 확인
// //   //     const hasPermission = await PermissionsAndroid.check(
// //   //       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
// //   //     );

// //   //     if (hasPermission) {
// //   //       console.log('✅ 위치 권한 이미 허용됨');
// //   //       return true;
// //   //     }

// //   //     // 권한 요청
// //   //     const granted = await PermissionsAndroid.request(
// //   //       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
// //   //     );

// //   //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
// //   //       console.log('✅ 위치 권한 허용됨');
// //   //       return true;
// //   //     } else {
// //   //       console.log('⚠️ 위치 권한이 거부되었습니다.');
// //   //       Alert.alert(
// //   //         '위치 권한 필요',
// //   //         '현재 위치를 사용하려면 위치 권한을 허용해주세요.',
// //   //         [{text: '확인'}],
// //   //       );
// //   //       return false;
// //   //     }
// //   //   } catch (err) {
// //   //     console.warn('🚨 위치 권한 요청 중 오류 발생:', err);
// //   //     return false;
// //   //   }
// //   // };

// //   //ios 가능
// //   // const getCurrentLocation = () => {
// //   //   console.log('📡 현재 위치 가져오는 중...');
// //   //   Geolocation.getCurrentPosition(
// //   //     position => {
// //   //       const {latitude, longitude} = position.coords;
// //   //       console.log('📍 현재 위치:', latitude, longitude);
// //   //       setLocation({lat: latitude, lng: longitude});

// //   //       // WebView가 로드된 후에만 위치 정보 전달
// //   //       if (webViewLoaded) {
// //   //         webViewRef.current?.postMessage(
// //   //           JSON.stringify({lat: latitude, lng: longitude}),
// //   //         );
// //   //       }
// //   //     },
// //   //     error => {
// //   //       console.error('❌ 위치 가져오기 실패:', error);
// //   //       Alert.alert('오류', '현재 위치를 가져올 수 없습니다.');
// //   //     },
// //   //     {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
// //   //   );
// //   // };

// //   //iOS 가능
// //   const getCurrentLocation = async () => {
// //     console.log('📡 현재 위치 가져오는 중...');

// //     // 위치 권한 확인
// //     const permission =
// //       Platform.OS === 'ios'
// //         ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
// //         : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

// //     const hasPermission = await request(permission);

// //     if (hasPermission !== RESULTS.GRANTED) {
// //       console.log('⚠️ 위치 권한이 없습니다.');
// //       Alert.alert(
// //         '위치 권한 필요',
// //         '현재 위치를 가져오려면 권한을 허용해주세요.',
// //       );
// //       return;
// //     }

// //     Geolocation.getCurrentPosition(
// //       position => {
// //         const {latitude, longitude} = position.coords;
// //         console.log('📍 현재 위치:', latitude, longitude);
// //         setLocation({lat: latitude, lng: longitude});

// //         // WebView가 로드된 후에만 위치 정보 전달
// //         if (webViewLoaded && webViewRef.current) {
// //           webViewRef.current.postMessage(
// //             JSON.stringify({lat: latitude, lng: longitude}),
// //           );
// //         }
// //       },
// //       error => {
// //         console.error('❌ 위치 가져오기 실패:', error);

// //         // 오류 코드별 처리
// //         let errorMessage = '현재 위치를 가져올 수 없습니다.';
// //         if (error.code === 1) {
// //           errorMessage = '위치 권한이 거부되었습니다.';
// //         } else if (error.code === 2) {
// //           errorMessage = '기기가 위치 정보를 가져올 수 없습니다.';
// //         } else if (error.code === 3) {
// //           errorMessage = '위치 정보를 가져오는 데 시간이 초과되었습니다.';
// //         }

// //         Alert.alert('위치 오류', errorMessage);
// //       },
// //       {
// //         enableHighAccuracy: Platform.OS === 'ios', // ✅ iOS는 정확도 높음 유지
// //         timeout: 10000, // ⏳ 요청 타임아웃 (20초 → 10초로 변경)
// //         maximumAge: 5000, // ⏱ 이전 위치 캐싱 허용
// //       },
// //     );
// //   };

// //   // ios에서 안됨, Android 됨
// //   // const getCurrentLocation = async () => {
// //   //   console.log('📡 현재 위치 가져오는 중...');
// //   //   const hasPermission = await requestLocationPermission();
// //   //   if (!hasPermission) return;

// //   //   Geolocation.getCurrentPosition(
// //   //     position => {
// //   //       if (!position?.coords) {
// //   //         console.log('🚨 위치 정보를 찾을 수 없음');
// //   //         Alert.alert('위치 오류', '위치를 가져올 수 없습니다.');
// //   //         return;
// //   //       }

// //   //       const {latitude, longitude, accuracy} = position.coords;
// //   //       console.log(
// //   //         `📡 위치 정보: 위도 ${latitude}, 경도 ${longitude}, 정확도 ${accuracy}m`,
// //   //       );

// //   //       // ✅ 상태 업데이트 (함수형 업데이트 사용)
// //   //       setLocation(prevState => {
// //   //         const newLocation = {lat: latitude, lng: longitude};
// //   //         console.log('📍 상태 업데이트 후:', newLocation);
// //   //         return newLocation;
// //   //       });
// //   //     },
// //   //     error => {
// //   //       console.log('🚨 위치 가져오기 실패:', error);
// //   //       Alert.alert('위치 오류', '위치를 가져올 수 없습니다.');
// //   //     },
// //   //     {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
// //   //   );
// //   // };

// //   const handleWebViewMessage = (event: any) => {
// //     console.log('📩 WebView 메시지 수신:', event.nativeEvent.data);
// //     try {
// //       const data = JSON.parse(event.nativeEvent.data);

// //       if (data.type === 'loaded') {
// //         console.log('✅ WebView가 로드 완료됨');
// //         setWebViewLoaded(true);

// //         if (location) {
// //           console.log('📡 WebView에 위치 전송:', location);
// //           webViewRef.current?.postMessage(JSON.stringify(location));
// //         }
// //       }
// //     } catch (error) {
// //       console.error('❌ WebView 메시지 처리 중 오류 발생:', error);
// //     }
// //   };

// //   return (
// //     <View style={styles.container}>
// //       <WebView
// //         ref={webViewRef}
// //         source={{html: KAKAO_MAP_HTML}}
// //         style={styles.webview}
// //         originWhitelist={['*']}
// //         javaScriptEnabled={true}
// //         domStorageEnabled={true}
// //         onMessage={handleWebViewMessage}
// //       />
// //       {/* 내 위치 확인 버튼 */}
// //       <TouchableOpacity style={styles.button} onPress={getCurrentLocation}>
// //         <Text style={styles.buttonText}>📍 내 위치 찾기</Text>
// //       </TouchableOpacity>
// //       {/* 위치 정보 출력 */}

// //       <Text style={styles.locationText}>
// //         {location?.lat && location?.lng
// //           ? `📍 현재 위치: 위도 ${location.lat}, 경도 ${location.lng}`
// //           : '⏳ 위치 정보를 가져오는 중...'}
// //       </Text>
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {flex: 1},
// //   webview: {flex: 1},
// //   // 내 위치 찾기 버튼
// //   button: {
// //     position: 'absolute',
// //     bottom: 150,
// //     left: '50%',
// //     transform: [{translateX: -75}],
// //     backgroundColor: '#007AFF',
// //     paddingVertical: 12,
// //     paddingHorizontal: 24,
// //     borderRadius: 8,
// //   },
// //   buttonText: {
// //     fontSize: 16,
// //     color: '#FFF',
// //     fontWeight: 'bold',
// //   },
// //   // 위치 정보 출력 스타일
// //   locationText: {
// //     position: 'absolute',
// //     bottom: 50, // 🔹 화면 하단에 고정
// //     alignSelf: 'center',
// //     fontSize: 16,
// //     color: '#000', // 🔹 가독성을 위해 검정색
// //     backgroundColor: 'rgba(255, 255, 255, 0.8)', // 🔹 반투명 배경 추가
// //     padding: 10,
// //     borderRadius: 5,
// //   },
// // });

// // export default Map;

// import React, {useRef, useEffect, useState} from 'react';
// import {
//   View,
//   StyleSheet,
//   Alert,
//   Text,
//   TouchableOpacity,
//   Platform,
//   PermissionsAndroid,
// } from 'react-native';
// import WebView from 'react-native-webview';
// import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
// import {useNavigation} from '@react-navigation/native';
// import Geolocation from '@react-native-community/geolocation';

// const KAKAO_MAP_HTML = `
// <!DOCTYPE html>
// <html lang="ko">
// <head>
//     <meta charset="utf-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1">
//     <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
//     <title>Kakao 지도 시작하기</title>
//     <script type="text/javascript" src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=9d681cdfc0dc6764e525f7c54dca0e0e"></script>
//     <style>
//         html, body { margin: 0; padding: 0; width: 100%; height: 100%; }
//         #map { width: 100%; height: 100%; }
//     </style>
// </head>
// <body>
//     <div id="map"></div>
// <script>
//     let map;
//     let marker = null;

//     function initializeMap() {
//         console.log("✅ Kakao Maps API 로드 완료");
//         var container = document.getElementById('map');
//         var options = {
//             center: new kakao.maps.LatLng(37.5665, 126.9780),
//             level: 3
//         };
//         map = new kakao.maps.Map(container, options);
//     }

//     function updateLocation(lat, lng) {
//         console.log("📍 지도 위치 업데이트 실행됨:", lat, lng);
//         var moveLatLon = new kakao.maps.LatLng(lat, lng);
//         map.setCenter(moveLatLon);

//         if (marker) {
//             marker.setMap(null);
//         }

//         marker = new kakao.maps.Marker({ position: moveLatLon, map: map });
//     }

//     window.addEventListener("message", function(event) {
//         console.log("📩 WebView에서 메시지 수신:", event.data);
//         try {
//             var data = JSON.parse(event.data);
//             if (data.lat && data.lng) {
//                 updateLocation(data.lat, data.lng);
//             }
//         } catch (error) {
//             console.error("❌ WebView 메시지 처리 중 오류 발생:", error);
//         }
//     });

//     document.addEventListener("DOMContentLoaded", function() {
//         console.log("📡 Kakao Maps HTML 로드됨");
//         initializeMap();
//         window.ReactNativeWebView?.postMessage(JSON.stringify({ type: "loaded" }));
//     });
// </script>
// </body>
// </html>
// `;

// const Map = () => {
//   const webViewRef = useRef<WebView>(null);
//   const navigation = useNavigation();
//   const [location, setLocation] = useState<{lat: number; lng: number} | null>(
//     null,
//   );
//   const [webViewLoaded, setWebViewLoaded] = useState(false);
//   const [shouldUpdateMap, setShouldUpdateMap] = useState(false); // ✅ 버튼 클릭 시 지도 업데이트 여부

//   useEffect(() => {
//     requestLocationPermission();
//   }, []);

//   useEffect(() => {
//     if (shouldUpdateMap && location && webViewLoaded && webViewRef.current) {
//       console.log('📡 WebView에 위치 전송:', location);
//       webViewRef.current.injectJavaScript(`
//         updateLocation(${location.lat}, ${location.lng});
//       `);
//       setShouldUpdateMap(false); // ✅ 지도 갱신 플래그 해제
//     }
//   }, [shouldUpdateMap, location, webViewLoaded]);

//   const requestLocationPermission = async () => {
//     try {
//       let permission =
//         Platform.OS === 'ios'
//           ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
//           : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

//       const result = await request(permission);

//       if (result === RESULTS.GRANTED) {
//         console.log('✅ 위치 권한 허용됨');
//       } else {
//         console.log('⚠️ 위치 권한 필요');
//         Alert.alert('위치 권한 필요', '위치를 가져오려면 권한을 허용해주세요.');
//       }
//     } catch (err) {
//       console.warn('🚨 위치 권한 요청 중 오류 발생:', err);
//     }
//   };

//   const getCurrentLocation = async () => {
//     console.log('📡 현재 위치 가져오는 중...');
//     Geolocation.getCurrentPosition(
//       position => {
//         if (!position?.coords) {
//           console.log('🚨 위치 정보를 찾을 수 없음');
//           Alert.alert('위치 오류', '위치를 가져올 수 없습니다.');
//           return;
//         }

//         const {latitude, longitude, accuracy} = position.coords;
//         console.log(
//           `📡 위치 정보: 위도 ${latitude}, 경도 ${longitude}, 정확도 ${accuracy}m`,
//         );

//         setLocation({lat: latitude, lng: longitude});
//         setShouldUpdateMap(true); // ✅ 지도 업데이트 플래그 설정
//       },
//       error => {
//         console.log('🚨 위치 가져오기 실패:', error);
//         Alert.alert('위치 오류', '위치를 가져올 수 없습니다.');
//       },
//       {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
//     );
//   };

//   const handleWebViewMessage = (event: any) => {
//     console.log('📩 WebView 메시지 수신:', event.nativeEvent.data);
//     try {
//       const data = JSON.parse(event.nativeEvent.data);

//       if (data.type === 'loaded') {
//         console.log('✅ WebView가 로드 완료됨');
//         setWebViewLoaded(true);

//         if (location) {
//           console.log('📡 WebView에 위치 전송:', location);
//           webViewRef.current?.postMessage(JSON.stringify(location));
//         }
//       }
//     } catch (error) {
//       console.error('❌ WebView 메시지 처리 중 오류 발생:', error);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <WebView
//         ref={webViewRef}
//         source={{html: KAKAO_MAP_HTML}}
//         style={styles.webview}
//         originWhitelist={['*']}
//         javaScriptEnabled={true}
//         domStorageEnabled={true}
//         onMessage={handleWebViewMessage}
//       />
//       {/* 내 위치 찾기 버튼 */}
//       <TouchableOpacity style={styles.button} onPress={getCurrentLocation}>
//         <Text style={styles.buttonText}>📍 내 위치 찾기</Text>
//       </TouchableOpacity>

//       {/* 위치 정보 출력 */}
//       <Text style={styles.locationText}>
//         {location?.lat && location?.lng
//           ? `📍 현재 위치: 위도 ${location.lat}, 경도 ${location.lng}`
//           : '⏳ 위치 정보를 가져오는 중...'}
//       </Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {flex: 1},
//   webview: {flex: 1},
//   button: {
//     position: 'absolute',
//     bottom: 150,
//     left: '50%',
//     transform: [{translateX: -75}],
//     backgroundColor: '#007AFF',
//     paddingVertical: 12,
//     paddingHorizontal: 24,
//     borderRadius: 8,
//   },
//   buttonText: {
//     fontSize: 16,
//     color: '#FFF',
//     fontWeight: 'bold',
//   },
//   locationText: {
//     position: 'absolute',
//     bottom: 50,
//     alignSelf: 'center',
//     fontSize: 16,
//     color: '#000',
//     backgroundColor: 'rgba(255, 255, 255, 0.8)',
//     padding: 10,
//     borderRadius: 5,
//   },
// });

// export default Map;

import React, {useRef, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Text,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import WebView from 'react-native-webview';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {useNavigation} from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';

const KAKAO_MAP_HTML = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
    <title>Kakao 지도 시작하기</title>
    <script type="text/javascript" src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=9d681cdfc0dc6764e525f7c54dca0e0e"></script>
    <style>
        html, body { margin: 0; padding: 0; width: 100%; height: 100%; }
        #map { width: 100%; height: 100%; }
    </style>
</head>
<body>
    <div id="map"></div>
<script>
    let map;
    let marker = null;

    function initializeMap() {
        console.log("✅ Kakao Maps API 로드 완료");
        var container = document.getElementById('map');
        var options = {
            center: new kakao.maps.LatLng(37.5665, 126.9780),
            level: 3
        };
        map = new kakao.maps.Map(container, options);
    }

    function updateLocation(lat, lng) {
        console.log("📍 지도 위치 업데이트 실행됨:", lat, lng);
        var moveLatLon = new kakao.maps.LatLng(lat, lng);
        map.setCenter(moveLatLon);

        if (marker) {
            marker.setMap(null);
        }

        marker = new kakao.maps.Marker({ position: moveLatLon, map: map });
    }

    window.addEventListener("message", function(event) {
        console.log("📩 WebView에서 메시지 수신:", event.data);
        try {
            var data = JSON.parse(event.data);
            if (data.lat && data.lng) {
                updateLocation(data.lat, data.lng);
            }
        } catch (error) {
            console.error("❌ WebView 메시지 처리 중 오류 발생:", error);
        }
    });

    document.addEventListener("DOMContentLoaded", function() {
        console.log("📡 Kakao Maps HTML 로드됨");
        initializeMap();
        window.ReactNativeWebView?.postMessage(JSON.stringify({ type: "loaded" }));
    });
</script>
</body>
</html>
`;

const Map = () => {
  const webViewRef = useRef<WebView>(null);
  const navigation = useNavigation();
  const [location, setLocation] = useState<{lat: number; lng: number} | null>(
    null,
  );
  const [webViewLoaded, setWebViewLoaded] = useState(false);
  const [shouldUpdateMap, setShouldUpdateMap] = useState(false);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  useEffect(() => {
    if (shouldUpdateMap && location && webViewLoaded && webViewRef.current) {
      console.log('📡 WebView에 위치 전송:', location);
      webViewRef.current.injectJavaScript(`
        updateLocation(${location.lat}, ${location.lng});
      `);
      setShouldUpdateMap(false);
    }
  }, [shouldUpdateMap, location, webViewLoaded]);

  // ✅ iOS & Android 통합 위치 권한 요청
  // const requestLocationPermission = async () => {
  //   try {
  //     let permission =
  //       Platform.OS === 'ios'
  //         ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
  //         : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

  //     if (Platform.OS === 'android') {
  //       const hasPermission = await PermissionsAndroid.check(permission);
  //       if (hasPermission) {
  //         console.log('✅ 위치 권한 이미 허용됨');
  //         return true;
  //       }
  //     }

  //     const result = await request(permission);
  //     if (result === RESULTS.GRANTED) {
  //       console.log('✅ 위치 권한 허용됨');
  //       return true;
  //     } else {
  //       console.log('⚠️ 위치 권한 필요');
  //       Alert.alert('위치 권한 필요', '위치를 가져오려면 권한을 허용해주세요.');
  //       return false;
  //     }
  //   } catch (err) {
  //     console.warn('🚨 위치 권한 요청 중 오류 발생:', err);
  //     return false;
  //   }
  // };

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'ios') {
        // ✅ iOS 권한 요청 (iOS 14 이상에서는 정확도 설정도 필요할 수 있음)
        const result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);

        if (result === RESULTS.GRANTED) {
          console.log('✅ 위치 권한 허용됨 (iOS)');
          return true;
        } else {
          console.log('⚠️ 위치 권한 거부됨 (iOS)');
          Alert.alert(
            '위치 권한 필요',
            '현재 위치를 가져오려면 위치 권한을 허용해주세요.',
          );
          return false;
        }
      } else if (Platform.OS === 'android') {
        // ✅ Android 12 이상에서는 FINE + COARSE LOCATION 요청 필요
        const fineLocationGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );

        const coarseLocationGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        );

        if (
          fineLocationGranted === PermissionsAndroid.RESULTS.GRANTED ||
          coarseLocationGranted === PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log('✅ 위치 권한 허용됨 (Android)');
          return true;
        } else {
          console.log('⚠️ 위치 권한 거부됨 (Android)');
          Alert.alert(
            '위치 권한 필요',
            '현재 위치를 가져오려면 권한을 허용해주세요.',
          );
          return false;
        }
      }
    } catch (error) {
      console.error('🚨 위치 권한 요청 중 오류 발생:', error);
      return false;
    }
  };

  const getCurrentLocation = async () => {
    console.log('📡 현재 위치 가져오는 중...');
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) return;

    Geolocation.getCurrentPosition(
      position => {
        if (!position?.coords) {
          console.log('🚨 위치 정보를 찾을 수 없음');
          Alert.alert('위치 오류', '위치를 가져올 수 없습니다.');
          return;
        }

        const {latitude, longitude, accuracy} = position.coords;
        console.log(
          `📡 위치 정보: 위도 ${latitude}, 경도 ${longitude}, 정확도 ${accuracy}m`,
        );

        setLocation({lat: latitude, lng: longitude});
        setShouldUpdateMap(true);
      },
      error => {
        console.log('🚨 위치 가져오기 실패:', error);
        Alert.alert('위치 오류', '위치를 가져올 수 없습니다.');
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  };

  const handleWebViewMessage = (event: any) => {
    console.log('📩 WebView 메시지 수신:', event.nativeEvent.data);
    try {
      const data = JSON.parse(event.nativeEvent.data);

      if (data.type === 'loaded') {
        console.log('✅ WebView가 로드 완료됨');
        setWebViewLoaded(true);

        if (location) {
          console.log('📡 WebView에 위치 전송:', location);
          webViewRef.current?.postMessage(JSON.stringify(location));
        }
      }
    } catch (error) {
      console.error('❌ WebView 메시지 처리 중 오류 발생:', error);
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{html: KAKAO_MAP_HTML}}
        style={styles.webview}
        originWhitelist={['*']}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onMessage={handleWebViewMessage}
      />
      {/* 내 위치 확인 버튼 */}
      <TouchableOpacity style={styles.button} onPress={getCurrentLocation}>
        <Text style={styles.buttonText}>📍 내 위치 찾기</Text>
      </TouchableOpacity>

      {/* 위치 정보 출력 */}
      <Text style={styles.locationText}>
        {location?.lat && location?.lng
          ? `📍 현재 위치: 위도 ${location.lat}, 경도 ${location.lng}`
          : '⏳ 위치 정보를 가져오는 중...'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  webview: {flex: 1},
  button: {
    position: 'absolute',
    bottom: 150,
    left: '50%',
    transform: [{translateX: -75}],
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: 'bold',
  },
  locationText: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    fontSize: 16,
    color: '#000',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 5,
  locationText: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    fontSize: 16,
    color: '#000',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 5,
  },
});

export default Map;