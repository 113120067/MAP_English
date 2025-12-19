import { db, auth } from "../firebase";
import { doc, getDoc, setDoc, updateDoc, arrayUnion, increment } from "firebase/firestore";
import { signInAnonymously, onAuthStateChanged, type User } from "firebase/auth";

export interface UserProgress {
    uid: string;
    points: number;
    unlockedWords: string[];
}

// Ensure user is signed in (anonymously)
export const ensureAuth = (): Promise<User> => {
    return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe();
            if (user) {
                resolve(user);
            } else {
                signInAnonymously(auth)
                    .then((cred) => resolve(cred.user))
                    .catch(reject);
            }
        });
    });
};

// Initialize or fetch user progress
export const getUserProgress = async (uid: string): Promise<UserProgress> => {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
        return userSnap.data() as UserProgress;
    } else {
        const initialProgress: UserProgress = {
            uid,
            points: 0,
            unlockedWords: [],
        };
        await setDoc(userRef, initialProgress);
        return initialProgress;
    }
};

// Unlock a word
export const unlockWord = async (uid: string, wordId: string) => {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
        unlockedWords: arrayUnion(wordId),
        points: increment(10), // 10 points per word
    });
};
