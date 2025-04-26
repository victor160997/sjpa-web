import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Sua configuração do Firebase
// IMPORTANTE: Você precisará substituir essas configurações pelas suas próprias
const firebaseConfig = {
  apiKey: "AIzaSyDEE6qSM4FIjxN3q1bn8Y_HENEyVQvHUTk",
  authDomain: "sjpa-14841.firebaseapp.com",
  databaseURL: "https://sjpa-14841-default-rtdb.firebaseio.com",
  projectId: "sjpa-14841",
  storageBucket: "sjpa-14841.appspot.com",
  messagingSenderId: "552431107911",
  appId: "1:552431107911:web:aacfc21a0aadbd5b59d662",
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta as instâncias de autenticação e banco de dados
export const auth = getAuth(app);
export const db = getFirestore(app);
