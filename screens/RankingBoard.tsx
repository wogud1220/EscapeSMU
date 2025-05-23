import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  SectionList,
  TouchableOpacity,
} from 'react-native';
import {collection, getDocs} from 'firebase/firestore';
import {onAuthStateChanged} from 'firebase/auth';
import {db, auth} from './firebase.config';
import CustomText from '../CustomText';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../App';
import DropDownPicker from 'react-native-dropdown-picker';

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

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

const rawColleges = [
  '글로벌인문학부대학',
  '공과대학',
  '디자인학부',
  '융합기술대학',
  '예술학부',
  '체육대학',
  '전체',
];

const RankingBoard = () => {
  const [selectedCollege, setSelectedCollege] = useState('디자인학부');
  const [rankData, setRankData] = useState<SectionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [myUid, setMyUid] = useState('');
  const [myRank, setMyRank] = useState<RankItem | null>(null);
  const [hasData, setHasData] = useState(true);
  const navigation = useNavigation<NavigationProp>();

  // DropDownPicker 관련 상태
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('디자인학부');
  const [items, setItems] = useState(
    [...new Set(rawColleges)].map(col => ({
      label: col === '전체' ? '전체 루트' : col,
      value: col,
    })),
  );

  // DropDown 값이 바뀌면 selectedCollege 업데이트
  useEffect(() => {
    setSelectedCollege(value);
  }, [value]);

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
        const all: RankItem[] = [];

        snapshot.docs.forEach(doc => {
          const data = doc.data();
          const email = data.email ?? 'user@unknown';
          const userStageCleared = data.stageCleared || {};

          const isClearedFinal =
            selectedCollege === '전체'
              ? userStageCleared?.['전체'] === 'StageFinal'
              : userStageCleared?.[selectedCollege] === 'StageFinal';

          if (isClearedFinal && data.stageCnt?.[`${selectedCollege}Cnt`] > 0) {
            all.push({
              uid: doc.id,
              emailPrefix: email.split('@')[0].slice(0, 4),
              score: data.stageCnt?.[`${selectedCollege}Cnt`] ?? 0,
            });
          }
        });

        const sorted: RankItem[] = [];
        let currentRank = 1;
        let prevScore: number | null = null;
        let offset = 0;

        all
          .sort((a, b) => b.score - a.score)
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

        setHasData(sorted.length > 0);
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
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        placeholder="단과 선택"
        style={{
          width: 220,
          alignSelf: 'center',
          marginTop: 80,
        }}
        textStyle={{
          fontSize: 16,
          fontFamily: 'BMHANNAPro',
          textAlign: 'center',
        }}
        dropDownContainerStyle={{
          width: 220,
          alignSelf: 'center',
        }}
        listMode="SCROLLVIEW"
        scrollViewProps={{
          nestedScrollEnabled: true,
        }}
        maxHeight={400}
        zIndex={1000}
      />

      {!hasData && (
        <CustomText style={styles.sectionTitle}>
          ⚠️ 아직 해당 단과의 모든 경로를 완료한 사람이 없습니다.
        </CustomText>
      )}

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
          <CustomText style={styles.sectionTitle}>
            {title} 랭킹 TOP 10
          </CustomText>
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
        <CustomText style={styles.homeButtonText}>
          🏠 홈으로 돌아가기
        </CustomText>
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
