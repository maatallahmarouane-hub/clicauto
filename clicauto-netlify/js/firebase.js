import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, doc, getDocs, setDoc, deleteDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey:            "AIzaSyBirUSp9Kv7oBZ4m79H3YFNaUWydaPP-CQ",
  authDomain:        "cliccarrosserie-9f29d.firebaseapp.com",
  projectId:         "cliccarrosserie-9f29d",
  storageBucket:     "cliccarrosserie-9f29d.firebasestorage.app",
  messagingSenderId: "922080874368",
  appId:             "1:922080874368:web:09d413d5439067ec6dfb65"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export const FIREBASE_DATA = {
  products: [],
  vehicles: [],
  orders: [],
  messages: [],
  fournisseurs: []
};

export const FS = {
  async getAll(col) {
    const snap = await getDocs(collection(db, col));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  },
  async set(col, id, data) {
    await setDoc(doc(db, col, id), data, { merge: true });
  },
  async del(col, id) {
    await deleteDoc(doc(db, col, id));
  },
  listen(col, callback) {
    return onSnapshot(collection(db, col), snap => {
      callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }
};

export const Auth = {
  login: (email, pwd) => signInWithEmailAndPassword(auth, email, pwd),
  logout: () => signOut(auth),
  onChange: cb => onAuthStateChanged(auth, cb)
};
