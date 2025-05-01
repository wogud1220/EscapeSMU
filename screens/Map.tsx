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
  const [location, setLocation] = useState<{
    lat: number;
    lng: number;
    alt?: number;
  } | null>(null);
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

        const {latitude, longitude, altitude, accuracy} = position.coords;
        console.log(
          `📡 위치 정보: 위도 ${latitude}, 경도 ${longitude}, 고도 ${altitude}m, 정확도 ${accuracy}m`,
        );

        setLocation({
          lat: latitude,
          lng: longitude,
          alt: altitude !== null ? altitude : undefined, // null이면 undefined로 처리
        });
        setShouldUpdateMap(true);
      },
      error => {
        console.log('🚨 위치 가져오기 실패:', error);
        Alert.alert('위치 오류', '위치를 가져올 수 없습니다.');
      },
      {
        enableHighAccuracy: false, // 정확도 높은 GPS 정보 사용
        timeout: 1000, // 15초 타임아웃
        maximumAge: 10000, // 10초 내의 캐시된 위치 허용
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
          ? `📍 현재 위치: 위도 ${location.lat}, 경도 ${location.lng}, 고도 ${
              location.alt ? location.alt.toFixed(2) : 'N/A'
            }m`
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
  },
});

export default Map;