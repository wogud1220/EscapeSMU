// utils/incrementStageAttempt.ts
import {doc, getDoc, setDoc, updateDoc, increment} from 'firebase/firestore';
import {db} from '../screens/firebase.config';

export const incrementStageAttempt = async (
  uid: string,
  college: string,
): Promise<void> => {
  const userRef = doc(db, 'users', uid);
  const countField = `stageCnt.${college}Cnt`;

  const snapshot = await getDoc(userRef);
  const prevCnt = snapshot.exists()
    ? snapshot.data()?.stageCnt?.[`${college}Cnt`] ?? 0
    : 0;

  if (!snapshot.exists()) {
    await setDoc(userRef, {
      stageCnt: {[`${college}Cnt`]: 1},
    });
  } else {
    await updateDoc(userRef, {
      [countField]: increment(1),
    });
  }
};
