import { useRef, useState } from 'react'
export default function SosButton({onConfirm}){
const [p,setP]=useState(0),[ask,setAsk]=useState(false),t=useRef(null),s=useRef(0)
const stop=()=>{clearInterval(t.current);setP(0)}
const start=()=>{s.current=Date.now();t.current=setInterval(()=>{const v=Math.min(100,(Date.now()-s.current)/30);setP(v);if(v>=100){stop();setAsk(true)}},50)}
return <div className="text-center">
<button aria-label="SOS emergency button. Press and hold for 3 seconds, or press Enter." onPointerDown={start} onPointerUp={stop} onPointerLeave={stop}
onKeyDown={e=>{if(e.key==='Enter'&&!ask)setAsk(true)}}
className="w-44 h-44 rounded-full text-white text-3xl font-bold shadow-xl select-none" style={{background:`conic-gradient(#fff ${p}%, #dc2626 0)`}}>
<span className="flex items-center justify-center w-36 h-36 m-auto rounded-full bg-red-600">SOS</span></button>
<p className="text-sm mt-2">Press and hold for 3 seconds</p>
{ask&&<div role="dialog" aria-modal="true" className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[2000]"><div className="bg-white rounded-xl p-6 max-w-sm w-full">
<h2 className="text-xl font-bold mb-4">Are you in immediate danger?</h2>
<button className="w-full py-4 mb-2 bg-red-600 text-white rounded-lg font-bold" onClick={()=>{setAsk(false);onConfirm()}}>SEND SOS</button>
<button className="w-full py-4 bg-gray-200 rounded-lg" onClick={()=>setAsk(false)}>CANCEL</button></div></div>}</div>}
