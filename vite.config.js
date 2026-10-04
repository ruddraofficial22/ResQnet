import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
export default defineConfig({plugins:[react(),VitePWA({registerType:'autoUpdate',manifest:{name:'ResQNet',short_name:'ResQNet',description:'Real-Time Disaster Alert, Rescue Assistance and Safe Navigation System',theme_color:'#b91c1c',background_color:'#ffffff',display:'standalone',start_url:'/',icons:[{src:'/icons/icon-192.png',sizes:'192x192',type:'image/png'},{src:'/icons/icon-512.png',sizes:'512x512',type:'image/png'}]},workbox:{navigateFallback:'/index.html',runtimeCaching:[{urlPattern:/^https:\/\/[abc]\.tile\.openstreetmap\.org\/.*/,handler:'CacheFirst',options:{cacheName:'osm-tiles',expiration:{maxEntries:300,maxAgeSeconds:604800}}}]}})],test:{environment:'node'}})
