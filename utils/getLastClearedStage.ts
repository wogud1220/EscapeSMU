// // screens/getLastClearedStage.ts
// import {doc, getDoc} from 'firebase/firestore';
// import {db} from '../screens/firebase.config';

// export const getLastClearedStage = async ({
//   uid,
//   college,
// }: {
//   uid: string;
//   college: string;
// }): Promise<string | null> => {
//   try {
//     const docRef = doc(db, 'users', uid);
//     const snapshot = await getDoc(docRef);

//     if (!snapshot.exists()) return null;

//     const cleared = snapshot.data()?.stageCleared?.[college];
//     return cleared || null;
//   } catch (e) {
//     console.error('🔥 getLastClearedStage error:', e);
//     return null;
//   }
// };

// utils/getClearedStage.ts

import {doc, getDoc} from 'firebase/firestore';
import {db} from '../screens/firebase.config';

/**
 * 사용자의 학부별로 클리어된 마지막 스테이지 ID를 반환
 * @param uid 사용자 고유 ID
 * @param college 학부 이름 (공과대학 등)
 * @returns 클리어된 마지막 스테이지 ID (예: 'Stage1_2'), 없으면 null
 */
// export const getLastClearedStage = async (
//   uid: string,
//   college: string,
// ): Promise<string | null> => {
//   try {
//     const userRef = doc(db, 'users', uid);
//     const snapshot = await getDoc(userRef);
//     if (!snapshot.exists()) return null;

//     const cleared = snapshot.data()?.stageCleared?.[college];
//     return cleared ?? null;
//   } catch (error) {
//     console.error('🔥 getLastClearedStage error:', error);
//     return null;
//   }
// };

export const getLastClearedStage = async (
  uid: string,
  college: string,
): Promise<string> => {
  try {
    const userRef = doc(db, 'users', uid);
    const snapshot = await getDoc(userRef);
    if (!snapshot.exists()) return 'stage1_1';

    const cleared = snapshot.data()?.stageCleared?.[college];
    return cleared ?? 'stage1_1'; // 기본값 보장
  } catch (error) {
    console.error('🔥 getLastClearedStage error:', error);
    return 'stage1_1'; // 에러 발생 시에도 기본값
  }
};
