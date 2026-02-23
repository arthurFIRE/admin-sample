# Admin Sample (GitHub Pages)

백오피스 스타일의 샘플 화면입니다.

## 구성
- 첫 화면: 5가지 디자인 목록
- 디자인 선택 시: 해당 테마 기반의 간단 CRUD 샘플
- 데이터: 브라우저 `localStorage`에 디자인별로 저장

## 로컬 실행
```bash
python3 -m http.server 4173
# 브라우저에서 http://localhost:4173 접속
```

## GitHub Pages 배포
이 저장소에는 `.github/workflows/deploy-pages.yml`이 포함되어 있어 `main` 브랜치 push 시 자동 배포됩니다.

1. GitHub 저장소 Settings → Pages 이동
2. **Build and deployment**를 **GitHub Actions**로 설정
3. `main` 브랜치에 push
4. Actions 완료 후 배포 URL에서 확인
