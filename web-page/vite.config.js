import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import legacy from '@vitejs/plugin-legacy';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
  //   legacy({
  //   targets: ['defaults', 'not IE 11']
  // }), 
  vue()],
  build: {
    outDir: "../static",
  },
  base:"./"
})
