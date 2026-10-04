import { get, set } from 'idb-keyval'
const KEY='resqmap-queue'
export async function getQueue(){return (await get(KEY))||[]}
export async function addToQueue(item){const q=await getQueue();if(!q.some(i=>i.id===item.id))q.push(item);await set(KEY,q)}
export async function removeFromQueue(id){await set(KEY,(await getQueue()).filter(i=>i.id!==id))}
export async function syncQueue(sender){let sent=0
for(const item of await getQueue()){try{await sender(item);await removeFromQueue(item.id);sent++}catch{break}}
return sent}
