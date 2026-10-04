// Provider: public OSRM demo server (fair-use only; no SLA). Change BASE to switch provider.
const BASE='https://router.project-osrm.org/route/v1/driving'
export async function getRoute(from,to,fetchFn=fetch){
const url=`${BASE}/${from.longitude},${from.latitude};${to.longitude},${to.latitude}?overview=full&geometries=geojson`
try{const r=await fetchFn(url);if(!r.ok)throw new Error();const j=await r.json()
if(!j.routes?.length)throw new Error()
const rt=j.routes[0];const route={distanceKm:rt.distance/1000,durationMin:rt.duration/60,coords:rt.geometry.coordinates.map(([lng,lat])=>[lat,lng])}
try{localStorage.setItem('lastRoute',JSON.stringify(route))}catch{}
return route}catch{throw new Error('Safe route service is temporarily unavailable.')}}
export function getCachedRoute(){try{return JSON.parse(localStorage.getItem('lastRoute'))}catch{return null}}
