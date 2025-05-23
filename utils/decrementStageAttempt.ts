import {doc, getDoc, updateDoc, increment} from 'firebase/firestore';
import {db} from '../screens/firebase.config';

/**
 * 사용자의 시도 횟수를 1 감소시키는 함수
 * @param uid - 사용자 ID
 * @param college - 학부명 (예: 공과대학)
 */
export const decrementStageAttempt = async (
  uid: string,
  college: string,
): Promise<void> => {
  const userRef = doc(db, 'users', uid);
  const countField = `stageCnt.${college}Cnt`;

  const snapshot = await getDoc(userRef);
  if (snapshot.exists()) {
    await updateDoc(userRef, {
      [countField]: increment(-1),
    });
  }
};