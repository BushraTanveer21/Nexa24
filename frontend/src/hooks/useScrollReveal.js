import { useEffect } from "react";

// Watches every .reveal element currently in the DOM and adds .in-view
// once it scrolls into the viewport. Without this, .reveal elements sit
// at opacity:0 forever (see App.css) — nothing ever removes that.
export default function useScrollReveal(deps = []) {
  useEffect(() => {
    const elements = document.querySelectorAll(".reveal:not(.in-view)");

    if (!("IntersectionObserver" in window) || elements.length === 0) {
      // Fallback: just show everything if IO isn't supported.
      elements.forEach((el) => el.classList.add("in-view"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
