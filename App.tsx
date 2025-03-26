import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import LogIn from './screens/Member/LogIn';
import SignIn from './screens/Member/SignIn';
import Main from './screens/Main';
import StageList from './screens/StageList';
import Stage1 from './screens/Stage1';
import Stage1Camera from './screens/Stage1Camera';
import Map from './screens/Map';
import Stage1_2 from './screens/Stage1_2';
import Stage2 from './screens/Stage2';
import Stage2_1 from './screens/Stage2_1';
import Stage2_2 from './screens/Stage2_2';
import Stage2_3 from './screens/Stage2_3';
import Stage2_4 from './screens/Stage2_4';
import Stage2_5 from './screens/Stage2_5';
import Stage2Camera from './screens/Stage2Camera';
import Stage2Camera_2 from './screens/Stage2Camera_2';
import Stage2_Hint from './screens/Stage2_Hint';
import Stage3 from './screens/Stage3';
import Stage3_1 from './screens/Stage3_1';
import Stage3_2 from './screens/Stage3_2';
import Stage3Camera from './screens/Stage3Camera';
import Stage4 from './screens/Stage4';
import Stage4_1 from './screens/Stage4_1';
import Stage4_2 from './screens/Stage4_2';
import Stage4Camera from './screens/Stage4Camera';
import Stage4_3 from './screens/Stage4_3';
import Stage4_4 from './screens/Stage4_4';
import Stage5 from './screens/Stage5';
import Stage5_1 from './screens/Stage5_1';
import Stage5_2 from './screens/Stage5_2';
import Stage5_3 from './screens/Stage5_3';
import Stage5_4 from './screens/Stage5_4';
import Guestbook from './screens/Guestbook';
import Stage5_5 from './screens/Stage5_5';
import Stage5_6 from './screens/Stage5_6';
import Stage5_7 from './screens/Stage5_7';
import Stage6_1 from './screens/Stage6_1';
import Stage6_2 from './screens/Stage6_2';
import Stage6_3 from './screens/Stage6_3';
import Stage7_1 from './screens/Stage7_1';
import Stage7_2 from './screens/Stage7_2';
import Stage7_3 from './screens/Stage7_3';
import Stage7_4 from './screens/Stage7_4';
import Stage7_5 from './screens/Stage7_5';
import Stage7_6 from './screens/Stage7_6';
import Stage7Camera from './screens/Stage7Camera';
import Stage7_7 from './screens/Stage7_7';
import Stage8_1 from './screens/Stage8_1';
import Stage8_2 from './screens/Stage8_2';
import Stage8_3 from './screens/Stage8_3';
import Stage8_4 from './screens/Stage8_4';
import Stage8_5 from './screens/Stage8_5';
import Stage8_6 from './screens/Stage8_6';
import Stage9_1 from './screens/Stage9_1';
import Stage9Camera from './screens/Stage9Camera';
import Stage9_2 from './screens/Stage9_2';
import Stage9_3 from './screens/Stage9_3';
import Stage9Camera_2 from './screens/Stage9Camera_2';
import Stage9_4 from './screens/Stage9_4';
import Stage10_1 from './screens/Stage10_1';
import Stage10_2 from './screens/Stage10_2';
import Stage10_3 from './screens/Stage10_3';
import Stage10Camera from './screens/Stage10Camera';
import Stage10_4 from './screens/Stage10_4';
import Stage10_5 from './screens/Stage10_5';
import Stage10_6 from './screens/Stage10_6';
import Stage10_7 from './screens/Stage10_7';
import Stage11_1 from './screens/Stage11_1';
import Stage11_2 from './screens/Stage11_2';
import Stage11_3 from './screens/Stage11_3';
import Stage11Run from './screens/Stage11Run';
import Stage11_4 from './screens/Stage11_4';
import Stage11_5 from './screens/Stage11_5';
import Stage11_6 from './screens/Stage11_6';
import Stage11Camera from './screens/Stage11Camera';
import Stage12_1 from './screens/Stage12_1';
import Stage12_2 from './screens/Stage12_2';
import Stage12Camera from './screens/Stage12Camera';
import Stage12_3 from './screens/Stage12_3';
import Stage12_4 from './screens/Stage12_4';
import Stage12_5 from './screens/Stage12_5';
import Stage12_5_1 from './screens/Stage12_5_1';
import Stage12Camera_2 from './screens/Stage12Camera_2';
import Stage12_6 from './screens/Stage12_6';
import Stage13_1 from './screens/Stage13_1';
import Stage13_2 from './screens/Stage13_2';
import Stage13_3 from './screens/Stage13_3';
import Stage13_4 from './screens/Stage13_4';
import Stage13_5 from './screens/Stage13_5';
import Stage13_6 from './screens/Stage13_6';
import Stage13_6_1 from './screens/Stage13_6_1';
import Stage13_7 from './screens/Stage13_7';
import Stage13_8 from './screens/Stage13_8';
import Stage13_9 from './screens/Stage13_9';
import Stage13_Sound from './screens/Stage13_Sound';
import StageFinal from './screens/StageFinal';

