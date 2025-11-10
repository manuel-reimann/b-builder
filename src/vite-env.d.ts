/// <reference types="vite/client" />
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  console.log("Loaded ENV:", env); // optional zur Prüfung

  return {
    define: {
      "process.env": env,
    },
    // deine bestehende config hier
  };
});
