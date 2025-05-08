// import React, {useEffect, useRef, useState, useMemo} from 'react';
// import {
//   View,
//   Platform,
//   PermissionsAndroid,
//   TouchableOpacity,
//   Text,
//   StyleSheet,
// } from 'react-native';
// import WebView from 'react-native-webview';
// import Geolocation from '@react-native-community/geolocation';

// const Map = () => {
//   const webViewRef = useRef(null);
//   const [location, setLocation] = useState({lat: 37.5665, lng: 126.978});
//   useEffect(() => {
//     getCurrentLocation(); // 자동 실행
//   }, []);

//   const getCurrentLocation = async () => {
//     if (Platform.OS === 'android') {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//       );
//       if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
//         console.warn('위치 권한 거부됨');
//         return;
//       }
//     }

//     Geolocation.getCurrentPosition(
//       pos => {
//         const {latitude, longitude} = pos.coords;
//         console.log('현재 위치:', latitude, longitude);
//         const newLoc = {lat: latitude, lng: longitude};
//         setLocation(newLoc);

//         // React Native → WebView 메시지 전송
//         if (webViewRef.current) {
//           webViewRef.current.postMessage(JSON.stringify(newLoc));
//         }
//       },
//       err => {
//         console.warn('위치 정보 오류:', err);
//       },
//       {
//         enableHighAccuracy: false,
//         timeout: 30000,
//         maximumAge: 10000,
//       },
//     );
//   };

//   const mapHtml = useMemo(
//     () => `
// <!DOCTYPE html>
// <html lang="ko">
// <head>
//   <meta charset="utf-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1">
//   <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
//   <title>지도</title>
//   <style>
//     html, body, #map {
//       margin: 0;
//       padding: 0;
//       width: 100%;
//       height: 100%;
//     }
//   </style>
//   <script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=9d681cdfc0dc6764e525f7c54dca0e0e"></script>
// </head>
// <body>
//   <div id="map"></div>
//   <script>
//     let map, marker;

//     function initMap() {
//       const center = new kakao.maps.LatLng(${location.lat}, ${location.lng});
//       const container = document.getElementById('map');
//       const options = {
//         center: center,
//         level: 3
//       };
//       map = new kakao.maps.Map(container, options);
//       marker = new kakao.maps.Marker({ position: center });
//       marker.setMap(map);
//     }

//     window.onload = () => {
//       if (typeof kakao !== 'undefined') {
//         kakao.maps.load(() => {
//           initMap();
//           window.ReactNativeWebView?.postMessage(JSON.stringify({ type: "loaded" }));
//         });
//       } else {
//         document.body.innerHTML = "<h2>Kakao 지도 로딩 실패</h2>";
//       }
//     };

//     window.addEventListener("message", function(event) {
//       try {
//         const data = JSON.parse(event.data);
//         const newLatLng = new kakao.maps.LatLng(data.lat, data.lng);
//         map.setCenter(newLatLng);
//         marker.setPosition(newLatLng);
//       } catch (e) {
//         console.error("JSON 파싱 실패", e);
//       }
//     });
//   </script>
// </body>
// </html>
// `,
//     [location],
//   );

//   return (
//     <View style={{flex: 1}}>
//       <WebView
//         ref={webViewRef}
//         originWhitelist={['*']}
//         source={{html: mapHtml}}
//         javaScriptEnabled={true}
//         domStorageEnabled={true}
//         allowsInlineMediaPlayback={true} //ㅊ
//         startInLoadingState={true} //ㅊ
//         mixedContentMode="always" //ㅊ
//         onMessage={() => {}}
//       />
//       <TouchableOpacity style={styles.button} onPress={getCurrentLocation}>
//         <Text style={styles.buttonText}>📍 내 위치 찾기</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   button: {
//     position: 'absolute',
//     bottom: 40,
//     right: 20,
//     backgroundColor: '#4285F4',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 25,
//     elevation: 5,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
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
import {useNavigation} from '@react-navigation/native'; // ✅ 추가

const Map = () => {
  const navigation = useNavigation(); // ✅ 네비게이션 객체
  const webViewRef = useRef(null);
  const [location, setLocation] = useState({lat: 37.5665, lng: 126.978});

  useEffect(() => {
    getCurrentLocation();
  }, []);

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
        const newLoc = {lat: latitude, lng: longitude};
        setLocation(newLoc);
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
  };

  const mapHtml = useMemo(
    () => `<!DOCTYPE html>
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
      {/* ✅ 뒤로가기 버튼 */}
      {/* <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>⬅️ 뒤로 가기</Text>
      </TouchableOpacity> */}

      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{html: mapHtml}}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsInlineMediaPlayback={true}
        startInLoadingState={true}
        mixedContentMode="always"
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
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
    backgroundColor: '#489CFF',
    borderRadius: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    elevation: 5,
  },
  backText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default Map;
