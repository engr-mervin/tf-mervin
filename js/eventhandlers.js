const handleEnter = function (event) {
  if (event.key !== "Enter") return;

  const next = Number(event.target.dataset.sequence) + 1;

  const nextEl = document.querySelector(`[data-sequence="${next.toString()}"]`);
  if (!nextEl) return;
  nextEl.focus();
};
