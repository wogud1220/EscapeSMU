import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const Guestbook = () => {
  const navigation = useNavigation(); // ✅ 뒤로가기 네비게이션
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [guestbookEntries, setGuestbookEntries] = useState([]);

  useEffect(() => {
    loadEntries();
  }, []);

  // ✅ 방명록 데이터 불러오기
  const loadEntries = async () => {
    try {
      const savedEntries = await AsyncStorage.getItem('guestbook');
      if (savedEntries) {
        setGuestbookEntries(JSON.parse(savedEntries));
      }
    } catch (error) {
      console.error('방명록 불러오기 오류:', error);
    }
  };

  // ✅ 방명록 작성
  const addEntry = async () => {
    if (!name || !message) {
      Alert.alert('입력 오류', '이름과 메시지를 모두 입력해 주세요.');
      return;
    }

    const newEntry = {
      id: Date.now().toString(),
      name,
      message,
      createdAt: new Date().toLocaleString(),
    };

    const updatedEntries = [newEntry, ...guestbookEntries];
    setGuestbookEntries(updatedEntries);
    await AsyncStorage.setItem('guestbook', JSON.stringify(updatedEntries));

    setName('');
    setMessage('');
  };

  // ✅ 방명록 삭제
  const deleteEntry = async (id) => {
    const updatedEntries = guestbookEntries.filter((entry) => entry.id !== id);
    setGuestbookEntries(updatedEntries);
    await AsyncStorage.setItem('guestbook', JSON.stringify(updatedEntries));
  };

  // ✅ 뒤로가기
  const handleGoBack = () => {
    navigation.goBack(); // 뒤로가기 처리
  };

  return (
    <View style={styles.container}>
      {/* ✅ 입력 필드 */}
      <TextInput
        style={styles.input}
        placeholder="이름"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={[styles.input, styles.messageInput]}
        placeholder="메시지"
        value={message}
        onChangeText={setMessage}
        multiline
      />

      {/* ✅ 버튼 수평 배치 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.goBackButton} onPress={handleGoBack}>
          <Text style={styles.goBackButtonText}>뒤로가기</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitButton} onPress={addEntry}>
          <Text style={styles.submitButtonText}>방명록 작성</Text>
        </TouchableOpacity>
      </View>

      {/* ✅ 방명록 리스트 */}
      <FlatList
        data={guestbookEntries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.entry}>
            <Text style={styles.entryName}>{item.name}</Text>
            <Text style={styles.entryMessage}>{item.message}</Text>
            <Text style={styles.entryDate}>{item.createdAt}</Text>
            <TouchableOpacity onPress={() => deleteEntry(item.id)}>
              <Text style={styles.deleteButton}>삭제</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5E6C4',
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#FFF',
  },
  messageInput: {
    height: 100,
  },
  buttonContainer: {
    flexDirection: 'row', // ✅ 수평 정렬
    justifyContent: 'space-between', // ✅ 버튼 간격 조정
    alignItems: 'center',
    marginBottom: 15,
  },
  goBackButton: {
    backgroundColor: '#FF6347', // ✅ 빨간색 버튼
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    alignItems: 'center',
    width: '45%', // ✅ 버튼 크기 고정
  },
  goBackButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#1E90FF', // ✅ 파란색 버튼
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    alignItems: 'center',
    width: '45%', // ✅ 버튼 크기 고정
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  entry: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 10,
  },
  entryName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  entryMessage: {
    fontSize: 14,
  },
  entryDate: {
    fontSize: 12,
    color: '#999',
  },
  deleteButton: {
    color: 'red',
    marginTop: 5,
  },
});

export default Guestbook;
