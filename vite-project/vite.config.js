import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vite'
export default defineConfig({
  plugins: [
    VitePWA({ injectRegister: 'script',registerType: 'autoUpdate', strategies: 'injectManifest', injectManifest: {globPatterns: ['*/.html'] }, workbox: {
      sourcemap: true
    } }) ,

  ]
 
})

// import { registerSW } from "virtual:pwa-register";

// if ("serviceWorker" in navigator) {
//   // && !/localhost/.test(window.location)) {
//   registerSW();
// }