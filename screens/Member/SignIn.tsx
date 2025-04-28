import React, {useState} from 'react';
import {View, TextInput, Button, Text, Alert, StyleSheet} from 'react-native';
import {auth, db} from '../firebase.config';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth';
import {doc, setDoc} from 'firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';
import CustomText from '../../CustomText';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;
const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigation = useNavigation<NavigationProp>();

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
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        college: '',
        department: '',
        stageCnt: {},
      });

      console.log('✅ 회원가입 성공!', user.email);

      navigation.reset({
        index: 0,
        routes: [{name: 'Main'}],
      });
    } catch (error: any) {
      console.error('🚨 회원가입 오류:', error);
      if (error.code === 'auth/email-already-in-use') {
        setErrorMessage('이미 가입된 이메일입니다.');
      } else if (error.code === 'auth/weak-password') {
        setErrorMessage('비밀번호는 최소 6자 이상이어야 합니다.');
      } else if (error.code === 'auth/invalid-email') {
        setErrorMessage('유효한 이메일 주소를 입력하세요.');
      } else {
        setErrorMessage(error.message || '알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="@를 포함한 이메일 형식으로 적어주세요"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor={'#999'}
        style={styles.input}
      />
      <TextInput
        placeholder="6자리 이상 비밀번호를 사용해주세요"
        value={password}
        onChangeText={setPassword}
        placeholderTextColor={'#999'}
        secureTextEntry
        style={styles.input}
      />
      <TextInput
        placeholder="비밀번호 확인"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholderTextColor={'#999'}
        secureTextEntry
        style={styles.input}
      />
      <Button title="Sign Up" onPress={handleSignUp} />
      {errorMessage ? (
        <CustomText style={styles.errorText}>{errorMessage}</CustomText>
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
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    fontFamily: 'BMHANNAPro',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});

export default SignIn;
