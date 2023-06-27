import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
const firebaseConfig = {
  apiKey: 'AIzaSyAxc8e7kGXNiwpfc9uZeBrFzLR8wMbBumk',
  authDomain: 'quickdeal-dfd83.firebaseapp.com',
  projectId: 'quickdeal-dfd83',
  storageBucket: 'quickdeal-dfd83.appspot.com',
  messagingSenderId: '20907496764',
  appId: '1:20907496764:web:398be6217862cdd804ba39',
  measurementId: 'G-8T5F9SB1NT'
}
const app = initializeApp(firebaseConfig)
const quickdealFIRESTORE = getFirestore(app)
export default quickdealFIRESTORE
