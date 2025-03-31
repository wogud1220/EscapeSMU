import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../App';

const {width, height} = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'StageList'
>;

const StageList = () => {
  const navigation = useNavigation<NavigationProp>();
  const [showLeftMenu, setShowLeftMenu] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState<string | null>(null);

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
      '식품공학',
      '그린스마트시티',
      '간호학과',
      '스포츠융합학부',
    ],
    예술학부: [
      '영화영상',
      '무대미술',
      '디지털만화영상',
      '문화예술경영',
      '연극전공',
      '사진영상',
    ],
  };

  return (
    <View style={styles.container}>
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
              onPress={() =>
                navigation.navigate('Stage1', {
                  department: `${selectedCollege} - ${major}`,
                })
              }>
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
});

export default StageList;
