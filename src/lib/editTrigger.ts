export function editTrigger(node: HTMLElement) {
  let timer: ReturnType<typeof setTimeout>;
  const LONG_PRESS_MS = 500;

  function start(e: TouchEvent) {
    timer = setTimeout(() => {
      node.dispatchEvent(new CustomEvent("edit"));
    }, LONG_PRESS_MS);
  }

  function cancel() {
    clearTimeout(timer);
  }

  node.addEventListener("touchstart", start, { passive: true });
  node.addEventListener("touchend", cancel);
  node.addEventListener("touchmove", cancel);

  return {
    destroy() {
      node.removeEventListener("touchstart", start);
      node.removeEventListener("touchend", cancel);
      node.removeEventListener("touchmove", cancel);
      clearTimeout(timer);
    },
  };
}
