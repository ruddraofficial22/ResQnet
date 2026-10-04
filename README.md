# ResQNet
React + Vite + Tailwind + Leaflet/OSM + Firebase (Auth, Firestore). Free services: Open-Meteo (weather), Overpass/OSM (real nearby hospitals, police, fire stations, shelters), OSRM (routes).
## Firebase console (required, or SOS will not reach other users)
1. Authentication > Sign-in method: enable **Email/Password**, **Google** and **Anonymous**. Add your domain under Authentication > Settings > Authorized domains.
2. Firestore: create database, then deploy rules: `firebase deploy --only firestore` (this README's `firestore.rules` is required).
3. Copy `.env.example` to `.env` and fill the six values.
## Run
`npm install` then `npm run dev` | `npm test` | `npm run build` | `npm run firebase:deploy`
## Deploy with GitHub and Vercel
1. Push this project to a GitHub repository. `.env` and other `.env.*` files are ignored; keep real Firebase values out of GitHub and commit only `.env.example`.
2. In Vercel, choose **Add New > Project**, import the GitHub repository, and deploy. The project uses `npm run build`, outputs to `dist`, and `vercel.json` routes app paths such as `/alerts` back to the React app.
3. In the Vercel project settings, add all six variables listed in `.env.example` under **Environment Variables**. Apply them to the environments you use, then redeploy. These `VITE_` values are included in the browser app, so they are configuration, not private secrets; enforce access through Firebase Authentication, Firestore Rules, and API restrictions.
4. In Firebase Authentication's authorized domains, add the Vercel deployment domain (and any custom domain). Enable the sign-in providers and deploy Firestore rules/indexes as described above.

The included GitHub Actions workflow runs tests and a production build on pushes and pull requests. It does not require Firebase credentials.
## Safe places
Not hardcoded: found automatically within 5 km of the user from OpenStreetMap. Admin-added places can be put in the Firestore `safeZones` collection (fields: name, type, latitude, longitude).
## Disclaimer
Assistance tool only. No guarantee of alert delivery, rescue, GPS accuracy, or route safety. Call official emergency services when possible.
