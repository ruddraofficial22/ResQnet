// Finds real nearby hospitals, police, fire stations and shelters from OpenStreetMap (Overpass API, free, no key).
const URL='https://overpass-api.de/api/interpreter'
export async function fetchSafePlaces(lat,lng,radius=5000){
const q=`[out:json][timeout:20];nwr(around:${radius},${lat},${lng})[amenity~"^(hospital|police|fire_station|shelter)$"];out center 60;`
try{const r=await fetch(URL,{method:'POST',body:'data='+encodeURIComponent(q),headers:{'Content-Type':'application/x-www-form-urlencoded'}})
if(!r.ok)throw new Error();const j=await r.json()
const list=j.elements.map(e=>({id:'osm'+e.id,name:e.tags?.name||e.tags?.amenity.replace('_',' '),type:e.tags.amenity,latitude:e.lat??e.center?.lat,longitude:e.lon??e.center?.lon})).filter(p=>p.latitude!=null)
try{localStorage.setItem('safePlaces',JSON.stringify(list))}catch{}
return list}catch{try{return JSON.parse(localStorage.getItem('safePlaces'))||[]}catch{return []}}}
