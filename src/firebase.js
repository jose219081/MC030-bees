// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
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
/*function writeUsrData(day){
  const reference = ref(database, 'bee_data/' + day);
  set(reference, {
    openweathermap: {
      main: {
        feels_like: Math.random()*(300-270)+270,
        grnd_level: Math.random()*(1100-900)+900,
        humidity: Math.random()*(100-50)+50,
        pressure: Math.random()*(1100-900)+900,
        sea_level: Math.random()*(1100-900)+900,
        temp: Math.random()*(300-270)+270,
        temp_max: Math.random()*(300-270)+270,
        temp_min: Math.random()*(300-270)+270
      },
    },
    sensor: {
      gas_interno: 149844,
      id_placa: 1,
      pressao_interna: Math.random()*(1100-900)+900,
      proximidade: Math.random()*(300),
      temperatura_interna: Math.random()*(36-0),
      umidade_interna: Math.random()*(100-50)+50
    },
    pollution: {
      list: {
        main:{ 
          aqi: Math.floor(Math.random()*(6-1))+1
        }
      }
    }
  });
}*/


export { analytics, database};