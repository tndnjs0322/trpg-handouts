/**
 * 커서(타자기 느낌) 깜박임을 일정 시간 뒤 자동 제거
 * - .type-once 요소를 찾아, 2.5초 뒤 부모 제목 영역에 .caret-hide 클래스를 부여
 * - 카드가 hover로 열릴 때만 내용이 보이므로, 커서는 시선 유도만 하고 사라짐
 */
(function () {
  const TITLES = document.querySelectorAll('.type-once');
  const HIDE_AFTER_MS = 2500;

  TITLES.forEach((el) => {
    // 최초 한 번만 처리
    if (el.dataset.typeonce === "true") {
      setTimeout(() => {
        const header = el.closest('.handout__title');
        if (header) header.classList.add('caret-hide');
      }, HIDE_AFTER_MS);
      // 중복 방지
      el.dataset.typeonce = "done";
    }
  });
})();
