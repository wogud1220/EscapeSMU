import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StageList = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Stage 목록 페이지입니다.</Text>
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
  },
});

export default StageList;
