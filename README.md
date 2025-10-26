# Kelikamerat Kartalla

A frontend for fintraffic road weather camera API. 

See for yourself: https://kelikamerat-kartalla.vercel.app

And on android: https://play.google.com/store/apps/details?id=com.kelikamerat.kartalla

## Building

### Webclient

A vite project using tailwind.

* Dependencies: `npm install`
* Build: `npm run build`
* Run: `npm run dev`

The page will be available at `localhost:5173`

### Android

Packaged as a PWA with [Capacitor](https://capacitorjs.com/)

Running locally:

* build vite project: `npm run build`
* sync vite dist to android project: `npx cap sync android`
* open in android studio: `npx cap open android`

### Backend

Code not public. Queries are routed through a minimal backend server that caches latest stuff in redis.