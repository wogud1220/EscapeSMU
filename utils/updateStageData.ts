import {doc, getDoc, setDoc, updateDoc, increment} from 'firebase/firestore';
import {db} from '../screens/firebase.config';

/**
 * 사용자의 스테이지 진행 정보와 시도 횟수를 저장하는 함수
 * @param uid - 사용자 ID
 * @param college - 학부명 (예: 공과대학)
 * @param stageId - 완료된 스테이지 ID (예: Stage1_2)
 */
export const updateStageData = async (
  uid: string,
  college: string,
  stageId: string,
): Promise<void> => {
  const userRef = doc(db, 'users', uid);

  try {
    const snapshot = await getDoc(userRef);

    const clearedField = `stageCleared.${college}`;
    const countField = `stageCnt.${college}Cnt`;

    // 문서가 없다면 새로 생성
    if (!snapshot.exists()) {
      await setDoc(userRef, {
        stageCleared: {[college]: stageId},
        stageCnt: {[`${college}Cnt`]: 1},
      });
      return;
    }

    // 문서가 있다면 시도횟수 증가, 클리어 스테이지 갱신
    await updateDoc(userRef, {
      [clearedField]: stageId, // 대소문자 포함된 ID 저장 가능
      [countField]: increment(1),
    });
  } catch (e) {
    console.error('🔥 updateStageData error:', e);
    throw e;
  }
};
