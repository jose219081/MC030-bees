// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, onValue, ref, set } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBUQWIYGrRnsBBCEn7fUTQLH3sII1EeT5Y",
  authDomain: "bees-f6e6b.firebaseapp.com",
  databaseURL: "https://bees-f6e6b-default-rtdb.firebaseio.com",
  projectId: "bees-f6e6b",
  storageBucket: "bees-f6e6b.appspot.com",
  messagingSenderId: "89756211477",
  appId: "1:89756211477:web:c3286f223e19281dffb11c",
  measurementId: "G-8KKE1KG00R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);
function writeUsrData(day){
  const reference = ref(database, 'bee_data/' + day);
  set(reference, {
    openweathermap: {
      main: {
        feelslike: 290.31,
        grnd_level: 950,
        humidity: 88,
        pressure: 1025,
        sea_level: 1025,
        temp: 290.25,
        temp_max: 291.07,
        temp_min: 288.91
      },
    },
    sensor: {
      gas_interno: 149844,
      id_placa: 1,
      pressao_interna: 955.074,
      proximidade: 3602,
      temperatura_interna: 23.95481,
      umidade_interna: 66.62566
    }
  });
}

writeUsrData("08_07_2024-23_37_23");
writeUsrData("09_07_2024-23_37_23");
writeUsrData("10_07_2024-23_37_23");
export { analytics, database};