import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore'
const e = import.meta.env
const config = {
	apiKey:e.VITE_FIREBASE_API_KEY,
	authDomain:e.VITE_FIREBASE_AUTH_DOMAIN,
	projectId:e.VITE_FIREBASE_PROJECT_ID,
	storageBucket:e.VITE_FIREBASE_STORAGE_BUCKET,
	messagingSenderId:e.VITE_FIREBASE_MESSAGING_SENDER_ID,
	appId:e.VITE_FIREBASE_APP_ID
}
export const firebaseConfigured = Object.values(config).every(value => typeof value === 'string' && value.trim())
const app = firebaseConfigured ? initializeApp(config) : null
export const auth = app ? getAuth(app) : null
export const db = app ? initializeFirestore(app,{localCache:persistentLocalCache({tabManager:persistentMultipleTabManager()})}) : null
