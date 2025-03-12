import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Main from './screens/Main';
import StageList from './screens/StageList';
import Stage1 from './screens/Stage1';
import Stage1Camera from './screens/Stage1Camera';
import Map from './screens/Map';
import Stage1_2 from './screens/Stage1_2';
import Stage2 from './screens/Stage2';
import Stage2_1 from './screens/Stage2_1';
import Stage3 from './screens/Stage3';

export type RootStackParamList = {
  Main: undefined;
  StageList: undefined;
  Stage1: undefined;
  Stage1Camera: undefined;
  Map: undefined;
  Stage1_2: undefined;
  Stage2: undefined;
  Stage2_1: undefined;
  Stage2_2: undefined;
  Stage3: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main">
        <Stack.Screen 
          name="Main" 
          component={Main} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="StageList" 
          component={StageList} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Stage1" 
          component={Stage1} 
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Stage1Camera"
          component={Stage1Camera}
          options={{ headerShown: false}} />
        <Stack.Screen 
          name="Map" 
          component={Map} 
          options={{ headerShown: false }}
        />
        {/* ✅ Stage1_2 추가 */}
        <Stack.Screen
          name="Stage1_2"
          component={Stage1_2}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Stage2"
          component={Stage2}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Stage2_1"
          component={Stage2_1}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Stage3"
          component={Stage3}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
