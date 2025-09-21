import { defineConfig } from 'vite';

export default defineConfig({
  base: './',                 // ✅ 상대 경로 (GitHub Pages에서 경로 깨짐 방지)
  build: {
    outDir: '../schedule',    // ✅ 빌드 결과를 레포 루트의 /schedule 로 내보내기
    emptyOutDir: true         // ✅ 빌드할 때 /schedule 내부 정리 후 교체
  }
});
