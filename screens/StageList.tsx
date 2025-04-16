import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../App';
import {useDepartment} from './Member/DepartmentContext';
import {onAuthStateChanged} from 'firebase/auth';
import {auth} from './firebase.config';
import {getLastClearedStage} from '../utils/getLastClearedStage';

const {width, height} = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const departments: Record<string, string[]> = {
  글로벌인문학부대학: [
    '한국언어문화전공',
    '일본어권지역학전공',
    '중국어권지역학전공',
    '영어권지역학전공',
    '프랑스어권지역학전공',
    '독일어권지역학전공',
    '러시아어권지역학전공',
  ],
  공과대학: [
    '전자공학과',
    '소프트웨어학과',
    '스마트정보통신공학과',
    '경영공학과',
    '그린화학공학과',
    '건설시스템공학과',
    '정보보안공학과',
    '시스템반도체공학과',
    '휴먼지능로봇공학과',
    '지능형로봇학과',
    'AI모빌리티공학과',
  ],
  디자인학부: [
    '커뮤니케이션디자인',
    '텍스타일디자인',
    '세라믹디자인',
    'AR/VR',
    '패션디자인',
    '스페이스디자인',
    '인더스트리얼디자인',
  ],
  융합기술대학: [
    '글금경',
    '식품공학', //공대
    '그린스마트시티',
    '간호학과',
    '스포츠융합학부', //체대
  ],
  예술학부: [
    '영화영상',
    '무대미술',
    '디지털만화영상', //융기대
    '문화예술경영',
    '연극전공',
    '사진영상', //융기대
  ],
};

const departmentToCollege: Record<string, string> = Object.entries(
  departments,
).reduce((acc, [college, majors]) => {
  majors.forEach(major => {
    if (major === '스포츠융합학부') {
      acc[major] = '체육대학';
    } else if (major === '디지털만화영상' || major === '사진영상') {
      acc[major] = '융합기술대학';
    } else if (major === '식품공학') {
      acc[major] = '공과대학';
    } else {
      acc[major] = college;
    }
  });
  return acc;
}, {} as Record<string, string>);

const formatStageKey = (id: string): keyof RootStackParamList => {
  if (!id.includes('_')) {
    return id.replace(/^stage/i, 'Stage') as keyof RootStackParamList;
  }
  const parts = id.split('_');
  const formatted = parts
    .map((part, i) =>
      i === 0 ? part.charAt(0).toUpperCase() + part.slice(1) : part,
    )
    .join('_');
  return formatted as keyof RootStackParamList;
};

const StageList = () => {
  const navigation = useNavigation<NavigationProp>();
  const [showLeftMenu, setShowLeftMenu] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState<string | null>(null);
  const {setCollege, setDepartment} = useDepartment();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate('Main')}
        style={styles.homeButton}>
        <Image
          source={require('../assets/home.png')}
          style={styles.homeImage}
          resizeMode="contain"
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.sideButton}
        onPress={() => {
          setShowLeftMenu(!showLeftMenu);
          setSelectedCollege(null);
        }}>
        <Text style={styles.buttonText}>학과 선택</Text>
      </TouchableOpacity>

      {showLeftMenu && !selectedCollege && (
        <View style={styles.menu}>
          {Object.keys(departments).map((dept, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.menuItemButton}
              onPress={() => setSelectedCollege(dept)}>
              <Text style={styles.menuItem}>{dept}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {showLeftMenu && selectedCollege && (
        <View style={styles.menu}>
          {departments[selectedCollege].map((major, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.menuItemButton}
              onPress={() => {
                const originalCollege = selectedCollege; // 보여줄 학부
                const mappedCollege = departmentToCollege[major]; // 경로로 사용할 학부 (사진영상 → 융기대)

                setCollege(originalCollege); // 원래 학부 저장
                setDepartment(major); // 전공 저장

                onAuthStateChanged(auth, user => {
                  if (user) {
                    console.log('✅ user.uid:', user.uid);
                    console.log('✅ mappedCollege:', mappedCollege);
                    getLastClearedStage(user.uid, mappedCollege).then(
                      cleared => {
                        console.log('📦 getLastClearedStage result:', cleared);
                        const next = formatStageKey(
                          cleared || 'stage1',
                        ) as keyof RootStackParamList;
                        navigation.navigate(next, {
                          college: mappedCollege, // 경로는 융기대 루트
                          department: major,
                        });
                      },
                    );
                  }
                });
              }}>
              <Text style={styles.menuItem}>{major}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5E6C4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sideButton: {
    backgroundColor: '#4444EC',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  menu: {
    marginTop: 10,
    alignItems: 'flex-start',
  },
  menuItemButton: {
    width: width * 0.6,
    paddingVertical: 10,
    backgroundColor: '#DDEEFF',
    marginBottom: 8,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  menuItem: {
    fontSize: 16,
    color: '#333',
  },
  homeButton: {
    position: 'absolute',
    top: height * 0.05,
    left: width * 0.05,
    width: width * 0.1,
    height: width * 0.1,
    zIndex: 10,
  },
  homeImage: {
    width: '100%',
    height: '100%',
  },
});

export default StageList;
