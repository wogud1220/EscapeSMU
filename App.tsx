import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
