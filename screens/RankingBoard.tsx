// import React, {useEffect, useState} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   SectionList,
//   ActivityIndicator,
// } from 'react-native';
// import {Picker} from '@react-native-picker/picker';
// import {collection, getDocs} from 'firebase/firestore';
// import {onAuthStateChanged} from 'firebase/auth';
// import {auth, db} from './firebase.config';

// interface RankItem {
//   uid: string;
//   emailPrefix: string;
//   stageCnt: number;
// }

// interface SectionData {
//   title: string;
//   data: RankItem[];
// }

// const COLLEGES = [
//   '글로벌인문학부대학',
//   '디자인학부',
//   '공과대학',
//   '융합기술대학',
//   '예술학부',
//   '기타',
// ];

// const RankingBoard = () => {
//   const [selectedCollege, setSelectedCollege] = useState('글로벌인문학부대학');
//   const [rankData, setRankData] = useState<SectionData[]>([]);
//   const [myUid, setMyUid] = useState('');
//   const [myScore, setMyScore] = useState<number>(0);
//   const [myRank, setMyRank] = useState<number | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, user => {
//       if (user) {
//         setMyUid(user.uid);
//       }
//     });
//     return unsubscribe;
//   }, []);

//   useEffect(() => {
//     const fetchRank = async () => {
//       setLoading(true);
//       try {
//         const snapshot = await getDocs(collection(db, 'users'));
//         const allUsers = snapshot.docs.map(doc => {
//           const data = doc.data();
//           return {
//             uid: doc.id,
//             emailPrefix: data.email?.split('@')[0].slice(0, 4) || 'user',
//             stageCnt: data.stageCnt?.[`${selectedCollege}Cnt`] || 0,
//           };
//         });

//         const filtered = allUsers
//           .filter(user => user.stageCnt > 0)
//           .sort((a, b) => b.stageCnt - a.stageCnt);

//         const top10 = filtered.slice(0, 10);
//         const myInfo = filtered.find(u => u.uid === myUid);
//         const myIdx = filtered.findIndex(u => u.uid === myUid);

//         setRankData([{title: selectedCollege, data: top10}]);
//         setMyScore(myInfo?.stageCnt ?? 0);
//         setMyRank(myIdx >= 0 ? myIdx + 1 : null);
//       } catch (err) {
//         console.error('🔥 랭킹 로드 오류:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (selectedCollege) fetchRank();
//   }, [selectedCollege, myUid]);

//   if (loading) {
//     return (
//       <View style={styles.loader}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   return (
//     <View style={{flex: 1}}>
//       <Picker
//         selectedValue={selectedCollege}
//         onValueChange={(itemValue: React.SetStateAction<string>) =>
//           setSelectedCollege(itemValue)
//         }>
//         {COLLEGES.map(c => (
//           <Picker.Item key={c} label={c} value={c} />
//         ))}
//       </Picker>

//       <SectionList
//         sections={rankData}
//         keyExtractor={item => item.uid}
//         renderSectionHeader={({section: {title}}) => (
//           <Text style={styles.sectionTitle}>{title}</Text>
//         )}
//         renderItem={({item, index}) => (
//           <View style={styles.row}>
//             <Text style={styles.rank}>{index + 1}위</Text>
//             <Text style={styles.name}>{item.emailPrefix}</Text>
//             <Text style={styles.score}>{item.stageCnt}점</Text>
//           </View>
//         )}
//         contentContainerStyle={{padding: 20}}
//       />

//       <View style={styles.myRankBox}>
//         <Text style={styles.myRankText}>
//           나의 순위: {myRank ? `${myRank}위 (${myScore}점)` : '기록 없음'}
//         </Text>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   loader: {flex: 1, justifyContent: 'center', alignItems: 'center'},
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginTop: 16,
//     marginBottom: 8,
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingVertical: 8,
//     borderBottomWidth: 1,
//     borderColor: '#eee',
//   },
//   rank: {fontWeight: 'bold', width: 40},
//   name: {flex: 1},
//   score: {width: 60, textAlign: 'right'},
//   myRankBox: {
//     padding: 16,
//     backgroundColor: '#f0f8ff',
//     borderTopWidth: 1,
//     borderColor: '#ccc',
//     alignItems: 'center',
//   },
//   myRankText: {
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });

// export default RankingBoard;

// screens/RankingBoard.tsx

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

interface RankItem {
  uid: string;
  emailPrefix: string;
  score: number;
}

interface SectionData {
  title: string;
  data: RankItem[];
}

const colleges = [
  '디자인학부',
  '글로벌인문학부대학',
  '공과대학',
  '예술학부',
  '융합기술대학',
];

const RankingBoard = () => {
  const [selectedCollege, setSelectedCollege] = useState('디자인학부');
  const [rankData, setRankData] = useState<SectionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [myUid, setMyUid] = useState('');
  const [myRank, setMyRank] = useState<RankItem | null>(null);

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

        const sorted = all
          .filter(u => u.score > 0)
          .sort((a, b) => b.score - a.score);

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
          <Text style={styles.sectionTitle}>✨ 나의 순위</Text>
          <Text style={styles.myText}>
            {myRank.emailPrefix} - {myRank.score}점
          </Text>
        </View>
      )}

      <SectionList
        sections={rankData}
        keyExtractor={item => item.uid}
        renderSectionHeader={({section: {title}}) => (
          <Text style={styles.sectionTitle}>{title} 랭킹 TOP 10</Text>
        )}
        renderItem={({item, index}) => (
          <View style={styles.row}>
            <Text style={styles.rank}>{index + 1}위</Text>
            <Text style={styles.name}>{item.emailPrefix}</Text>
            <Text style={styles.score}>{item.score}점</Text>
          </View>
        )}
        contentContainerStyle={{padding: 20}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  loader: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
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
  rank: {fontWeight: 'bold', width: 40},
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
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default RankingBoard;
