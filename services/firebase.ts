import { UserProfile, ClassLevel, GroupType, ChatMessage } from '../types';
// Import Firebase SDKs
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, updateDoc, collection } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

// ============================================================================
// FIREBASE CONFIGURATION
// ============================================================================
const firebaseConfig = {
  apiKey: "AIzaSyDZRHVJV4wQiChRqe8Ea8Fcrj_BRAeGqU4",
  authDomain: "shikkhok-ai.firebaseapp.com",
  projectId: "shikkhok-ai",
  storageBucket: "shikkhok-ai.firebasestorage.app",
  messagingSenderId: "305123103990",
  appId: "1:305123103990:web:1aa3f40aa67de8209508d7",
  measurementId: "G-ZQWNQZ9SS1"
};
// ============================================================================

// Check if config is present
const isFirebaseConfigured = firebaseConfig.apiKey.length > 0;

// Initialize Firebase if config exists
let auth: any;
let db: any;
let analytics: any;

if (isFirebaseConfigured) {
    try {
        const app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
        analytics = getAnalytics(app);
        console.log("Firebase Initialized Successfully with Real Database");
    } catch (e) {
        console.error("Firebase Init Error:", e);
    }
}

// --- HELPERS ---
// Remove undefined fields before saving to Firestore
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cleanData = (data: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cleaned: any = {};
    Object.keys(data).forEach(key => {
        if (data[key] !== undefined) {
            cleaned[key] = data[key];
        }
    });
    return cleaned;
};

const sanitizeId = (str: string) => {
    return str.replace(/[^a-zA-Z0-9]/g, '_');
};

// --- FALLBACK: Local Storage Implementation (Only used if Firebase fails or keys missing) ---
const USERS_KEY = 'shikkhok_users_db'; 
const SESSION_KEY = 'shikkhok_current_session';
const CHAT_KEY_PREFIX = 'shikkhok_chat_';

// Local DB Helpers
const getLocalDB = (): Record<string, UserProfile> => {
    try {
        const data = localStorage.getItem(USERS_KEY);
        return data ? JSON.parse(data) : {};
    } catch (e) { return {}; }
};
const saveLocalDB = (data: Record<string, UserProfile>) => localStorage.setItem(USERS_KEY, JSON.stringify(data));


// --- AUTHENTICATION SERVICES ---

export const loginUser = async (email: string, pass: string): Promise<UserProfile> => {
    if (isFirebaseConfigured && auth) {
        // Real Firebase Login
        const userCredential = await signInWithEmailAndPassword(auth, email, pass);
        const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
        if (userDoc.exists()) {
            return userDoc.data() as UserProfile;
        } else {
            // User exists in Auth but not in Firestore (rare edge case)
            throw new Error("User profile not found in database.");
        }
    } else {
        // Fallback Login
        const db = getLocalDB();
        const user = db[email.toLowerCase()];
        if (user && user.password === pass) {
            localStorage.setItem(SESSION_KEY, email.toLowerCase());
            return user;
        }
        throw new Error("ইমেইল বা পাসওয়ার্ড ভুল হয়েছে।");
    }
};

export const registerUser = async (name: string, email: string, pass: string): Promise<UserProfile> => {
    const normalizedEmail = email.toLowerCase();
    const newUserProfile: UserProfile = {
        id: '', // Will be set by UID or timestamp
        email: normalizedEmail,
        name: name,
        classLevel: ClassLevel.CLASS_6, // Default
        group: GroupType.NONE,
        password: pass // Only stored in Local fallback, NOT in Firestore
    };

    if (isFirebaseConfigured && auth) {
        // Real Firebase Signup
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        newUserProfile.id = userCredential.user.uid;
        
        // Remove password before saving to Firestore for security
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...profileToSave } = newUserProfile;
        
        // Use cleanData to remove any undefined fields
        await setDoc(doc(db, "users", userCredential.user.uid), cleanData(profileToSave));
        return newUserProfile;
    } else {
        // Fallback Signup
        const db = getLocalDB();
        if (db[normalizedEmail]) throw new Error("এই ইমেইল দিয়ে ইতিমধ্যে অ্যাকাউন্ট খোলা আছে।");
        
        newUserProfile.id = Date.now().toString();
        db[normalizedEmail] = newUserProfile;
        saveLocalDB(db);
        localStorage.setItem(SESSION_KEY, normalizedEmail);
        return newUserProfile;
    }
};

