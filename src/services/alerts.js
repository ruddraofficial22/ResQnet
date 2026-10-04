import { collection, doc, setDoc, updateDoc, query, where, onSnapshot, serverTimestamp } from 'firebase/firestore'
import { db } from '../config/firebase'
import { validateAlert } from '../utils/validate'
import { addToQueue, syncQueue } from './offlineQueue'
export async function writeAlert(a){await setDoc(doc(db,'alerts',a.id),{...a,createdAt:serverTimestamp()})}
export async function sendAlert(user,loc,extra={}){
const a={id:crypto.randomUUID(),userId:user.uid,latitude:loc.latitude,longitude:loc.longitude,disasterType:'SOS',severity:'HIGH',message:'',status:'ACTIVE',verified:false,...extra}
const errs=validateAlert(a);if(errs.length)throw new Error(errs.join(', '))
if(!navigator.onLine){await addToQueue(a);return {queued:true}}
try{await writeAlert(a);return {queued:false}}catch{await addToQueue(a);return {queued:true}}}
export const flushQueue=()=>syncQueue(writeAlert)
export const cancelAlert=id=>updateDoc(doc(db,'alerts',id),{status:'CANCELLED'})
// Single-field query (no composite index needed); sorted on the client.
export function listenActiveAlerts(cb,onErr){return onSnapshot(query(collection(db,'alerts'),where('status','==','ACTIVE')),
s=>cb(s.docs.map(d=>({...d.data(),id:d.id})).sort((a,b)=>(b.createdAt?.seconds??9e9)-(a.createdAt?.seconds??9e9))),e=>onErr(e.message))}
export function listenSafeZones(cb){return onSnapshot(collection(db,'safeZones'),s=>cb(s.docs.map(d=>({...d.data(),id:d.id}))),()=>cb([]))}
