import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createStyleImportPlugin } from 'vite-plugin-style-import';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),
  createStyleImportPlugin({
    libs: [
      {
        libraryName: 'zarm',
        esModule: true,
        resolveStyle: (name) => {
          return `zarm/es/${name}/style/css`
        }
      }
    ]
  })
  ],
  css: {
    modules: {
      localsConvention: "dashesOnly"
    },
    preprocessorOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'config': path.resolve(__dirname, 'src/config')
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:7001/api/',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),//将/api重写为空
      }
    }
  }
})
