import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Main from './screens/Main';
import StageList from './screens/StageList';

export type RootStackParamList = {
  Main: undefined;
  StageList: undefined;
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
          options={{ title: 'Stage 목록' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
