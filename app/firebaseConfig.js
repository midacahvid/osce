import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyBmHZIqIn-mVVLnly1RRSv3CWP0qAuTvdw',
  authDomain: 'osce-e7284.firebaseapp.com',
  projectId: 'osce-e7284',
  storageBucket: 'osce-e7284.appspot.com',
  messagingSenderId: '476506549051',
  appId: '1:476506549051:web:ebba80c45da96ba063a51e',
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
export { db }
