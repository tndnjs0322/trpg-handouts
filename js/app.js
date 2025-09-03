// 클릭으로만 확장; 호버 시엔 세로 제목만 보이는 모드
document.addEventListener('DOMContentLoaded', () => {
  /* ===== 1) 중앙 타이틀 타자효과: 1회 → 잠깐 유지 → 커서 멈춤 → 페이드아웃 ===== */
  const titleEl = document.getElementById('siteTitle');
  const titleText = 'the craft of ui';
  typeOnce(titleEl, titleText, { speed: 75, stay: 1200, fadeAfter: 1800 });

  function typeOnce(el, text, { speed = 80, stay = 1000, fadeAfter = 1500 } = {}) {
    el.textContent = '';
    let i = 0;
    const itv = setInterval(() => {
      el.textContent += text[i++];
      if (i >= text.length) {
        clearInterval(itv);
        setTimeout(() => {
          el.classList.add('no-caret');     // 커서 멈춤
          setTimeout(() => el.classList.add('fade-out'), fadeAfter); // 타이틀 페이드아웃
        }, stay);
      }
    }, speed);
  }

  /* ===== 2) 카드: 클릭/키보드로만 활성화 ===== */
  const cards = document.querySelector('.cards');
  const items = Array.from(cards.querySelectorAll(':scope > li'));
  const mmMobile = window.matchMedia('(max-width: 720px)');

  function activate(index) {
    items.forEach(li => {
      li.removeAttribute('data-active');
      li.setAttribute('aria-expanded', 'false');
    });
    if (index == null || mmMobile.matches) {
      cards.classList.remove('is-expanded');
      return;
    }
    items[index].setAttribute('data-active', 'true');
    items[index].setAttribute('aria-expanded', 'true');
    cards.classList.add('is-expanded');
  }

  // 클릭으로 토글
  items.forEach((li, i) => {
    li.setAttribute('tabindex', '0');
    li.addEventListener('click', e => {
      // 확장 상태에서 CTA를 누르면 링크 동작만 하도록 버블 차단
      if (e.target.closest('.cta')) return;

      if (li.hasAttribute('data-active')) activate(null);
      else activate(i);
    });

    // 키보드 접근성: Enter/Space 토글, Esc 닫기, 좌우 이동
    li.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (li.hasAttribute('data-active')) activate(null);
        else activate(i);
      } else if (e.key === 'Escape') {
        activate(null);
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const dir = e.key === 'ArrowRight' ? 1 : -1;
        const next = (i + dir + items.length) % items.length;
        items[next].focus();
      }
    });
  });

  // 바깥 클릭 시 닫기
  document.addEventListener('click', e => {
    if (!cards.contains(e.target)) activate(null);
  });

  // 화면 크기 바뀌면 초기화(모바일 전환 등)
  mmMobile.addEventListener('change', () => activate(null));

  // 첫 진입은 모두 접힘
  activate(null);
});
