import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyAgNSSoQtjvsOsS1K4ERdmX7v3oMUBB9wo",
  authDomain: "adminmenu-97d4f.firebaseapp.com",
  projectId: "adminmenu-97d4f",
  storageBucket: "adminmenu-97d4f.appspot.com",
  messagingSenderId: "581993604609",
  appId: "1:581993604609:web:3b7f5096e4ad723ae28200",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
