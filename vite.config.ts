import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory.
  const env = loadEnv(mode, process.cwd(), '');

  // Debug logs
  console.log('Current mode:', mode);
  console.log('Environment variables loaded:', {
    VITE_API_BASE_URL: env.VITE_API_BASE_URL,
    VITE_AZURE_FUNCTION_KEY: env.VITE_AZURE_FUNCTION_KEY ? '***' : undefined,
  });

  // Ensure we have the required environment variables
  if (!env.VITE_API_BASE_URL) {
    console.error('VITE_API_BASE_URL is not defined in environment variables!');
  }

  return {
    plugins: [
      react(),
      // Bundle analyzer - only in build mode
      ...(mode === 'analyze' ? [
        visualizer({
          filename: 'dist/stats.html',
          open: true,
          gzipSize: true,
          brotliSize: true,
        })
      ] : [])
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    // Ensure environment variables are properly exposed
    define: {
      'import.meta.env.VITE_API_BASE_URL': JSON.stringify(env.VITE_API_BASE_URL || ''),
      'import.meta.env.VITE_AZURE_FUNCTION_KEY': JSON.stringify(env.VITE_AZURE_FUNCTION_KEY || ''),
      'import.meta.env.MODE': JSON.stringify(mode)
    }
  };
});
