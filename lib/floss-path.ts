export type SectionBounds = { top: number; bottom: number };

const VIEW_W = 1440;
const MARGIN_X = 28;
const LEFT_X = MARGIN_X;
const RIGHT_X = VIEW_W - MARGIN_X;

export function buildFlossPath(sections: SectionBounds[]): string {
  if (!sections.length) return "";

  const sideX = (i: number) => (i % 2 === 0 ? RIGHT_X : LEFT_X);
  const insetFor = (s: SectionBounds) =>
    Math.min(80, Math.max(20, (s.bottom - s.top) * 0.18));

  let d = "";

  for (let i = 0; i < sections.length; i++) {
    const sec = sections[i];
    const x = sideX(i);
    const inset = insetFor(sec);
    const enterY = sec.top + inset;
    const exitY = sec.bottom - inset;

    if (i === 0) {
      d = `M ${x.toFixed(2)} ${enterY.toFixed(2)}`;
    }
    d += ` L ${x.toFixed(2)} ${exitY.toFixed(2)}`;

    if (i < sections.length - 1) {
      const nextX = sideX(i + 1);
      const nextSec = sections[i + 1];
      const nextInset = insetFor(nextSec);
      const nextEnterY = nextSec.top + nextInset;
      const cpY = (exitY + nextEnterY) / 2;
      d += ` C ${x.toFixed(2)} ${cpY.toFixed(2)}, ${nextX.toFixed(
        2,
      )} ${cpY.toFixed(2)}, ${nextX.toFixed(2)} ${nextEnterY.toFixed(2)}`;
    }
  }

  return d;
}
