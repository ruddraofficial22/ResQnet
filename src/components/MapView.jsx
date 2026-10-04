import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import { useEffect } from 'react'
import { haversineKm } from '../utils/geo'
const dot=(c,t,pulse)=>L.divIcon({className:'',iconSize:[28,28],iconAnchor:[14,14],html:`<div style="width:28px;height:28px;border-radius:50%;background:${c};border:3px solid #fff;box-shadow:0 0 0 ${pulse?'6px '+c+'55':'1px #0003'};display:flex;align-items:center;justify-content:center;font-size:14px">${t}</div>`})
const ICONS={sos:dot('#dc2626','🆘',true),me:dot('#2563eb','',true),hospital:dot('#2563eb','H'),police:dot('#7c3aed','P'),fire_station:dot('#ea580c','F'),shelter:dot('#16a34a','S')}
function Recenter({c}){const m=useMap();useEffect(()=>{if(c)m.setView(c)},[c?.[0],c?.[1]]);return null}
function Fit({route}){const m=useMap();useEffect(()=>{if(route?.length)m.fitBounds(route,{padding:[30,30]})},[route]);return null}
export default function MapView({loc,alerts=[],places=[],route,height}){
const c=loc?[loc.latitude,loc.longitude]:[20.59,78.96]
return <div style={{height}}><MapContainer center={c} zoom={loc?14:5} style={{height:'100%'}}>
<TileLayer attribution="&copy; OpenStreetMap contributors" url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"/>
<Recenter c={loc&&c}/><Fit route={route}/>
{loc&&<Marker position={c} icon={ICONS.me}><Popup>You are here</Popup></Marker>}
{alerts.map(a=><Marker key={a.id} position={[a.latitude,a.longitude]} icon={ICONS.sos}><Popup><b>🔴 {a.disasterType} · {a.severity}</b><br/>{a.verified?'Verified':'Unverified'}{loc&&<><br/>{haversineKm(loc.latitude,loc.longitude,a.latitude,a.longitude).toFixed(1)} km away</>}</Popup></Marker>)}
{places.map(p=><Marker key={p.id} position={[p.latitude,p.longitude]} icon={ICONS[p.type]||ICONS.shelter}><Popup>{p.name}<br/>{(p.type||'').replace('_',' ')}</Popup></Marker>)}
{route&&<Polyline positions={route} color="#16a34a" weight={5}/>}</MapContainer></div>}
