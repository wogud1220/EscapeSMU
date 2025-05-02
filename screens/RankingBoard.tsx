import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  SectionList,
} from 'react-native';
import {collection, getDocs, DocumentData} from 'firebase/firestore';
import {onAuthStateChanged} from 'firebase/auth';
import {db, auth} from './firebase.config';
import {Picker} from '@react-native-picker/picker';
import CustomText from '../CustomText';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../App';
import { TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from 'react-native-reanimated';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);


type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;


interface RankItem {
  uid: string;
  emailPrefix: string;
  score: number;
  rank?: number;
}

interface SectionData {
  title: string;
  data: RankItem[];
}

const colleges = [
  '글로벌인문학부대학',
  '공과대학',
  '디자인학부',
  '융합기술대학',
  '예술학부',];


const RankingBoard = () => {
  const [selectedCollege, setSelectedCollege] = useState('디자인학부');
  const [rankData, setRankData] = useState<SectionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [myUid, setMyUid] = useState('');
  const [myRank, setMyRank] = useState<RankItem | null>(null);
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) setMyUid(user.uid);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'users'));
        const all: RankItem[] = snapshot.docs.map(doc => {
          const data = doc.data() as DocumentData;
          const email = data.email ?? 'user@unknown';
          return {
            uid: doc.id,
            emailPrefix: email.split('@')[0].slice(0, 4),
            score: data.stageCnt?.[`${selectedCollege}Cnt`] ?? 0,
          };
        });

        const sorted: RankItem[] = [];
        let currentRank = 1;
        let prevScore: number | null = null;
        let offset = 0;

        all
          .filter(u => u.score > 0)
          .sort((a, b) => a.score - b.score)
          .forEach((user, index) => {
            if (prevScore !== null && user.score === prevScore) {
              offset++;
            } else {
              currentRank = index + 1;
              offset = 0;
            }
            sorted.push({...user, rank: currentRank});
            prevScore = user.score;
          });

        setRankData([{title: selectedCollege, data: sorted.slice(0, 10)}]);

        const me = sorted.find(u => u.uid === myUid);
        setMyRank(me || null);
        setLoading(false);
      } catch (e) {
        console.error('🔥 Error loading rank data:', e);
      }
    };

    fetchUsers();
  }, [selectedCollege, myUid]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{flex: 1}}>
      <Picker
        selectedValue={selectedCollege}
        onValueChange={itemValue => setSelectedCollege(itemValue)}>
        {colleges.map(col => (
          <Picker.Item label={col} value={col} key={col} />
        ))}
      </Picker>

      {myRank && (
        <View style={styles.myBox}>
          <CustomText style={styles.sectionTitle}>✨ 나의 순위</CustomText>
          <CustomText style={styles.myText}>
            {myRank.rank}위 - {myRank.emailPrefix} ({myRank.score}회 시도)
          </CustomText>
        </View>
      )}

      <SectionList
        sections={rankData}
        keyExtractor={item => item.uid}
        renderSectionHeader={({section: {title}}) => (
          <CustomText style={styles.sectionTitle}>{title} 랭킹 TOP 10</CustomText>
        )}
        renderItem={({item}) => (
          <View style={styles.row}>
            <CustomText style={styles.rank}>
              {item.rank === 1
                ? '🥇'
                : item.rank === 2
                ? '🥈'
                : item.rank === 3
                ? '🥉'
                : `${item.rank}위`}
            </CustomText>
            <CustomText style={styles.name}>{item.emailPrefix}</CustomText>
            <CustomText style={styles.score}>{item.score} 회</CustomText>
          </View>
        )}
        contentContainerStyle={{padding: 20}}
      />
      <TouchableOpacity
  style={styles.homeButton}
  onPress={() => navigation.navigate('Main')}>
  <CustomText style={styles.homeButtonText}>🏠 홈으로 돌아가기</CustomText>
</TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  loader: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  sectionTitle: {
    fontSize: 20,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  rank: {width: 40},
  name: {flex: 1},
  score: {width: 60, textAlign: 'right'},
  myBox: {
    backgroundColor: '#e0f7fa',
    padding: 10,
    borderRadius: 8,
    margin: 10,
  },
  myText: {
    fontSize: 16,
    textAlign: 'center',
  },
  homeButton: {
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 100,
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  homeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  
});

export default RankingBoard;
