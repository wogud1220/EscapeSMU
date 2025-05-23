// import React from 'react';
// import {View, Text, Alert, StyleSheet, TouchableOpacity} from 'react-native';
// import {auth, db} from '../firebase.config';
// import {
//   deleteUser,
//   EmailAuthProvider,
//   reauthenticateWithCredential,
// } from 'firebase/auth';
// import {doc, deleteDoc} from 'firebase/firestore';
// import {useNavigation} from '@react-navigation/native';
// import CustomText from '../../CustomText';

// const DeleteAccount = () => {
//   const navigation = useNavigation();

//   //   const handleDeleteAccount = async () => {
//   //     Alert.alert('⚠️ 계정 삭제', '정말로 계정을 삭제하시겠습니까?', [
//   //       {text: '취소', style: 'cancel'},
//   //       {
//   //         text: '삭제',
//   //         style: 'destructive',
//   //         onPress: async () => {
//   //           try {
//   //             const user = auth.currentUser;
//   //             if (user) {
//   //               await deleteDoc(doc(db, 'users', user.uid));
//   //               await deleteUser(user);
//   //               Alert.alert('✅ 완료', '계정이 삭제되었습니다.');
//   //               navigation.reset({index: 0, routes: [{name: 'Main'}]});
//   //             }
//   //           } catch (err) {
//   //             console.error('🚨 계정 삭제 실패:', err);
//   //             Alert.alert(
//   //               '삭제 실패',
//   //               '최근 로그인 후 다시 시도해 주세요. (재로그인 필요할 수 있음)',
//   //             );
//   //           }
//   //         },
//   //       },
//   //     ]);
//   //   };

//   //   return (
//   //     <View style={styles.container}>
//   //       <CustomText style={styles.title}>계정 삭제</CustomText>
//   //       <TouchableOpacity
//   //         onPress={handleDeleteAccount}
//   //         style={styles.deleteButton}>
//   //         <CustomText style={styles.buttonText}>계정 삭제하기</CustomText>
//   //       </TouchableOpacity>
//   //     </View>
//   //   );
//   // };

//   const handleDeleteAccount = async () => {
//     Alert.alert('⚠️ 계정 삭제', '정말로 계정을 삭제하시겠습니까?', [
//       {text: '취소', style: 'cancel'},
//       {
//         text: '삭제',
//         style: 'destructive',
//         onPress: async () => {
//           try {
//             const user = auth.currentUser;
//             if (
//               user &&
//               user.email &&
//               user.providerData[0]?.providerId === 'password'
//             ) {
//               // 사용자가 직접 입력한 비밀번호를 받는다
//               const password = '사용자_입력_비밀번호'; // ← 이건 사용자에게 입력받아야 함 (예: Alert.prompt)

//               const credential = EmailAuthProvider.credential(
//                 user.email,
//                 password,
//               );
//               await reauthenticateWithCredential(user, credential);
//             }

//             if (user) {
//               await deleteDoc(doc(db, 'users', user.uid));
//               await deleteUser(user);
//               Alert.alert('✅ 완료', '계정이 삭제되었습니다.');
//               navigation.reset({index: 0, routes: [{name: 'Main'}]});
//             }
//           } catch (err) {
//             console.error('🚨 계정 삭제 실패:', err);
//             Alert.alert('삭제 실패', '비밀번호 확인 후 다시 시도해주세요.');
//           }
//         },
//       },
//     ]);
//   };

//   const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       alignItems: 'center',
//       justifyContent: 'center',
//       backgroundColor: '#fff',
//     },
//     title: {
//       fontSize: 22,
//       marginBottom: 30,
//     },
//     deleteButton: {
//       backgroundColor: '#ff4444',
//       paddingVertical: 15,
//       paddingHorizontal: 30,
//       borderRadius: 10,
//     },
//     buttonText: {
//       color: 'white',
//       fontSize: 18,
//     },
//   });
//   return (
//     <View style={styles.container}>
//       <CustomText style={styles.title}>계정 삭제</CustomText>
//       <TouchableOpacity
//         onPress={handleDeleteAccount}
//         style={styles.deleteButton}>
//         <CustomText style={styles.buttonText}>계정 삭제하기</CustomText>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default DeleteAccount;

import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import {auth, db} from '../firebase.config';
import {
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth';
import {doc, deleteDoc} from 'firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import CustomText from '../../CustomText';

const DeleteAccount = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [password, setPassword] = useState('');

  const handleReauthenticationAndDelete = async () => {
    try {
      const user = auth.currentUser;

      if (user && user.email) {
        const credential = EmailAuthProvider.credential(user.email, password);
        await reauthenticateWithCredential(user, credential);
        await deleteDoc(doc(db, 'users', user.uid));
        await deleteUser(user);
        Alert.alert('✅ 완료', '계정이 삭제되었습니다.');
        setModalVisible(false);
        navigation.reset({index: 0, routes: [{name: 'Main'}]});
      }
    } catch (err) {
      console.error('🚨 계정 삭제 실패:', err);
      Alert.alert('삭제 실패', '비밀번호가 틀리거나 재인증에 실패했습니다.');
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert('⚠️ 계정 삭제', '정말로 계정을 삭제하시겠습니까?', [
      {text: '취소', style: 'cancel'},
      {
        text: '삭제',
        style: 'destructive',
        onPress: () => {
          setPassword('');
          setModalVisible(true); // 모달 열기
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

      {/* 🔒 비밀번호 입력 모달 */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <CustomText style={styles.modalTitle}>비밀번호 입력</CustomText>
            <TextInput
              secureTextEntry
              style={styles.input}
              placeholder="비밀번호"
              value={password}
              onChangeText={setPassword}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, {backgroundColor: '#ccc'}]}
                onPress={() => setModalVisible(false)}>
                <CustomText>취소</CustomText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, {backgroundColor: '#ff4444'}]}
                onPress={handleReauthenticationAndDelete}>
                <CustomText style={{color: 'white'}}>삭제</CustomText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default DeleteAccount;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 12,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
});
