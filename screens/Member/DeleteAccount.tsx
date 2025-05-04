import React from 'react';
import {View, Text, Alert, StyleSheet, TouchableOpacity} from 'react-native';
import {auth, db} from '../firebase.config';
import {deleteUser} from 'firebase/auth';
import {doc, deleteDoc} from 'firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import CustomText from '../../CustomText';

const DeleteAccount = () => {
  const navigation = useNavigation();

  const handleDeleteAccount = async () => {
    Alert.alert('⚠️ 계정 삭제', '정말로 계정을 삭제하시겠습니까?', [
      {text: '취소', style: 'cancel'},
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          try {
            const user = auth.currentUser;
            if (user) {
              await deleteDoc(doc(db, 'users', user.uid));
              await deleteUser(user);
              Alert.alert('✅ 완료', '계정이 삭제되었습니다.');
              navigation.reset({index: 0, routes: [{name: 'Main'}]});
            }
          } catch (err) {
            console.error('🚨 계정 삭제 실패:', err);
            Alert.alert(
              '삭제 실패',
              '최근 로그인 후 다시 시도해 주세요. (재로그인 필요할 수 있음)',
            );
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <CustomText style={styles.title}>계정 삭제</CustomText>
      <TouchableOpacity
        onPress={handleDeleteAccount}
        style={styles.deleteButton}>
        <CustomText style={styles.buttonText}>계정 삭제하기</CustomText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    marginBottom: 30,
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default DeleteAccount;
