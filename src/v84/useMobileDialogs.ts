"use client";
import { useEffect, useState } from "react";

/** Native dialogs provide focus containment, Escape and focus restoration.
 * Lock the document on mobile, including Safari, and preserve the scroll position.
 * One observer owns the lock across nested menu, bag, fit and promotion dialogs.
 */
export function useMobileDialogs() {
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const media = matchMedia("(max-width: 1023px)");
    let restore: (() => void) | undefined;
    function sync() {
      setMenuOpen(Boolean(document.getElementById("menu-dialog")?.hasAttribute("open")));
      const open = media.matches && Boolean(document.querySelector("dialog[open]"));
      if (open && !restore) {
        const body = document.body, html = document.documentElement;
        const x = window.scrollX, y = window.scrollY;
        const saved = { position: body.style.position, top: body.style.top, left: body.style.left, width: body.style.width, overflow: html.style.overflow };
        body.style.position = "fixed"; body.style.top = `-${y}px`; body.style.left = `-${x}px`; body.style.width = "100%"; html.style.overflow = "hidden";
        restore = () => {
          body.style.position = saved.position; body.style.top = saved.top; body.style.left = saved.left; body.style.width = saved.width; html.style.overflow = saved.overflow;
          window.scrollTo({ left: x, top: y, behavior: "instant" });
        };
      } else if (!open && restore) { restore(); restore = undefined; }
    }
    const observer = new MutationObserver(sync);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["open"] });
    function trapFocus(event: KeyboardEvent) {
      if (event.key !== "Tab" || !media.matches) return;
      const dialogs = Array.from(document.querySelectorAll<HTMLDialogElement>("dialog[open]"));
      const dialog = document.activeElement?.closest<HTMLDialogElement>("dialog[open]") || dialogs.at(-1);
      if (!dialog) return;
      const controls = Array.from(dialog.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),summary,[tabindex]:not([tabindex="-1"])')).filter(element => element.getClientRects().length && !element.closest("[inert]"));
      const first = controls[0], last = controls.at(-1);
      if (!first || !last) { event.preventDefault(); dialog.focus(); return; }
      // Explicit cycling also includes buttons when Safari's Tab preference skips them.
      const index = controls.findIndex(element => element === document.activeElement);
      const next = index < 0 ? (event.shiftKey ? controls.length - 1 : 0) : (index + (event.shiftKey ? -1 : 1) + controls.length) % controls.length;
      event.preventDefault(); controls[next].focus({ preventScroll: false });
    }
    document.addEventListener("keydown", trapFocus);
    media.addEventListener("change", sync); sync();
    return () => { observer.disconnect(); document.removeEventListener("keydown", trapFocus); media.removeEventListener("change", sync); restore?.(); };
  }, []);
  return menuOpen;
}
