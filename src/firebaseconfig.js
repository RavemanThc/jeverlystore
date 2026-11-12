import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
const firebaseConfig = {
  projectId: "jeverly-ae091",
  storageBucket: "jeverly-ae091.firebasestorage.app",
  messagingSenderId: "81532757295",
  appId: "1:81532757295:web:505332fb319b73a005edda",
  measurementId: "G-F5R0J62XZM",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
