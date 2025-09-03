// app.js
document.addEventListener('DOMContentLoaded', () => {
  // ===== 1) 중앙 타이틀 타자 효과 (1회 → 커서멈춤 → 페이드아웃)
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
          setTimeout(() => {
            el.classList.add('fade-out');   // 타이틀 서서히 사라짐
          }, fadeAfter);
        }, stay);
      }
    }, speed);
  }

  // ===== 2) 카드 활성 토글 (hover/focus 접근성 포함)
  const cards = document.querySelector('.cards');
  const items = Array.from(cards.querySelectorAll(':scope > li'));
  const mmMobile = window.matchMedia('(max-width: 720px)');

  function activate(index) {
    items.forEach(li => li.removeAttribute('data-active'));
    if (index == null || mmMobile.matches) {
      cards.classList.remove('is-expanded');
      return;
    }
    items[index].setAttribute('data-active', 'true');
    cards.classList.add('is-expanded');
  }

  // 마우스
  items.forEach((li, i) => {
    li.addEventListener('mouseenter', () => activate(i));
  });
  cards.addEventListener('mouseleave', () => activate(null));

  // 키보드(탭/화살표)
  items.forEach((li, i) => {
    li.setAttribute('tabindex', '0');
    li.addEventListener('focusin', () => activate(i));
    li.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const dir = e.key === 'ArrowRight' ? 1 : -1;
        let next = (i + dir + items.length) % items.length;
        items[next].focus();
        activate(next);
      }
    });
  });

  // 화면 크기 바뀌면 상태 재평가
  mmMobile.addEventListener('change', () => activate(null));

  // 초기 상태: 아무 카드도 활성화하지 않음
  activate(null);
});
