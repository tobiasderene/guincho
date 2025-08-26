// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAtjQkFysGeYtPhB9WHrW1vVfWdIrZhSbI",
  authDomain: "guincho-motors.firebaseapp.com",
  projectId: "guincho-motors",
  storageBucket: "guincho-motors.firebasestorage.app",
  messagingSenderId: "698337723978",
  appId: "1:698337723978:web:1d0cd18a995c661cfa48b3",
  measurementId: "G-3RRT3LC26E"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
