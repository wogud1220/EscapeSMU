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
import Stage3_1 from './screens/Stage3_1';
import Stage3Camera from './screens/Stage3Camera';
import Stage4 from './screens/Stage4';
import Stage4_1 from './screens/Stage4_1';
import Stage4_2 from './screens/Stage4_2';
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
  Stage3_1: undefined;
  Stage3_2: undefined;
  Stage3Camera: undefined;
  Stage4: undefined;
  Stage4_1: undefined;
  Stage4_2: undefined;
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
};

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Stage5_4">
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
        <Stack.Screen
          name="Stage3_1"
          component={Stage3_1}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Stage3Camera"
          component={Stage3Camera}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Stage4"
          component={Stage4}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Stage4_1"
          component={Stage4_1}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Stage4_2"
          component={Stage4_2}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Stage4_3"
          component={Stage4_3}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Stage4_4"
          component={Stage4_4}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Stage5"
          component={Stage5}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Stage5_1"
          component={Stage5_1}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Stage5_2"
          component={Stage5_2}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Stage5_3"
          component={Stage5_3}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Stage5_4"
          component={Stage5_4}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Guestbook"
          component={Guestbook}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Stage5_5"
          component={Stage5_5}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Stage5_6"
          component={Stage5_6}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Stage5_7"
          component={Stage5_7}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Stage6_1"
          component={Stage6_1}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
