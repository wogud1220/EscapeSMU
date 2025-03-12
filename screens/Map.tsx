// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';

// const Map = () => {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>Map 화면입니다.</Text>
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
//   },
// });

// export default Map;

import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {Platform} from 'react-native';

const Map = () => {
  const [locationPermission, setLocationPermission] = useState<string | null>(
    null,
  );

  const requestLocationPermission = async () => {
    const permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

    const result = await request(permission);

    if (result === RESULTS.GRANTED) {
      setLocationPermission('권한 허용됨 ✅');
      Alert.alert('위치 권한 허용됨', '이제 지도를 사용할 수 있습니다!');
    } else if (result === RESULTS.DENIED) {
      setLocationPermission('권한 요청됨 ⏳');
      Alert.alert(
        '위치 권한 필요',
        '위치 기능을 사용하려면 권한을 허용해주세요.',
      );
    } else if (result === RESULTS.BLOCKED) {
      setLocationPermission('권한 거부됨 ❌');
      Alert.alert('위치 권한 차단됨', '설정에서 직접 권한을 허용해주세요.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Map 화면입니다.</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={requestLocationPermission}>
        <Text style={styles.buttonText}>📍 위치 권한 요청</Text>
      </TouchableOpacity>

      {locationPermission && (
        <Text style={styles.permissionText}>{locationPermission}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5E6C4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    color: '#333',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
  },
  permissionText: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
  },
});

export default Map;
