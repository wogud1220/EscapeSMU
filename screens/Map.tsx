// import React, {useState} from 'react';
// import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
// import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
// import {Platform} from 'react-native';

// const Map = () => {
//   const [locationPermission, setLocationPermission] = useState<string | null>(
//     null,
//   );

//   const requestLocationPermission = async () => {
//     const permission =
//       Platform.OS === 'ios'
//         ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
//         : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

//     const result = await request(permission);

//     if (result === RESULTS.GRANTED) {
//       setLocationPermission('권한 허용됨 ✅');
//       Alert.alert('위치 권한 허용됨', '이제 지도를 사용할 수 있습니다!');
//     } else if (result === RESULTS.DENIED) {
//       setLocationPermission('권한 요청됨 ⏳');
//       Alert.alert(
//         '위치 권한 필요',
//         '위치 기능을 사용하려면 권한을 허용해주세요.',
//       );
//     } else if (result === RESULTS.BLOCKED) {
//       setLocationPermission('권한 거부됨 ❌');
//       Alert.alert('위치 권한 차단됨', '설정에서 직접 권한을 허용해주세요.');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>Map 화면입니다.</Text>

//       <TouchableOpacity
//         style={styles.button}
//         onPress={requestLocationPermission}>
//         <Text style={styles.buttonText}>📍 위치 권한 요청</Text>
//       </TouchableOpacity>

//       {locationPermission && (
//         <Text style={styles.permissionText}>{locationPermission}</Text>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F5E6C4',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   text: {
//     fontSize: 20,
//     color: '#333',
//     marginBottom: 20,
//   },
//   button: {
//     backgroundColor: '#007AFF',
//     paddingVertical: 15,
//     paddingHorizontal: 30,
//     borderRadius: 10,
//   },
//   buttonText: {
//     fontSize: 18,
//     color: '#FFF',
//     fontWeight: 'bold',
//   },
//   permissionText: {
//     marginTop: 20,
//     fontSize: 16,
//     color: '#333',
//   },
// });

// export default Map;

import React, {useRef, useEffect, useState} from 'react';
import {View, StyleSheet, Alert, Text, TouchableOpacity} from 'react-native';
import WebView from 'react-native-webview';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
import {useNavigation} from '@react-navigation/native';

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
    let marker = null; // 기존 마커를 추적하는 변수

    function initializeMap() {
        console.log("✅ Kakao Maps API 로드 완료");
        var container = document.getElementById('map');
        var options = {
            center: new kakao.maps.LatLng(37.5665, 126.9780), // 기본 서울 좌표
            level: 3
        };
        map = new kakao.maps.Map(container, options);

        if (map) {
            console.log("🗺️ 지도 객체 생성 완료:", map);
        } else {
            console.error("❌ 지도 생성 실패!");
        }
    }

    function updateLocation(lat, lng) {
        console.log("📍 지도 위치 업데이트:", lat, lng);
        var moveLatLon = new kakao.maps.LatLng(lat, lng);
        map.setCenter(moveLatLon);
        
         // 기존 마커가 있으면 제거
        if (marker) {
            marker.setMap(null);
        }

        // 새로운 마커 생성 및 지도에 추가
        marker = new kakao.maps.Marker({ position: moveLatLon, map: map });
    }

    window.addEventListener("message", function(event) {
        var data = JSON.parse(event.data);
        if (data.lat && data.lng) {
            updateLocation(data.lat, data.lng);
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
  const navigation = useNavigation(); // ✅ Navigation 훅 추가
  const [location, setLocation] = useState<{lat: number; lng: number} | null>(
    null,
  );
  const [webViewLoaded, setWebViewLoaded] = useState(false);

  useEffect(() => {
    console.log('📌 앱이 실행됨');
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    const permission = PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
    const result = await request(permission);

    if (result === RESULTS.GRANTED) {
      console.log('✅ 위치 권한 허용됨');
      getCurrentLocation();
    } else {
      console.log('⚠️ 위치 권한 필요');
      Alert.alert('위치 권한 필요', '위치를 가져오려면 권한을 허용해주세요.');
    }
  };

  const getCurrentLocation = () => {
    console.log('📡 현재 위치 가져오는 중...');
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        console.log('📍 현재 위치:', latitude, longitude);
        setLocation({lat: latitude, lng: longitude});

        // WebView가 로드된 후에만 위치 정보 전달
        if (webViewLoaded) {
          webViewRef.current?.postMessage(
            JSON.stringify({lat: latitude, lng: longitude}),
          );
        }
      },
      error => {
        console.error('❌ 위치 가져오기 실패:', error);
        Alert.alert('오류', '현재 위치를 가져올 수 없습니다.');
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  };

  const handleWebViewMessage = (event: any) => {
    console.log('📩 WebView 메시지 수신:', event.nativeEvent.data);
    const data = JSON.parse(event.nativeEvent.data);
    if (data.type === 'loaded') {
      console.log('✅ WebView가 로드 완료됨');
      setWebViewLoaded(true);
      if (location) {
        webViewRef.current?.postMessage(JSON.stringify(location));
      }
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
        {location
          ? `📍쓸어서 뒤로가기 현재 위치: 위도 ${location.lat}, 경도 ${location.lng}`
          : '⏳ 위치 정보를 가져오는 중...'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  webview: {flex: 1},
  // 내 위치 찾기 버튼
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
  // 위치 정보 출력 스타일
  locationText: {
    position: 'absolute',
    bottom: 50, // 🔹 화면 하단에 고정
    alignSelf: 'center',
    fontSize: 16,
    color: '#000', // 🔹 가독성을 위해 검정색
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // 🔹 반투명 배경 추가
    padding: 10,
    borderRadius: 5,
  },
});

export default Map;
