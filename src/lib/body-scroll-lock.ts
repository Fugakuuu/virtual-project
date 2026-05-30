/**
 * Ref-counted document.body scroll lock. Multiple consumers (e.g. two modals)
 * can lock simultaneously; overflow is restored only after the last release,
 * avoiding a race where one modal unmounting re-enables scroll behind another.
 */
let lockCount = 0;
let preservedOverflow = "";

export function lockBodyScroll(): () => void {
  if (typeof document === "undefined") {
    return () => {};
  }

  if (lockCount === 0) {
    preservedOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }
  lockCount += 1;

  return () => {
    lockCount -= 1;
    if (lockCount <= 0) {
      lockCount = 0;
      document.body.style.overflow = preservedOverflow;
    }
  };
}
