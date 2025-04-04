import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import {onAuthStateChanged} from 'firebase/auth';
import {auth, db} from './firebase.config';
import {formatDistanceToNow} from 'date-fns';
import {ko} from 'date-fns/locale';
import {useRoute} from '@react-navigation/native';
import {useDepartment} from './Member/DepartmentContext';
import {useNavigation} from '@react-navigation/native';
interface GuestMessage {
  id: string;
  message: string;
  department: string;
  uid: string;
  timestamp: any;
  emailPrefix?: string;
}

const Guestbook = () => {
  const {college, department} = useDepartment();
  const navigation = useNavigation();
  const route = useRoute();
  const selectedDepartment =
    (route.params as {department?: string})?.department || '';

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<GuestMessage[]>([]);
  const [uid, setUid] = useState<string>('');
  const [emailPrefix, setEmailPrefix] = useState<string>('');

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, user => {
      if (user) {
        setUid(user.uid);
        const prefix = user.email?.split('@')[0].slice(0, 4) || 'user';
        setEmailPrefix(prefix);
      }
    });

    const q = query(collection(db, 'guestbook'), orderBy('timestamp', 'desc'));
    const unsubscribeFirestore = onSnapshot(q, snapshot => {
      const fetchedMessages: GuestMessage[] = snapshot.docs.map(doc => {
        const data = doc.data();
        const emailPrefixField = data.email
          ? data.email.split('@')[0].slice(0, 4)
          : 'user';
        return {
          id: doc.id,
          message: data.message,
          department: data.department,
          uid: data.uid,
          timestamp: data.timestamp,
          emailPrefix: emailPrefixField,
        };
      });
      setMessages(fetchedMessages);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeFirestore();
    };
  }, []);

  const handleSubmit = async () => {
    if (!message.trim()) {
      Alert.alert('입력 오류', '메시지를 입력해주세요.');
      return;
    }

    try {
      const user = auth.currentUser;
      const email = user?.email || '';
      await addDoc(collection(db, 'guestbook'), {
        message,
        department: selectedDepartment,
        uid,
        email,
        timestamp: serverTimestamp(),
      });
      setMessage('');
    } catch (error) {
      console.error('🚨 메시지 저장 오류:', error);
      Alert.alert('오류', '메시지를 저장하는 중 오류가 발생했습니다.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'guestbook', id));
    } catch (error) {
      console.error('❌ 삭제 오류:', error);
      Alert.alert('삭제 실패', '메시지 삭제 중 오류가 발생했습니다.');
    }
  };

  const renderItem = ({item}: {item: GuestMessage}) => {
    const timeAgo = item.timestamp?.toDate
      ? formatDistanceToNow(item.timestamp.toDate(), {
          addSuffix: true,
          locale: ko,
        })
      : '시간 정보 없음';

    return (
      <View style={styles.messageBox}>
        <Text style={styles.message}>{item.message}</Text>
        <Text style={styles.author}>작성자: {item.emailPrefix}</Text>
        <Text>
          부서: {college}-{department}
        </Text>
        <Text style={styles.time}>{timeAgo}</Text>
        {item.uid === uid && (
          <TouchableOpacity
            onPress={() => handleDelete(item.id)}
            style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>삭제</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <FlatList
        ListHeaderComponent={
          <>
            <Text style={styles.title}>📖 방명록</Text>
            {selectedDepartment !== '' && (
              <Text style={styles.departmentLabel}>
                📌 {selectedDepartment}
              </Text>
            )}
            <View style={styles.cardBox}>
              <TextInput
                value={message}
                onChangeText={setMessage}
                placeholder="메시지를 입력하세요"
                placeholderTextColor="#000"
                style={styles.input}
              />
              <Button title="방명록 남기기" onPress={handleSubmit} />
            </View>
          </>
        }
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingBottom: 100,
          paddingTop: 100,
          paddingHorizontal: 20,
        }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>아직 메시지가 없습니다.</Text>
        }
      />

      {/* ✅ 다음 스테이지 이동 버튼 */}
      <View style={{paddingHorizontal: 20, marginTop: 12}}>
        <Button
          title="다음 스테이지로 이동"
          onPress={() => {
            if (college === '글로벌인문학부대학') {
              navigation.navigate('Stage7_1');
            } else {
              navigation.navigate('StageFinal');
            }
          }}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  message: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 12,
  },
  departmentLabel: {
    fontSize: 16,
    color: '#444',
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: '600',
  },
  cardBox: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  messageBox: {
    marginBottom: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 5,
    position: 'relative',
  },
  author: {
    marginTop: 4,
  },
  time: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  deleteButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#ff4d4d',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyText: {
    marginTop: 20,
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});

export default Guestbook;
