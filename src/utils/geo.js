export function haversineKm(a,b,c,d){const R=6371,r=x=>x*Math.PI/180,dLa=r(c-a),dLo=r(d-b)
const h=Math.sin(dLa/2)**2+Math.cos(r(a))*Math.cos(r(c))*Math.sin(dLo/2)**2;return 2*R*Math.asin(Math.sqrt(h))}
