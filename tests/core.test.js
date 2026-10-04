import { describe, it, expect } from 'vitest'
import { haversineKm } from '../src/utils/geo'
import { validateAlert } from '../src/utils/validate'
import { getRoute } from '../src/services/routingService'
import { countPresence } from '../src/services/presence'
describe('core',()=>{
it('haversine ~0 for same point',()=>expect(haversineKm(10,10,10,10)).toBeCloseTo(0))
it('haversine ~111km per degree lat',()=>expect(haversineKm(0,0,1,0)).toBeGreaterThan(110))
it('rejects bad coords',()=>expect(validateAlert({latitude:100,longitude:0,severity:'HIGH'}).length).toBeGreaterThan(0))
it('accepts valid alert',()=>expect(validateAlert({latitude:1,longitude:1,severity:'HIGH',message:''})).toEqual([]))
it('counts only recently active users as online',()=>expect(countPresence([{lastSeen:{toMillis:()=>900000}},{lastSeen:{toMillis:()=>850001}},{lastSeen:{toMillis:()=>849999}},{}],1000000)).toEqual({total:4,online:2}))
it('route failure gives clear error',async()=>{await expect(getRoute({latitude:0,longitude:0},{latitude:1,longitude:1},async()=>{throw new Error('x')})).rejects.toThrow('temporarily unavailable')})})
