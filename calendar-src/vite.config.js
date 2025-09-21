import { defineConfig } from 'vite';

export default defineConfig({
  base: './',                 // 상대 경로 (어디에 배포해도 안전)
  build: {
    outDir: '../schedule',    // ✅ 레포 루트의 /schedule 폴더로 산출
    emptyOutDir: true
  }
});
