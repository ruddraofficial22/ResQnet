import { useEffect, useState } from 'react'
import { Routes, Route, NavLink, Navigate, Link } from 'react-router-dom'
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signInAnonymously, signOut, sendPasswordResetEmail } from 'firebase/auth'
import { Home as HomeI, TriangleAlert, Siren, User, Route as RouteI, CloudSun, Users, LocateFixed, RefreshCw } from 'lucide-react'
import { auth, firebaseConfigured } from './config/firebase'
import { sendAlert, flushQueue, listenActiveAlerts, listenSafeZones, cancelAlert } from './services/alerts'
import { getCurrentLocation, watchLocation, stopWatchingLocation } from './services/locationService'
import { getRoute, getCachedRoute } from './services/routingService'
import { fetchSafePlaces } from './services/safePlaces'
import { fetchWeather } from './services/weather'
import { startPresence, listenUserCounts } from './services/presence'
import { haversineKm } from './utils/geo'
import SosButton from './components/SosButton'
import MapView from './components/MapView'
const km=(l,p)=>haversineKm(l.latitude,l.longitude,p.latitude,p.longitude)
const Card=({children,className=''})=><div className={`bg-white rounded-2xl shadow-sm p-4 ${className}`}>{children}</div>
const Disclaimer=()=><p className="text-xs bg-yellow-100 p-2 rounded-xl">ResQNet is an assistance tool, not a replacement for official emergency services. Reports may be inaccurate; routes and conditions change; delivery is not guaranteed. Call your local emergency number when possible.</p>
function useOnline(){const [o,setO]=useState(navigator.onLine);useEffect(()=>{const f=()=>{setO(navigator.onLine);if(navigator.onLine)flushQueue()};addEventListener('online',f);addEventListener('offline',f);return()=>{removeEventListener('online',f);removeEventListener('offline',f)}},[]);return o}
function Splash(){return <div className="h-screen flex flex-col items-center justify-center bg-gray-100"><div className="w-20 h-20 rounded-2xl bg-red-700 text-white flex items-center justify-center text-3xl">📡</div><h1 className="text-3xl font-bold mt-4">ResQNet</h1><p className="text-sm text-gray-600">Smart Community Safety &amp; Offline SOS</p></div>}
function Login(){const [e,setE]=useState(''),[p,setP]=useState(''),[reg,setReg]=useState(false),[err,setErr]=useState(''),[info,setInfo]=useState('')
const go=fn=>async()=>{setErr('');try{await fn()}catch(x){setErr(x.message)}}
return <div className="min-h-screen bg-gray-100 p-6 max-w-sm mx-auto"><h1 className="text-3xl font-bold text-red-700 mb-1">ResQNet</h1><h2 className="text-xl text-center mt-6">{reg?'Create Account':'Welcome Back'}</h2>
<Card className="mt-4"><input aria-label="Email" className="border w-full p-3 mb-2 rounded-lg" value={e} onChange={x=>setE(x.target.value)} placeholder="Email"/>
<input aria-label="Password" type="password" className="border w-full p-3 mb-2 rounded-lg" value={p} onChange={x=>setP(x.target.value)} placeholder="Password (min 6)"/>
{err&&<p role="alert" className="text-red-700 text-sm mb-2">{err}</p>}{info&&<p className="text-sm mb-2">{info}</p>}
<button className="w-full py-3 bg-red-700 text-white rounded-lg font-bold mb-2" onClick={go(()=>reg?createUserWithEmailAndPassword(auth,e,p):signInWithEmailAndPassword(auth,e,p))}>{reg?'Register':'Log In'}</button>
<button className="w-full py-3 border rounded-lg mb-2" onClick={go(()=>signInWithPopup(auth,new GoogleAuthProvider()))}>Continue with Google</button>
<button className="w-full py-3 bg-gray-800 text-white rounded-lg mb-2" onClick={go(()=>signInAnonymously(auth))}>Emergency access (no account)</button>
<div className="flex justify-between text-sm"><button className="underline" onClick={()=>setReg(!reg)}>{reg?'I have an account':'Create an account'}</button><button className="underline" onClick={go(async()=>{await sendPasswordResetEmail(auth,e);setInfo('Reset email sent.')})}>Forgot?</button></div></Card><div className="mt-4"><Disclaimer/></div></div>}
function Home({alerts,loc,places,weather,counts,countsError,onRefreshCounts,online,err,locationError,locationBusy,onRefreshLocation}){const near=loc?alerts.filter(a=>km(loc,a)<=5):[]
return <div className="p-3 space-y-3"><div className="rounded-2xl overflow-hidden"><MapView loc={loc} alerts={alerts} places={places} height={200}/></div>
<div className="flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2 shadow-sm"><div className="min-w-0 text-sm">{locationError?<span className="text-red-700">{locationError}</span>:loc?<span className="text-green-800">Live location active</span>:<span className="text-gray-600">Getting your location…</span>}</div><button type="button" onClick={onRefreshLocation} disabled={locationBusy} aria-label="Refresh your location" title="Refresh your location" className="shrink-0 inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-800 disabled:opacity-50"><LocateFixed size={18}/>{locationBusy?'Updating…':'Update location'}</button></div>
{err&&<p role="alert" className="text-sm bg-red-100 text-red-800 p-2 rounded-xl">Cannot load shared alerts: {err}</p>}
<div className={`rounded-2xl p-4 text-white ${online?'bg-orange-600':'bg-gray-600'}`}><b className="text-lg">{online?'Online Mode Active':'Offline Mode'}</b><div className="text-sm">{online?'Alerts sync in real time':'SOS will be saved on this device and sent later'}</div></div>
<div className="grid grid-cols-3 gap-2 text-center text-sm"><Link to="/route" className="bg-white rounded-2xl p-3 shadow-sm"><RouteI className="mx-auto text-blue-600"/>Safe Route</Link>
<Card className="!p-3"><CloudSun className="mx-auto text-sky-600"/>{weather?<><b>{Math.round(weather.temp)}°C</b><div className="text-xs">{weather.text}</div></>:'Weather…'}</Card>
<div className="rounded-2xl bg-white p-3 text-center shadow-sm"><div className="flex items-center justify-center gap-1"><Users className="text-green-700" size={20}/><b>{counts?counts.online:countsError?'Unavailable':'…'}</b></div><div className="text-xs">online</div>{counts?<div className="text-xs">{counts.total} total</div>:countsError?<button type="button" onClick={onRefreshCounts} className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-blue-800"><RefreshCw size={13}/>Retry</button>:<div className="text-xs text-gray-500">Loading users…</div>}</div></div>
{weather&&(weather.rain>0||weather.code>=61)&&<p className="text-sm bg-blue-100 p-2 rounded-xl">Rain detected near you ({weather.rain} mm). Wind {weather.wind} km/h. Stay alert for flooding.</p>}
<div className="text-xs font-bold text-gray-500">ALERTS WITHIN 5 KM: {near.length}</div>
{alerts.slice(0,4).map(a=><Card key={a.id} className="border-l-4 border-red-600"><b>{a.disasterType} · {a.severity}</b> {a.verified?'':'(unverified)'}{loc&&<div className="text-sm">{km(loc,a).toFixed(1)} km away</div>}</Card>)}{alerts.length===0&&<Card>No active alerts.</Card>}<Disclaimer/></div>}
function Alerts({alerts,loc}){return <div className="p-3 space-y-2"><h2 className="font-bold text-lg">All active alerts ({alerts.length})</h2>{alerts.map(a=><Card key={a.id} className="border-l-4 border-red-600"><b>{a.disasterType} · {a.severity}</b> · {a.verified?'Verified':'Unverified'}{loc&&<div className="text-sm">{km(loc,a).toFixed(1)} km from you</div>}{a.message&&<div className="text-sm">{a.message}</div>}</Card>)}{alerts.length===0&&<Card>No active alerts.</Card>}</div>}
function Sos({user,alerts,loc,setLoc}){const [msg,setMsg]=useState(''),[type,setType]=useState('SOS')
const mine=alerts.filter(a=>a.userId===user.uid)
const sos=async()=>{try{const l=await getCurrentLocation().catch(()=>loc);if(!l)throw new Error('Unable to determine your location. Please enable location access.');setLoc(l);const r=await sendAlert(user,l,{disasterType:type});setMsg(r.queued?'Your emergency report is saved on this device and will be sent when connectivity is restored.':'SOS broadcast to other ResQNet users. Rescue is not guaranteed — call emergency services directly if you can.')}catch(x){setMsg(x.message)}}
return <div className="p-4 text-center space-y-4"><h2 className="font-bold text-lg">Emergency SOS</h2>
<div className="flex gap-2 justify-center">{['SOS','POLICE','MEDICAL','FIRE'].map(t=><button key={t} onClick={()=>setType(t)} aria-pressed={type===t} className={`px-3 py-2 rounded-full text-sm ${type===t?'bg-red-700 text-white':'bg-white'}`}>{t}</button>)}</div>
<div className="flex justify-center"><SosButton onConfirm={sos}/></div>{msg&&<p role="status" className="font-semibold">{msg}</p>}
{mine.map(a=><Card key={a.id}><b>Your SOS is ACTIVE</b> ({a.disasterType})<button className="block w-full mt-2 py-3 bg-gray-200 rounded-lg" onClick={()=>cancelAlert(a.id)}>Cancel my SOS</button></Card>)}<Disclaimer/></div>}
function RoutePage({loc,places}){const [r,setR]=useState(null),[err,setErr]=useState(''),[busy,setBusy]=useState(false)
const list=loc?[...places].sort((a,b)=>km(loc,a)-km(loc,b)).slice(0,12):[]
const nav=async z=>{setErr('');setBusy(true);try{setR({z,...await getRoute(loc,z)})}catch(x){setErr(x.message);const c=getCachedRoute();if(c)setR({z,...c,cached:true})}setBusy(false)}
return <div className="p-3 space-y-2"><div className="rounded-2xl overflow-hidden"><MapView loc={loc} places={r?[r.z]:list} route={r?.coords} height={260}/></div>
{!loc&&<Card>Enable location access to find safe places near you.</Card>}{loc&&places.length===0&&<Card>No safe places found within 5 km (or lookup unavailable).</Card>}
{r&&<Card><b>Recommended route based on available disaster reports</b> to {r.z.name}: {r.distanceKm.toFixed(1)} km, ~{Math.round(r.durationMin)} min{r.cached&&' (cached)'}. Not guaranteed safe.</Card>}
{err&&<p role="alert" className="text-red-700 text-sm">{err}</p>}{busy&&<p>Finding route…</p>}
{list.map(p=><Card key={p.id}><b>{p.name}</b> · {p.type.replace('_',' ')} · {km(loc,p).toFixed(1)} km<button className="block mt-2 px-4 py-2 bg-green-700 text-white rounded-lg" onClick={()=>nav(p)}>Route here</button></Card>)}</div>}
function Profile({user}){return <div className="p-4 space-y-3"><Card><b>{user.isAnonymous?'Guest (emergency access)':user.email}</b></Card><button className="w-full py-3 bg-gray-200 rounded-xl" onClick={()=>signOut(auth)}>Log out</button></div>}
export default function App(){const [user,setUser]=useState(firebaseConfigured?undefined:null),[splash,setSplash]=useState(true),[alerts,setAlerts]=useState([]),[zones,setZones]=useState([]),[osm,setOsm]=useState([]),[loc,setLoc]=useState(null),[weather,setWeather]=useState(null),[counts,setCounts]=useState(null),[countsError,setCountsError]=useState(''),[countAttempt,setCountAttempt]=useState(0),[locationError,setLocationError]=useState(''),[locationBusy,setLocationBusy]=useState(false),[err,setErr]=useState(''),online=useOnline()
useEffect(()=>{const t=setTimeout(()=>setSplash(false),1200);return()=>clearTimeout(t)},[])
useEffect(()=>auth?onAuthStateChanged(auth,setUser):undefined,[])
useEffect(()=>{if(!user)return;let watchId;if('geolocation' in navigator){watchId=watchLocation(position=>{setLoc(position);setLocationError('')},error=>setLocationError(error.message))}else setLocationError('Geolocation is not supported on this browser.');flushQueue();const u=[listenActiveAlerts(setAlerts,setErr),listenSafeZones(setZones),startPresence(user.uid)];return()=>{if(watchId!==undefined)stopWatchingLocation(watchId);u.forEach(f=>f())}},[user])
useEffect(()=>{if(!user)return;setCounts(null);setCountsError('');return listenUserCounts(setCounts,error=>setCountsError(error.message))},[user,countAttempt])
const refreshLocation=async()=>{setLocationBusy(true);try{const position=await getCurrentLocation();setLoc(position);setLocationError('')}catch(error){setLocationError(error.message)}finally{setLocationBusy(false)}}
useEffect(()=>{if(!loc)return;fetchWeather(loc.latitude,loc.longitude).then(setWeather);fetchSafePlaces(loc.latitude,loc.longitude).then(setOsm)},[loc?.latitude?.toFixed(2),loc?.longitude?.toFixed(2)])
if(splash||user===undefined)return <Splash/>
if(!firebaseConfigured)return <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center"><div className="max-w-lg bg-white p-6 shadow-sm"><h1 className="text-2xl font-bold text-red-700">Firebase setup required</h1><p className="mt-3">The app cannot start because its Firebase settings are missing. Copy the Firebase web app values into the six variables in <code>.env</code>, then restart the dev server.</p><p className="mt-3 text-sm text-gray-600">See <code>.env.example</code> and the Firebase console setup steps in <code>README.md</code>.</p></div></div>
if(!user)return <Login/>
const places=[...osm,...zones.filter(z=>z.latitude!=null)]
const tab=({isActive})=>`flex-1 py-3 text-center text-xs flex flex-col items-center ${isActive?'font-bold text-red-700':'text-gray-600'}`
return <div className="min-h-screen bg-gray-100 pb-20 max-w-xl mx-auto"><header className="flex justify-between p-3 bg-white shadow-sm"><b className="text-red-700 text-xl">ResQNet</b><span className="text-sm">{online?'🟢 Online':'🟠 Offline'}</span></header>
<Routes><Route path="/" element={<Home alerts={alerts} loc={loc} places={places} weather={weather} counts={counts} countsError={countsError} onRefreshCounts={()=>setCountAttempt(value=>value+1)} online={online} err={err} locationError={locationError} locationBusy={locationBusy} onRefreshLocation={refreshLocation}/>}/><Route path="/alerts" element={<Alerts alerts={alerts} loc={loc}/>}/><Route path="/sos" element={<Sos user={user} alerts={alerts} loc={loc} setLoc={setLoc}/>}/><Route path="/route" element={<RoutePage loc={loc} places={places}/>}/><Route path="/profile" element={<Profile user={user}/>}/><Route path="*" element={<Navigate to="/"/>}/></Routes>
<nav aria-label="Main" className="fixed bottom-0 inset-x-0 max-w-xl mx-auto flex bg-white border-t z-[1000]"><NavLink to="/" className={tab}><HomeI size={20}/>Home</NavLink><NavLink to="/alerts" className={tab}><TriangleAlert size={20}/>Alerts</NavLink><NavLink to="/sos" className={tab}><Siren size={20}/>SOS</NavLink><NavLink to="/profile" className={tab}><User size={20}/>Profile</NavLink></nav></div>}
