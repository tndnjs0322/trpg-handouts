// 카드 확장/하이라이트 (세로 스프레드)
const list = document.querySelector('ul');
const items = list.querySelectorAll('li');

function setIndex(e) {
  const li = e.target.closest('li');
  if (!li) return;
  const idx = [...items].indexOf(li);
  list.style.setProperty(
    'grid-template-columns',
    [...items]
      .map((_, i) => {
        items[i].dataset.active = (i === idx).toString();
        return i === idx ? '10fr' : '1fr';
      })
      .join(' ')
  );
}

list.addEventListener('pointermove', setIndex);
list.addEventListener('click', setIndex);
list.addEventListener('focus', setIndex, true);

// ========= 룬 밴드 생성 (일정 간격) =========
// 여기 3개 숫자만 바꾸면 간격/두께/시작 위치를 쉽게 조정할 수 있어요 (단위: cqh)
const BAND_THICK_CQH = 9;  // 밴드 두께
const GAP_CQH        = 7;  // 밴드 사이 간격
const START_CQH      = 8;  // 첫 밴드 시작 위치 (위쪽 여백)

const RUNES = 'ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ ᚷ ᚺ ᚾ ᛁ ᛃ ᛇ ᛈ ᛉ ᛋ ᛏ ᛒ ᛖ ᛗ ᛚ ᛜ ᛟ';
const LINE  = (RUNES + '   ').repeat(4);

document.querySelectorAll('article[data-runes="true"]').forEach((article) => {
  const box = document.createElement('div');
  box.className = 'runes';

  // 100cqh 높이 기준으로 일정 간격 배치
  const MAX_CQH = 100;
  let y = START_CQH;
  const positions = [];
  while (y + BAND_THICK_CQH < MAX_CQH - 8) { // 아래쪽 여백 조금 남김
    positions.push(y);
    y += BAND_THICK_CQH + GAP_CQH;
  }

  // 각 밴드 생성: 간격은 동일, 각도/속도만 살짝 변주
  positions.forEach((topCqh, i) => {
    const band = document.createElement('div');
    band.className = 'band';
    band.style.setProperty('--topCqh', topCqh);
    band.style.setProperty('--bandCqh', BAND_THICK_CQH);
    band.style.setProperty('--rot', `${(-24 + (i % 3) * 2).toFixed(1)}deg`);
    band.style.setProperty('--drift', `${18 + (i % 3) * 3}s`);
    band.style.setProperty('--wane', `${90 + (i % 2) * 12}s`);
    band.style.setProperty('--delay', `${-i * 1.3}s`);

    // 밴드 내부 밀도: 라인 2줄
    for (let r = 0; r < 2; r++) {
      const line = document.createElement('div');
      line.className = 'line';
      line.style.setProperty('--speedY', `${28 + r * 6}s`);
      line.style.setProperty('--offset', `${-(i * 2 + r)}s`);
      const em = document.createElement('em');
      em.textContent = LINE;
      line.appendChild(em);
      band.appendChild(line);
    }

    box.appendChild(band);
  });

  article.appendChild(box);
});

