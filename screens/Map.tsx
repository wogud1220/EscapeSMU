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
//   const [location, setLocation] = useState<{
//     lat: number;
//     lng: number;
//     alt?: number;
//   } | null>(null);
//   const [webViewLoaded, setWebViewLoaded] = useState(false);
//   const [shouldUpdateMap, setShouldUpdateMap] = useState(false);

//   useEffect(() => {
//     requestLocationPermission();
//   }, []);

//   useEffect(() => {
//     if (shouldUpdateMap && location && webViewLoaded && webViewRef.current) {
//       console.log('📡 WebView에 위치 전송:', location);
//       webViewRef.current.injectJavaScript(`
//         updateLocation(${location.lat}, ${location.lng});
//       `);
//       setShouldUpdateMap(false);
//     }
//   }, [shouldUpdateMap, location, webViewLoaded]);

//   const requestLocationPermission = async () => {
//     try {
//       if (Platform.OS === 'ios') {
//         // ✅ iOS 권한 요청 (iOS 14 이상에서는 정확도 설정도 필요할 수 있음)
//         const result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);

//         if (result === RESULTS.GRANTED) {
//           console.log('✅ 위치 권한 허용됨 (iOS)');
//           return true;
//         } else {
//           console.log('⚠️ 위치 권한 거부됨 (iOS)');
//           Alert.alert(
//             '위치 권한 필요',
//             '현재 위치를 가져오려면 위치 권한을 허용해주세요.',
//           );
//           return false;
//         }
//       } else if (Platform.OS === 'android') {
//         // ✅ Android 12 이상에서는 FINE + COARSE LOCATION 요청 필요
//         const fineLocationGranted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//         );

//         const coarseLocationGranted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
//         );

//         if (
//           fineLocationGranted === PermissionsAndroid.RESULTS.GRANTED ||
//           coarseLocationGranted === PermissionsAndroid.RESULTS.GRANTED
//         ) {
//           console.log('✅ 위치 권한 허용됨 (Android)');
//           return true;
//         } else {
//           console.log('⚠️ 위치 권한 거부됨 (Android)');
//           Alert.alert(
//             '위치 권한 필요',
//             '현재 위치를 가져오려면 권한을 허용해주세요.',
//           );
//           return false;
//         }
//       }
//     } catch (error) {
//       console.error('🚨 위치 권한 요청 중 오류 발생:', error);
//       return false;
//     }
//   };
//   // 고도 넣기 전 동작
//   // const getCurrentLocation = async () => {
//   //   console.log('📡 현재 위치 가져오는 중...');
//   //   const hasPermission = await requestLocationPermission();
//   //   if (!hasPermission) return;

//   //   Geolocation.getCurrentPosition(
//   //     position => {
//   //       if (!position?.coords) {
//   //         console.log('🚨 위치 정보를 찾을 수 없음');
//   //         Alert.alert('위치 오류', '위치를 가져올 수 없습니다.');
//   //         return;
//   //       }

//   //       const {latitude, longitude, accuracy} = position.coords;
//   //       console.log(
//   //         `📡 위치 정보: 위도 ${latitude}, 경도 ${longitude}, 정확도 ${accuracy}m`,
//   //       );

//   //       setLocation({lat: latitude, lng: longitude});
//   //       setShouldUpdateMap(true);
//   //     },
//   //     error => {
//   //       console.log('🚨 위치 가져오기 실패:', error);
//   //       Alert.alert('위치 오류', '위치를 가져올 수 없습니다.');
//   //     },
//   //     {
//   //       enableHighAccuracy: true,
//   //       timeout: 15000,
//   //       maximumAge: 10000,
//   //     },
//   //   );
//   // };

//   const getCurrentLocation = async () => {
//     console.log('📡 현재 위치 가져오는 중...');
//     const hasPermission = await requestLocationPermission();
//     if (!hasPermission) return;

//     Geolocation.getCurrentPosition(
//       position => {
//         if (!position?.coords) {
//           console.log('🚨 위치 정보를 찾을 수 없음');
//           Alert.alert('위치 오류', '위치를 가져올 수 없습니다.');
//           return;
//         }

//         const {latitude, longitude, altitude, accuracy} = position.coords;
//         console.log(
//           `📡 위치 정보: 위도 ${latitude}, 경도 ${longitude}, 고도 ${altitude}m, 정확도 ${accuracy}m`,
//         );

//         setLocation({
//           lat: latitude,
//           lng: longitude,
//           alt: altitude !== null ? altitude : undefined, // null이면 undefined로 처리
//         });
//         setShouldUpdateMap(true);
//       },
//       error => {
//         console.log('🚨 위치 가져오기 실패:', error);
//         Alert.alert('위치 오류', '위치를 가져올 수 없습니다.');
//       },
//       {
//         enableHighAccuracy: true, // 정확도 높은 GPS 정보 사용
//         timeout: 15000, // 15초 타임아웃
//         maximumAge: 10000, // 10초 내의 캐시된 위치 허용
//       },
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
//       {/* 내 위치 확인 버튼 */}
//       <TouchableOpacity style={styles.button} onPress={getCurrentLocation}>
//         <Text style={styles.buttonText}>📍 내 위치 찾기</Text>
//       </TouchableOpacity>

