(() => {
  const field = document.querySelector('.starfield');
  const motion = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  if (!field) return;

  let frame = 0;
  let x = 0;
  let y = 0;

  function reset() {
    cancelAnimationFrame(frame);
    frame = 0;
    field.style.removeProperty('--stars-x');
    field.style.removeProperty('--stars-y');
  }

  window.addEventListener('pointermove', event => {
    if (!motion.matches || event.pointerType !== 'mouse') return;
    x = event.clientX;
    y = event.clientY;
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      field.style.setProperty('--stars-x', (x / innerWidth - .5) * 16 + 'px');
      field.style.setProperty('--stars-y', (y / innerHeight - .5) * 14 + 'px');
    });
  }, {passive: true});

  document.documentElement.addEventListener('pointerleave', reset);
  motion.addEventListener('change', reset);
})();
