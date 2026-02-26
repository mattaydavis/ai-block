const safeRemove = (node: HTMLElement | Element) => {
  if (node && typeof node.remove === "function") node.remove();
};
const defaultRemover = (selectors: string[] = []) => {
  if (!Array.isArray(selectors)) return;
  selectors.forEach((sel) => {
    if (typeof sel !== "string") return;
    const trimmed = sel.trim();
    if (!trimmed) return;
    try {
      const nodes = document.querySelectorAll(trimmed);
      nodes.forEach((node) => {
        safeRemove(node);
      });
    } catch (err) {
      if (typeof console !== "undefined" && console.warn) {
        console.warn("defaultRemover: invalid selector", trimmed, err);
      }
    }
  });
};

const googleAIRemover = () => {
  const h1s = Array.from(document.querySelectorAll("h1"));
  let targetDiv;
  const aiH1 = h1s?.find((ele) => ele.outerText === "AI Overview");
  if (aiH1) {
    targetDiv = aiH1;
  } else {
    const targetDiv = h1s?.[3];
  }
  const parent = targetDiv?.parentElement;
  parent && safeRemove(parent);
};

const blockElements = {
  amazon: {
    default: [".nav-flyout-rufus"],
  },
  google: {
    custom: googleAIRemover,
  },
};

export { blockElements, defaultRemover, safeRemove };
