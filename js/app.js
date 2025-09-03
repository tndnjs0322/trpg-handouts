/* =========================================================
   1) 타이핑 타이틀
   ---------------------------------------------------------
   - 바꾸고 싶은 문구는 TITLE_TEXT만 수정하면 됨
   ======================================================= */
const TITLE_TEXT = "the craft of ui";
const titleEl = document.getElementById("siteTitle");

function typeTitle(text, el, speed = 70, pauseBetween = 1200) {
  el.textContent = "";
  let i = 0;
  const tick = () => {
    el.textContent = text.slice(0, i + 1);
    i++;
    if (i < text.length) {
      setTimeout(tick, speed);
    } else {
      // 끝에서 잠깐 멈춤
      setTimeout(() => {}, pauseBetween);
    }
  };
  tick();
}
typeTitle(TITLE_TEXT, titleEl);

/* =========================================================
   2) 카드 그리드 상호작용 (세로 → 가로, 펼침)
   ---------------------------------------------------------
   - hover/focus/포인터 이동 시 해당 카드 칼럼만 크게
   - 접근성: focus 이벤트도 동일 처리
   ======================================================= */
const list = document.getElementById("cardList");
const items = Array.from(list.children);

function setColumnsByIndex(index) {
  // 각 칼럼 비율: 활성화 10fr, 나머지 1fr
  const cols = items.map((_, i) => (i === index ? "10fr" : "1fr")).join(" ");
  list.style.gridTemplateColumns = cols;
  items.forEach((li, i) => li.dataset.active = (i === index).toString());
}

function onPointerMove(e) {
  const li = e.target.closest("li");
  if (!li || !list.contains(li)) return;
  const index = items.indexOf(li);
  if (index >= 0) setColumnsByIndex(index);
}

list.addEventListener("pointermove", onPointerMove);
list.addEventListener("click", onPointerMove);
list.addEventListener("focusin", onPointerMove);
// 초기 칼럼 반영
setColumnsByIndex(items.findIndex(li => li.dataset.active === "true") || 0);

/* =========================================================
   3) 본문 문장 등장 효과 (랜덤 글리치 + 스르륵)
   ---------------------------------------------------------
   - 반투명 하이라이트(::after) 사용 안 함 → 상자(네모) 현상 제거
   - 단어 붙음 방지: 공백을 NBSP로 감싸 폭 보장
   - 각 카드에 마우스 올렸을 때 "확률적으로" 글리치
   ======================================================= */

const GLITCH_CHARS = "!<>-_\\/[]{}—=+*^?#________".split("");

// 문장을 span 단위로 감싸고, 공백은 NBSP로 유지
function prepareReveal(p) {
  if (p.dataset.prepared) return;
  const raw = p.textContent;
  p.dataset.raw = raw;
  p.textContent = "";
  const frag = document.createDocumentFragment();
  [...raw].forEach((ch) => {
    const s = document.createElement("span");
    s.className = "reveal-char";
    // 공백은 NBSP로
    s.textContent = ch === " " ? "\u00A0" : ch;
    s.dataset.ch = ch;
    frag.appendChild(s);
  });
  p.appendChild(frag);
  p.dataset.prepared = "true";
}

// 글리치 한 번 실행
function runGlitchOnce(p, duration = 900) {
  // 이미 실행 중이면 스킵
  if (p.dataset.glitching === "true") return;
  p.dataset.glitching = "true";

  const spans = Array.from(p.querySelectorAll(".reveal-char"));
  const start = performance.now();
  const original = spans.map((s) => s.dataset.ch);

  const step = (now) => {
    const t = now - start;
    const progress = Math.min(1, t / duration);

    // 앞부분부터 원래 글자, 뒷부분은 랜덤
    const cutoff = Math.floor(progress * spans.length);
    for (let i = 0; i < spans.length; i++) {
      if (i < cutoff) {
        spans[i].textContent = original[i] === " " ? "\u00A0" : original[i];
      } else {
        // 띄어쓰기는 그대로 NBSP 유지
        if (original[i] === " ") {
          spans[i].textContent = "\u00A0";
        } else {
          const r = (Math.random() * GLITCH_CHARS.length) | 0;
          spans[i].textContent = GLITCH_CHARS[r];
        }
      }
    }

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      // 마무리: 원문 복구
      spans.forEach((s, i) => (s.textContent = original[i] === " " ? "\u00A0" : original[i]));
      p.dataset.glitching = "false";
    }
  };
  requestAnimationFrame(step);
}

// 각 카드에 준비 + 진입 시 확률적으로 글리치 발동
items.forEach((li) => {
  const p = li.querySelector(".desc");
  if (!p) return;
  prepareReveal(p);

  li.addEventListener("mouseenter", () => {
    // 0.5 확률로 글리치, 아니면 부드럽게만 보이기
    if (Math.random() < 0.5) runGlitchOnce(p, 1000);
  }, { passive: true });

  // 모바일 탭 대응
  li.addEventListener("touchstart", () => {
    if (Math.random() < 0.5) runGlitchOnce(p, 1000);
  }, { passive: true });
});

