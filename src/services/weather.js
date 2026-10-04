// Open-Meteo: free, no API key.
export const wmo=c=>c===0?'Clear sky':c<=3?'Partly cloudy':c<=48?'Fog':c<=67?'Rain':c<=77?'Snow':c<=82?'Rain showers':'Thunderstorm'
export async function fetchWeather(lat,lng){try{const r=await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,precipitation,weather_code,wind_speed_10m`)
if(!r.ok)throw new Error();const c=(await r.json()).current;const w={temp:c.temperature_2m,rain:c.precipitation,wind:c.wind_speed_10m,text:wmo(c.weather_code),code:c.weather_code}
try{localStorage.setItem('weather',JSON.stringify(w))}catch{}return w}catch{try{return JSON.parse(localStorage.getItem('weather'))}catch{return null}}}