//       {/* 위치 정보 출력 */}
//       <Text style={styles.locationText}>
//         {location?.lat && location?.lng
//           ? `📍 현재 위치: 위도 ${location.lat}, 경도 ${location.lng}, 고도 ${
//               location.alt ? location.alt.toFixed(2) : 'N/A'
//             }m`
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

import React, {useEffect, useRef, useState, useMemo} from 'react';
import {
  View,
  Platform,
  PermissionsAndroid,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import WebView from 'react-native-webview';
import Geolocation from '@react-native-community/geolocation';

const Map = () => {
  const webViewRef = useRef(null);
  const [location, setLocation] = useState({lat: 37.5665, lng: 126.978});

  const getCurrentLocation = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.warn('위치 권한 거부됨');
        return;
      }
    }

    Geolocation.getCurrentPosition(
      pos => {
        const {latitude, longitude} = pos.coords;
        console.log('현재 위치:', latitude, longitude);
        const newLoc = {lat: latitude, lng: longitude};
        setLocation(newLoc);

        // React Native → WebView 메시지 전송
        if (webViewRef.current) {
          webViewRef.current.postMessage(JSON.stringify(newLoc));
        }
      },
      err => {
        console.warn('위치 정보 오류:', err);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 10000,
      },
    );
  }; // ✅ 중괄호 여기 꼭 닫아야 함!

  // const mapHtml = useMemo(
  //   () => `
  //   <!DOCTYPE html>
  //   <html>
  //   <head>
  //     <meta charset="utf-8">
  //     <script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=9d681cdfc0dc6764e525f7c54dca0e0e"></script>
  //   </head>
  //   <body>
  //     <div id="map" style="width:100%;height:100vh;"></div>
  //     <script>
  //       let map, marker;

  //       function initMap() {
  //         const center = new kakao.maps.LatLng(${location.lat}, ${location.lng});
  //         const container = document.getElementById('map');
  //         const options = {
  //           center: center,
  //           level: 3,
  //         };
  //         map = new kakao.maps.Map(container, options);
  //         marker = new kakao.maps.Marker({ position: center });
  //         marker.setMap(map);
  //       }

  //       window.onload = () => {
  //         initMap();

  //         // React Native → WebView 메시지 수신
  //         window.addEventListener("message", function(event) {
  //           try {
  //             const data = JSON.parse(event.data);
  //             const newLatLng = new kakao.maps.LatLng(data.lat, data.lng);
  //             map.setCenter(newLatLng);
  //             marker.setPosition(newLatLng);
  //           } catch (e) {
  //             console.error('JSON 파싱 실패:', e);
  //           }
  //         });
  //       };
  //     </script>
  //   </body>
  //   </html>
  // `,
  //   [location],
  // ); // location이 바뀌면 반영되도록

  const mapHtml = useMemo(
    () => `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
  <title>지도</title>
  <style>
    html, body, #map {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
    }
  </style>
  <script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=9d681cdfc0dc6764e525f7c54dca0e0e"></script>
</head>
<body>
  <div id="map"></div>
  <script>
    let map, marker;

    function initMap() {
      const center = new kakao.maps.LatLng(${location.lat}, ${location.lng});
      const container = document.getElementById('map');
      const options = {
        center: center,
        level: 3
      };
      map = new kakao.maps.Map(container, options);
      marker = new kakao.maps.Marker({ position: center });
      marker.setMap(map);
    }

    window.onload = () => {
      if (typeof kakao !== 'undefined') {
        kakao.maps.load(() => {
          initMap();
          window.ReactNativeWebView?.postMessage(JSON.stringify({ type: "loaded" }));
        });
      } else {
        document.body.innerHTML = "<h2>Kakao 지도 로딩 실패</h2>";
      }
    };

    window.addEventListener("message", function(event) {
      try {
        const data = JSON.parse(event.data);
        const newLatLng = new kakao.maps.LatLng(data.lat, data.lng);
        map.setCenter(newLatLng);
        marker.setPosition(newLatLng);
      } catch (e) {
        console.error("JSON 파싱 실패", e);
      }
    });
  </script>
</body>
</html>
`,
    [location],
  );

  return (
    <View style={{flex: 1}}>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{html: mapHtml}}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsInlineMediaPlayback={true} //ㅊ
        startInLoadingState={true} //ㅊ
        mixedContentMode="always" //ㅊ
        onMessage={() => {}}
      />
      <TouchableOpacity style={styles.button} onPress={getCurrentLocation}>
        <Text style={styles.buttonText}>📍 내 위치 찾기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    backgroundColor: '#4285F4',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Map;
