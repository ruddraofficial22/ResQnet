import { doc, setDoc, serverTimestamp, collection, onSnapshot } from 'firebase/firestore'
import { db } from '../config/firebase'
export function startPresence(uid){const beat=()=>setDoc(doc(db,'presence',uid),{lastSeen:serverTimestamp()}).catch(()=>{});beat();const t=setInterval(beat,60000);return()=>clearInterval(t)}
export function countPresence(records,now=Date.now()){
const online=records.filter(({lastSeen})=>{
const seen=typeof lastSeen?.toMillis==='function'?lastSeen.toMillis():typeof lastSeen?.seconds==='number'?lastSeen.seconds*1000:null
return seen!==null&&seen>now-150000
}).length
return {total:records.length,online}}
export function listenUserCounts(cb,onErr){let records=[]
const publish=()=>cb(countPresence(records))
const unsubscribe=onSnapshot(collection(db,'presence'),s=>{records=s.docs.map(d=>d.data());publish()},onErr)
const timer=setInterval(publish,30000)
return()=>{clearInterval(timer);unsubscribe()}}
