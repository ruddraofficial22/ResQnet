export const SEVERITIES=['LOW','MEDIUM','HIGH','CRITICAL']
export function validateAlert(a){const errs=[]
if(typeof a.latitude!=='number'||a.latitude<-90||a.latitude>90)errs.push('Invalid latitude')
if(typeof a.longitude!=='number'||a.longitude<-180||a.longitude>180)errs.push('Invalid longitude')
if(!SEVERITIES.includes(a.severity))errs.push('Invalid severity')
if((a.message||'').length>500)errs.push('Message too long')
return errs}
