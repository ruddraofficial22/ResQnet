const MSG='Unable to determine your location. Please enable location access.'
export function getCurrentLocation(){return new Promise((res,rej)=>{
if(!('geolocation' in navigator))return rej(new Error('Geolocation is not supported on this browser.'))
navigator.geolocation.getCurrentPosition(p=>res({latitude:p.coords.latitude,longitude:p.coords.longitude,accuracy:p.coords.accuracy}),()=>rej(new Error(MSG)),{enableHighAccuracy:true,timeout:15000,maximumAge:10000})})}
export function watchLocation(cb,onErr){return navigator.geolocation.watchPosition(p=>cb({latitude:p.coords.latitude,longitude:p.coords.longitude}),()=>onErr&&onErr(new Error(MSG)),{enableHighAccuracy:true})}
export function stopWatchingLocation(id){navigator.geolocation.clearWatch(id)}