export type RootStackParamList = {
  LogIn: undefined;
  SignIn: undefined;
  Main: undefined;
  StageList: undefined;
  Stage1: undefined;
  Stage1Camera: undefined;
  Map: undefined;
  Stage1_2: undefined;
  Stage2: undefined;
  Stage2_1: undefined;
  Stage2_2: undefined;
  Stage2_3: undefined;
  Stage2_4: undefined;
  Stage2_5: undefined;
  Stage2Camera: undefined;
  Stage2Camera_2: undefined;
  Stage2_Hint: undefined;
  Stage3: undefined;
  Stage3_1: undefined;
  Stage3_2: undefined;
  Stage3Camera: undefined;
  Stage4: undefined;
  Stage4_1: undefined;
  Stage4_2: undefined;
  Stage4Camera: undefined;
  Stage4_3: undefined;
  Stage4_4: undefined;
  Stage5: undefined;
  Stage5_1: undefined;
  Stage5_2: undefined;
  Stage5_3: undefined;
  Stage5_4: undefined;
  Guestbook: undefined;
  Stage5_5: undefined;
  Stage5_6: undefined;
  Stage5_7: undefined;
  Stage6_1: undefined;
  Stage6_2: undefined;
  Stage6_3: undefined;
  Stage7_1: undefined;
  Stage7_2: undefined;
  Stage7_3: undefined;
  Stage7_4: undefined;
  Stage7_5: undefined;
  Stage7_6: undefined;
  Stage7Camera: undefined;
  Stage7_7: undefined;
  Stage8_1: undefined;
  Stage8_2: undefined;
  Stage8_3: undefined;
  Stage8_4: undefined;
  Stage8_5: undefined;
  Stage8_6: undefined;
  Stage9_1: undefined;
  Stage9Camera: undefined;
  Stage9_2: undefined;
  Stage9_3: undefined;
  Stage9Camera_2: undefined;
  Stage9_4: undefined;
  Stage10_1: undefined;
  Stage10_2: undefined;
  Stage10_3: undefined;
  Stage10Camera: undefined;
  Stage10_4: undefined;
  Stage10_5: undefined;
  Stage10_6: undefined;
  Stage10_7: undefined;
  Stage11_1: undefined;
  Stage11_2: undefined;
  Stage11_3: undefined;
  Stage11Run: undefined;
  Stage11_4: undefined;
  Stage11_5: undefined;
  Stage11_6: undefined;
  Stage11Camera: undefined;
  Stage12_1: undefined;
  Stage12_2: undefined;
  Stage12Camera: undefined;
  Stage12_3: undefined;
  Stage12_4: undefined;
  Stage12_5: undefined;
  Stage12_5_1: undefined;
  Stage12Camera_2: undefined;
  Stage12_6: undefined;
  Stage13_1: undefined;
  Stage13_2: undefined;
  Stage13_3: undefined;
  Stage13_4: undefined;
  Stage13_5: undefined;
  Stage13_6: undefined;
  Stage13_6_1: undefined;
  Stage13_7: undefined;
  Stage13_8: undefined;
  Stage13_9: undefined;
  Stage13_Sound: undefined;
  StageFinal: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Stage13_5">
        <Stack.Screen
          name="Main"
          component={Main}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="LogIn"
          component={LogIn}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SignIn"
          component={SignIn}
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
        <Stack.Screen
          name="Stage1_2"
          component={Stage1_2}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Stage2"
          component={Stage2}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Stage2_1"
          component={Stage2_1}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Stage2_2"
          component={Stage2_2}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Stage2Camera"
          component={Stage2Camera}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Stage2_3"
          component={Stage2_3}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Stage2_4"
          component={Stage2_4}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Stage2_5"
          component={Stage2_5}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Stage2Camera_2"
          component={Stage2Camera_2}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Stage2_Hint"
          component={Stage2_Hint}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Stage3"
          component={Stage3}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Stage3_1"
          component={Stage3_1}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Stage3_2"
          component={Stage3_2}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Stage3Camera"
          component={Stage3Camera}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Stage4"
          component={Stage4}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Stage4_1"
          component={Stage4_1}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Stage4_2"
          component={Stage4_2}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Stage4Camera"
          component={Stage4Camera}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Stage4_3"
          component={Stage4_3}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Stage4_4"
          component={Stage4_4}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Stage5"
          component={Stage5}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Stage5_1"
          component={Stage5_1}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Stage5_2"
          component={Stage5_2}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Stage5_3"
          component={Stage5_3}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Stage5_4"
          component={Stage5_4}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Guestbook"
          component={Guestbook}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Stage5_5"
          component={Stage5_5}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Stage5_6"
          component={Stage5_6}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Stage5_7"
          component={Stage5_7}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Stage6_1"
          component={Stage6_1}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Stage6_2"
          component={Stage6_2}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Stage6_3"
          component={Stage6_3}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Stage7_1"
          component={Stage7_1}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Stage7_2"
          component={Stage7_2}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Stage7_3"
          component={Stage7_3}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Stage7_4"
          component={Stage7_4}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Stage7_5"
          component={Stage7_5}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Stage7_6"
          component={Stage7_6}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Stage7Camera"
          component={Stage7Camera}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Stage7_7"
          component={Stage7_7}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Stage8_1"
          component={Stage8_1}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Stage8_2"
          component={Stage8_2}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Stage8_3"
          component={Stage8_3}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Stage8_4"
          component={Stage8_4}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Stage8_5"
          component={Stage8_5}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Stage8_6"
          component={Stage8_6}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Stage9_1"
          component={Stage9_1}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Stage9Camera"
          component={Stage9Camera}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Stage9_2"
          component={Stage9_2}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Stage9_3"
          component={Stage9_3}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Stage9Camera_2"
          component={Stage9Camera_2}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Stage9_4"
          component={Stage9_4}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Stage10_1"
          component={Stage10_1}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Stage10_2"
          component={Stage10_2}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Stage10_3"
          component={Stage10_3}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Stage10Camera"
          component={Stage10Camera}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Stage10_4"
          component={Stage10_4}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Stage10_5"
          component={Stage10_5}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Stage10_6"
          component={Stage10_6}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Stage10_7"
          component={Stage10_7}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Stage11_1"
          component={Stage11_1}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Stage11_2"
          component={Stage11_2}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Stage11_3"
          component={Stage11_3}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Stage11Run"
          component={Stage11Run}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Stage11_4"
          component={Stage11_4}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Stage11_5"
          component={Stage11_5}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Stage11_6"
          component={Stage11_6}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Stage11Camera"
          component={Stage11Camera}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Stage12_1"
          component={Stage12_1}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Stage12_2"
          component={Stage12_2}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Stage12Camera"
          component={Stage12Camera}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Stage12_3"
          component={Stage12_3}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Stage12_4"
          component={Stage12_4}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Stage12_5"
          component={Stage12_5}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Stage12_5_1"
          component={Stage12_5_1}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Stage12Camera_2"
          component={Stage12Camera_2}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Stage12_6"
          component={Stage12_6}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Stage13_1"
          component={Stage13_1}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Stage13_2"
          component={Stage13_2}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Stage13_3"
          component={Stage13_3}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Stage13_4"
          component={Stage13_4}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Stage13_5"
          component={Stage13_5}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Stage13_6"
          component={Stage13_6}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Stage13_6_1"
          component={Stage13_6_1}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Stage13_7"
          component={Stage13_7}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Stage13_8"
          component={Stage13_8}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Stage13_9"
          component={Stage13_9}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Stage13_Sound"
          component={Stage13_Sound}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="StageFinal"
          component={StageFinal}
          options={{ headerShown: false }}
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
