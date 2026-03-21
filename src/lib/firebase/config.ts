import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBEAwlXtQKimebqe5YUWC-T0mIoxifUsb8",
  authDomain: "auctionge.firebaseapp.com",
  projectId: "auctionge",
  storageBucket: "auctionge.firebasestorage.app",
  messagingSenderId: "41736829092",
  appId: "1:41736829092:web:42e507cb4fbee356ea0e31",
};

// Initialize Firebase (prevent duplicate init in dev hot reload)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
