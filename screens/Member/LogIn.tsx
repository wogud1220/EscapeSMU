import React, {useState} from 'react';
import {View, TextInput, Button, Text, StyleSheet} from 'react-native';
import {auth} from '../firebase.config';
import {onAuthStateChanged, signInWithEmailAndPassword} from 'firebase/auth';
import {useNavigation} from '@react-navigation/native';
import CustomText from '../../CustomText';

const LogIn = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );

      console.log('✅ 로그인 성공!', userCredential.user.email);

      // ✅ 로그인 후 auth 상태 변경을 감지하여 Main으로 이동
      onAuthStateChanged(auth, user => {
        if (user) {
          console.log('📢 Firebase에서 로그인 상태 업데이트됨:', user.email);
          navigation.reset({
            index: 0,
            routes: [{name: 'Main'}],
          }); // ✅ 화면을 완전히 재설정하여 이동
        }
      });
    } catch (error) {
      console.error('🚨 로그인 오류:', error);

      if (error instanceof Error) {
        switch (error.code) {
          case 'auth/user-not-found':
            setErrorMessage('사용자를 찾을 수 없습니다.');
            break;
          case 'auth/wrong-password':
            setErrorMessage('비밀번호가 틀렸습니다.');
            break;
          case 'auth/too-many-requests':
            setErrorMessage(
              '로그인 시도가 너무 많습니다. 나중에 다시 시도하세요.',
            );
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
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor={'#999'}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        placeholderTextColor={'#999'}
        secureTextEntry
        style={styles.input}
      />
      <Button title="로그인" onPress={handleLogin} />
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
    fontFamily: 'BMHANNAPro',
    width: '80%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    borderRadius: 5,
  },
  errorText: {
    fontFamily: 'BMHANNAPro',
    color: 'red',
    marginTop: 10,
  },
});

export default LogIn;
