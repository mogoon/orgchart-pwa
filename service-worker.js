/* GroovePlay 조직도 PWA service worker */
const CACHE = "grooveplay-org-v3";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-512.png",
  "./apple-touch-icon.png"
];
const XLSX_CDN = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c =>
      c.addAll(ASSETS)
        // CDN 스크립트는 실패해도 설치를 막지 않음 (온라인 시 fetch 핸들러가 다시 캐시)
        .then(() => c.add(XLSX_CDN).catch(() => {}))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// 캐시 우선, 없으면 네트워크 후 캐시에 저장
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  // 앱 자산과 xlsx CDN만 처리 — 그 외 요청은 브라우저 기본 동작
  if (url.origin !== self.location.origin && e.request.url !== XLSX_CDN) return;
  e.respondWith(
    caches.match(e.request).then(hit => {
      if (hit) return hit;
      return fetch(e.request).then(res => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
        }
        return res;
      }).catch(() => {
        // 오프라인 폴백은 페이지 이동 요청에만 적용
        if (e.request.mode === "navigate") return caches.match("./index.html");
        return Response.error();
      });
    })
  );
});
