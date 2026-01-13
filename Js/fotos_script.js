(() => {
  const bio = document.querySelector("#bio");
  const projects = document.querySelector("#projects");
  const projectElements = document.querySelectorAll("#projects #projectgrid > div");

  if (!bio || !projects || projectElements.length === 0) return;

  const clamp = (num, a, b) => Math.max(Math.min(num, Math.max(a,b)), Math.min(a,b));

  let ticking = false;

  function getProgress() {
    const bioRect = bio.getBoundingClientRect();
    const projRect = projects.getBoundingClientRect();
    const vh = window.innerHeight || 1;

    // Start when Bio is on screen, finish when Projects hits near top
    const start = 0;                 // bioRect.top around 0 when bio reaches top
    const end = vh * 0.9;            // when projects approaches view
    // We want progress to increase as you scroll down:
    // Use bioRect.top moving negative as you scroll.
    const raw = (-bioRect.top) / end;
    return clamp(raw, 0, 1);
  }

  function update() {
    const p = getProgress();
    // smoothstep easing
    const ease = p * p * (3 - 2 * p);

    projectElements.forEach((el) => {
      const styles = window.getComputedStyle(el);

      const baseRotation = parseFloat(styles.getPropertyValue("--rotation")) || 0;
      const baseScale = parseFloat(styles.getPropertyValue("--scale")) || 1;
      const baseX = parseFloat(styles.getPropertyValue("--position-x")) || 0;
      const baseY = parseFloat(styles.getPropertyValue("--position-y")) || 0;

      const x = baseX + (0 - baseX) * ease;
      const y = baseY + (0 - baseY) * ease;
      const r = baseRotation + (0 - baseRotation) * ease;
      const s = baseScale + (1 - baseScale) * ease;

      el.style.transform = `translate(${x}px, ${y}px) scale(${s}) rotate(${r}deg)`;
    });

    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  // init
  update();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => { update(); }, { passive: true });
})();
