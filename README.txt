GitHub Pages 배포용 정리본

1) 이 폴더 안의 파일들을 GitHub 저장소 루트에 업로드하세요.
   index.html / style.css / game.js / engine.mjs / audio.mjs / assets / .nojekyll

2) GitHub 저장소 > Settings > Pages
   Source: Deploy from a branch
   Branch: main
   Folder: / (root)
   Save

3) 기존 저장소에 dist 폴더가 있었다면, 이 정리본에서는 dist가 필요 없습니다.

에셋 경로는 ./assets/*.png 와 ./assets/degraded-signal.mp3 로 유지되어
프로젝트 사이트 경로(<user>.github.io/<repo>/)에서도 정상 동작하도록 되어 있습니다.