export const logoutUser = async () => {
    if (isFirebaseConfigured && auth) {
        await signOut(auth);
    } else {
        localStorage.removeItem(SESSION_KEY);
    }
    window.location.reload();
};

// Init Auth Listener
export const initAuth = (onUserFound: (user: UserProfile) => void, onNoUser: () => void) => {
    if (isFirebaseConfigured && auth) {
        // Real Firebase Listener
        return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
            if (firebaseUser) {
                try {
                    const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
                    if (userDoc.exists()) {
                        onUserFound(userDoc.data() as UserProfile);
                    } else {
                        // Profile might not exist yet if created manually in console
                        onNoUser();
                    }
                } catch (e) {
                    console.error("Error fetching user profile:", e);
                    onNoUser();
                }
            } else {
                onNoUser();
            }
        });
    } else {
        // Fallback Check
        const currentEmail = localStorage.getItem(SESSION_KEY);
        if (currentEmail) {
            const db = getLocalDB();
            const user = db[currentEmail];
            if (user) {
                onUserFound(user);
                return () => {};
            }
        }
        onNoUser();
        return () => {};
    }
};

// Save Profile Updates
export const saveUserProfileToDB = async (userProfile: UserProfile) => {
    if (isFirebaseConfigured && db) {
        try {
            const userRef = doc(db, "users", userProfile.id);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, subject, chapter, ...dataToSave } = userProfile; // Don't save transient nav state
            
            // Use updateDoc for existing documents, but ensure data is clean
            await updateDoc(userRef, cleanData(dataToSave));
        } catch (e) {
            console.error("Error saving profile:", e);
        }
    } else {
        // Update LocalStorage
        const db = getLocalDB();
        if (db[userProfile.email]) {
            db[userProfile.email] = { ...db[userProfile.email], ...userProfile };
            saveLocalDB(db);
        }
    }
};


// --- CHAT PERSISTENCE SERVICES ---
// UPDATED: Now stores chats as a SUB-COLLECTION of the user to respect Firestore security rules.

const getLocalChatKey = (userId: string, subjectId: string, chapter: string) => {
    const safeSubject = sanitizeId(subjectId);
    const safeChapter = sanitizeId(chapter);
    return `${CHAT_KEY_PREFIX}${userId}_${safeSubject}_${safeChapter}`;
};

const getFirestoreChatRef = (userId: string, subjectId: string, chapter: string) => {
     // Create a consistent ID for the document
     const chatId = sanitizeId(`${subjectId}_${chapter}`);
     return doc(db, "users", userId, "chats", chatId);
};

export const saveChatHistory = async (userId: string, subjectId: string, chapter: string, messages: ChatMessage[]) => {
    const msgsToSave = messages.slice(-50); // Keep last 50

    if (isFirebaseConfigured && db) {
        try {
            const chatRef = getFirestoreChatRef(userId, subjectId, chapter);
            // Use setDoc with merge: true so we don't overwrite if logic changes, 
            // though here we are replacing the messages array.
            await setDoc(chatRef, { 
                messages: JSON.stringify(msgsToSave), 
                updatedAt: new Date(),
                subjectId,
                chapter
            }, { merge: true });
        } catch (e) { 
            console.error("Firestore Chat Save Error:", e); 
        }
    } else {
        const key = getLocalChatKey(userId, subjectId, chapter);
        localStorage.setItem(key, JSON.stringify(msgsToSave));
    }
};

export const getChatHistory = async (userId: string, subjectId: string, chapter: string): Promise<ChatMessage[] | null> => {
    if (isFirebaseConfigured && db) {
        try {
            const chatRef = getFirestoreChatRef(userId, subjectId, chapter);
            const snapshot = await getDoc(chatRef);
            if (snapshot.exists() && snapshot.data().messages) {
                return JSON.parse(snapshot.data().messages);
            }
            return null;
        } catch (e) { 
            console.error("Firestore Chat Load Error:", e);
            return null; 
        }
    } else {
        const key = getLocalChatKey(userId, subjectId, chapter);
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }
};

export const clearChatHistory = async (userId: string, subjectId: string, chapter: string) => {
    if (isFirebaseConfigured && db) {
         try {
            const chatRef = getFirestoreChatRef(userId, subjectId, chapter);
            await updateDoc(chatRef, { messages: "[]" }); 
         } catch (e) {
             console.error("Firestore Chat Clear Error:", e);
         }
    } else {
        const key = getLocalChatKey(userId, subjectId, chapter);
        localStorage.removeItem(key);
    }
};