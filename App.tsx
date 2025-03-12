import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Main from './screens/Main';
import StageList from './screens/StageList';
import Stage1 from './screens/Stage1';
import Stage1Camera from './screens/Stage1Camera';
import Map from './screens/Map';

export type RootStackParamList = {
  Main: undefined;
  StageList: undefined;
  Stage1: undefined;
  Stage1Camera: undefined;
  Map: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main">
        <Stack.Screen
          name="Main"
          component={Main}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="StageList"
          component={StageList}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Stage1"
          component={Stage1}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Stage1Camera"
          component={Stage1Camera}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Map"
          component={Map}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

// import React, {useRef, useEffect} from 'react';
// import {View, StyleSheet} from 'react-native';
// import WebView from 'react-native-webview';

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
//     <script>
//         kakao.maps.load(() => {
//             console.log("✅ Kakao Maps API 로드 완료");
//             var container = document.getElementById('map');
//             var options = {
//                 center: new kakao.maps.LatLng(37.2528023260744, 127.1175888963635),
//                 level: 3
//             };
//             var map = new kakao.maps.Map(container, options);
//         });
//     </script>
// </body>
// </html>
// `;

// const App = () => {
//   const webViewRef = useRef(null);

//   useEffect(() => {
//     console.log('📡 WebView가 로드됨');
//   }, []);

//   return (
//     <View style={styles.container}>
//       <WebView
//         ref={webViewRef}
//         source={{html: KAKAO_MAP_HTML}}
//         style={styles.webview}
//         originWhitelist={['*']}
//         javaScriptEnabled={true}
//         domStorageEnabled={true}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {flex: 1},
//   webview: {flex: 1},
// });

// export default App;
