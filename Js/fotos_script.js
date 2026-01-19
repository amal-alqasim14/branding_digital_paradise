
(() => {
  // --- DOM elements ophalen ---
  const bio = document.querySelector("#bio");
  const tiles = document.querySelectorAll("#projectgrid > div");

  // Als er iets ontbreekt: stop stilletjes (voorkomt errors in console)
  if (!bio || tiles.length === 0) return;

  /**
   * clamp01
   * Houdt een waarde altijd tussen 0 en 1.
   * (Handig voor progress-berekeningen)
   */
  const clamp01 = (v) => Math.max(0, Math.min(1, v));

  let ticking = false;

  /**
   * getProgress
   * Berekent hoe ver we zijn met scrollen (0..1).
   *
   * 0  = Bio staat net tegen de top (start animatie)
   * 1  = ongeveer 0.9 viewport verder gescrold (animatie klaar)
   */
  function getProgress() {
    const bioTop = bio.getBoundingClientRect().top;
    const vh = window.innerHeight || 1;

    // bioTop wordt negatief als je naar beneden scrollt.
    // We maken daarvan een 0..1 progress.
    return clamp01((-bioTop) / (vh * 0.9));
  }

  /**
   * smoothstep easing
   * Maakt de animatie minder "robotisch":
   * - start rustig
   * - versnelt in het midden
   * - eindigt rustig
   */
  function smoothstep(t) {
    return t * t * (3 - 2 * t);
  }

  /**
   * update
   * Past transform toe op elke tile op basis van scroll-progress.
   *
   * Interpolatie:
   *  - translate: van baseX/baseY -> 0
   *  - rotate: van baseRotation -> 0
   *  - scale: van baseScale -> 1
   */
  function update() {
    const p = getProgress();
    const ease = smoothstep(p);

    tiles.forEach((el) => {
      // Lees CSS custom properties van dit element
      const styles = getComputedStyle(el);

      const baseRotation = parseFloat(styles.getPropertyValue("--rotation")) || 0;
      const baseScale = parseFloat(styles.getPropertyValue("--scale")) || 1;
      const baseX = parseFloat(styles.getPropertyValue("--position-x")) || 0;
      const baseY = parseFloat(styles.getPropertyValue("--position-y")) || 0;

      // Interpolatie naar eindpositie
      const x = baseX * (1 - ease);
      const y = baseY * (1 - ease);
      const r = baseRotation * (1 - ease);
      const s = baseScale + (1 - baseScale) * ease;

      // 1 transform string is sneller dan meerdere style properties
      el.style.transform = `translate(${x}px, ${y}px) scale(${s}) rotate(${r}deg)`;
    });

    ticking = false;
  }

  /**
   * onScroll
   * Gebruik requestAnimationFrame zodat we nooit meer dan 1 update per frame doen.
   * Dit voorkomt jank/lag op mobiel.
   */
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }

  // --- Init: zet meteen de juiste startpositie ---
  update();

  // --- Events ---
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", update, { passive: true });
})();


/**
 * year.js
 * --------
 * Zet automatisch het huidige jaar in de footer.
 */
document.addEventListener("DOMContentLoaded", () => {
  const el = document.getElementById("year");
  if (el) el.textContent = new Date().getFullYear();
});
