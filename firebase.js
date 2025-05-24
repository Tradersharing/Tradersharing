const firebaseConfig = {
  apiKey: "AIzaSyCn-MxZ96eujNalUlZaRs4Id6-9np3ffQk",
  authDomain: "anomali-price-action.firebaseapp.com",
  databaseURL: "https://anomali-price-action-default-rtdb.firebaseio.com", // WAJIB ditambah
  projectId: "anomali-price-action",
  storageBucket: "anomali-price-action.appspot.com", // revisi `.app` jadi `.com`
  messagingSenderId: "138775853204",
  appId: "1:138775853204:web:44b073675490213c7d9c81",
  measurementId: "G-PP58JN04W8"
};

// Inisialisasi Firebase
firebase.initializeApp(firebaseConfig);

// Inisialisasi Realtime Database
const database = firebase.database();
