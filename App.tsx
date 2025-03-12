import React, {useEffect} from 'react';
import {View, Text} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

// 📌 네비게이션 스택 생성
const Stack = createStackNavigator();

// 📌 홈 화면 컴포넌트
const HomeScreen = () => (
  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <Text>홈 화면</Text>
  </View>
);

// 📌 `App.tsx` 메인 컴포넌트
const App = () => {
  useEffect(() => {
    // 🚀 앱 실행 후 스플래시 화면 숨기기
    SplashScreen.hide();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
