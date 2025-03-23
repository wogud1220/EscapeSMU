import React, {useState} from 'react';
import {View, TextInput, Button, Text, Alert, StyleSheet} from 'react-native';
import {auth} from '../firebase.config';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  //   const handleSignUp = async () => {
  //     if (password !== confirmPassword) {
  //       Alert.alert('오류', '비밀번호가 일치하지 않습니다.');
  //       return;
  //     }

  //     try {
  //       await createUserWithEmailAndPassword(auth, email, password);
  //       Alert.alert('회원가입 성공!', '이메일로 로그인하세요.');
  //     } catch (error) {
  //       console.error('🚨 회원가입 오류:', error);
  //       if (error instanceof Error) {
  //         setErrorMessage(error.message);
  //       } else {
  //         setErrorMessage('알 수 없는 오류가 발생했습니다.');
  //       }
  //     }
  //   };

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      Alert.alert('오류', '비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      console.log('✅ 회원가입 성공!', userCredential.user.email);
      Alert.alert('회원가입 성공!', '이메일로 로그인하세요.');

      // ✅ Firebase 인증 상태 업데이트를 기다린 후 로그인 화면으로 이동
      onAuthStateChanged(auth, user => {
        if (user) {
          console.log('📢 Firebase에서 회원가입 상태 업데이트됨:', user.email);
          navigation.reset({
            index: 0,
            routes: [{name: 'LogIn'}],
          }); // ✅ 로그인 화면으로 이동
        }
      });
    } catch (error) {
      console.error('🚨 회원가입 오류:', error);

      if (error instanceof Error) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            setErrorMessage('이미 가입된 이메일입니다.');
            break;
          case 'auth/weak-password':
            setErrorMessage('비밀번호는 최소 6자 이상이어야 합니다.');
            break;
          case 'auth/invalid-email':
            setErrorMessage('유효한 이메일 주소를 입력하세요.');
            break;
          default:
            setErrorMessage(error.message);
        }
      } else {
        setErrorMessage('알 수 없는 오류가 발생했습니다.');
      }
    }
  };
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="@를 포함한 이메일 형식으로 적어주세요"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="6자리 이상 비밀번호를 사용해주세요"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <TextInput
        placeholder="비밀번호 확인"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title="Sign Up" onPress={handleSignUp} />
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});

export default SignIn;
