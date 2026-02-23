const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

export const animateScrollToIndex = (el, index, duration = 260) => {
  const from = el.scrollLeft;
  const to = el.clientWidth * index;

  if (Math.abs(to - from) < 1) return;

  const start = performance.now();

  const tick = (now) => {
    const t = Math.min(1, (now - start) / duration);
    const eased = easeOutCubic(t);

    el.scrollLeft = from + (to - from) * eased;

    if (t < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
};