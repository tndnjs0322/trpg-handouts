// 커서 깜박임 제거용
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    document.querySelectorAll('.handout__title').forEach(h => {
      h.classList.add('caret-hide');
    });
  }, 2500);
});
