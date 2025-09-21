import { defineConfig } from 'vite';
export default defineConfig({
  base: './',
  build: {
    outDir: '../schedule',   // ✅ 이미 있는 폴더 이름
    emptyOutDir: true        // ✅ 빌드시 폴더 내부 비움(자동 정리)
  }
});
