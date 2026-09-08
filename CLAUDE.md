# CLAUDE.md

이 파일은 Claude Code가 이 리포에서 작업할 때 참고하는 안내서다.

## Project Overview

부서별 임직원 연락처를 관리하는 모바일 우선 조직 디렉토리 PWA. 서버 없이 정적 파일만으로 동작하며 모든 데이터는 브라우저 `localStorage`에만 저장된다.

## Tech Stack

- 단일 HTML + 인라인 JS/CSS (`index.html`)
- PWA (서비스워커 `service-worker.js`, 캐시명 `grooveplay-org-v7`)
- 외부: cdn.jsdelivr.net (폰트/라이브러리) — 서비스워커가 이 오리진만 추가로 캐시
- 백업/복원 형식: JSON (외부 라이브러리 불필요)

## Development Commands

```bash
python3 -m http.server 8000    # 로컬 확인 (SW 때문에 localhost/HTTPS 필요)
```

## Project Structure

- `index.html` — 앱 전체 (HTML+CSS+JS 단일 파일)
- `manifest.webmanifest` — PWA 매니페스트
- `service-worker.js` — 오프라인 캐싱 (앱 자산 + jsdelivr만 허용)
- `icon-*.png`, `apple-touch-icon.png` — 아이콘
- `CNAME` — GitHub Pages 커스텀 도메인

## Notes for Claude

- 데이터는 **localStorage에만** 저장. 서버 전송/DB 없음. 서버 로직 추가하지 말 것.
- 저장소의 인명/전화번호는 모두 가상 샘플 데이터. 실제 데이터로 만든 `.xlsx` 등은 커밋 금지(`.gitignore` 참조).
- 백업 포맷은 XLSX가 아니라 **JSON** — 백신 오탐 회피 목적. 그대로 유지.
- `service-worker.js` 수정 시 `CACHE` 상수 버전 올려야 갱신됨.
- 관련 프로젝트: `orgchart` (같은 조직 도메인이지만 목적이 다름 — 이쪽은 연락처, 저쪽은 도식). 코드 공유하지 말 것.
