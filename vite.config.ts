import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
      manifest: {
        theme_color: "#120a8f",
        background_color: "#ffffff",
        display: "standalone",
        scope: "/",
        start_url: "/",
        name: "Elektro Spannungsfall",
        short_name: "Spannungsfall",
        icons: [
          {
            src: "pwa/icons/icon-72x72.png",
            sizes: "72x72",
            type: "image/png",
          },
          {
            src: "pwa/icons/icon-96x96.png",
            sizes: "96x96",
            type: "image/png",
          },
          {
            src: "pwa/icons/icon-128x128.png",
            sizes: "128x128",
            type: "image/png",
          },
          {
            src: "pwa/icons/icon-144x144.png",
            sizes: "144x144",
            type: "image/png",
          },
          {
            src: "pwa/icons/icon-152x152.png",
            sizes: "152x152",
            type: "image/png",
          },
          {
            src: "pwa/icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa/icons/icon-384x384.png",
            sizes: "384x384",
            type: "image/png",
          },
          {
            src: "pwa/icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
