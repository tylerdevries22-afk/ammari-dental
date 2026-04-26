export type SectionBounds = { top: number; bottom: number };
export type WeavePoint = { y: number; t: number };

const VIEW_W = 1440;
const MARGIN_X = 38;
const LEFT_X = MARGIN_X;
const RIGHT_X = VIEW_W - MARGIN_X;

function mulberry32(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type FlossPathResult = {
  d: string;
  weavePoints: WeavePoint[];
};

export function buildFlossPath(sections: SectionBounds[]): FlossPathResult {
  if (!sections.length) return { d: "", weavePoints: [] };

  const seed =
    Math.floor((sections[0].top + 1) * 31) ^ (sections.length * 7919);
  const rand = mulberry32(seed);

  const SHORT_H = 260;
  const isShort = (i: number) =>
    sections[i].bottom - sections[i].top < SHORT_H;

  const sides: number[] = [];
  for (let i = 0; i < sections.length; i++) {
    if (i === 0) {
      sides.push(rand() < 0.5 ? LEFT_X : RIGHT_X);
      continue;
    }
    if (isShort(i)) {
      sides.push(sides[i - 1]);
      continue;
    }
    let lastTallSide = sides[i - 1];
    for (let j = i - 1; j >= 0; j--) {
      if (!isShort(j)) {
        lastTallSide = sides[j];
        break;
      }
    }
    let prevTallSide = lastTallSide;
    for (let j = i - 2; j >= 0; j--) {
      if (!isShort(j)) {
        prevTallSide = sides[j];
        break;
      }
    }
    const sameRun = lastTallSide === prevTallSide;
    const switchProb = sameRun ? 0.85 : 0.55;
    sides.push(
      rand() < switchProb
        ? lastTallSide === RIGHT_X
          ? LEFT_X
          : RIGHT_X
        : lastTallSide,
    );
  }

  const inwardOf = (x: number) => (x === RIGHT_X ? -1 : 1);

  let d = "";
  const weavePoints: WeavePoint[] = [];

  for (let i = 0; i < sections.length; i++) {
    const sec = sections[i];
    const x = sides[i];
    const h = sec.bottom - sec.top;
    const baseInset = Math.min(110, Math.max(40, h * 0.22));
    const enterInset = baseInset * (0.85 + rand() * 0.3);
    const exitInset = baseInset * (0.85 + rand() * 0.3);
    const enterY = sec.top + enterInset;
    const exitY = sec.bottom - exitInset;
    const segLen = Math.max(20, exitY - enterY);
    const inward = inwardOf(x);

    if (i === 0) d = `M ${x.toFixed(2)} ${enterY.toFixed(2)}`;

    if (segLen > 420) {
      const t1 = 0.3 + rand() * 0.08;
      const t2 = 0.62 + rand() * 0.08;
      const y1 = enterY + segLen * t1;
      const y2 = enterY + segLen * t2;
      const w1 = (4 + rand() * 9) * inward;
      const w2 = (3 + rand() * 8) * -inward;
      const w3 = (3 + rand() * 7) * inward;
      d += ` Q ${(x + w1).toFixed(2)} ${(enterY + segLen * (t1 * 0.55)).toFixed(2)}, ${x.toFixed(2)} ${y1.toFixed(2)}`;
      d += ` Q ${(x + w2).toFixed(2)} ${((y1 + y2) / 2).toFixed(2)}, ${x.toFixed(2)} ${y2.toFixed(2)}`;
      d += ` Q ${(x + w3).toFixed(2)} ${((y2 + exitY) / 2).toFixed(2)}, ${x.toFixed(2)} ${exitY.toFixed(2)}`;
    } else if (segLen > 160) {
      const sway = (3 + rand() * 8) * (rand() < 0.5 ? 1 : -1);
      d += ` Q ${(x + sway).toFixed(2)} ${((enterY + exitY) / 2).toFixed(2)}, ${x.toFixed(2)} ${exitY.toFixed(2)}`;
    } else {
      d += ` L ${x.toFixed(2)} ${exitY.toFixed(2)}`;
    }

    if (i < sections.length - 1) {
      const nextX = sides[i + 1];
      const nextSec = sections[i + 1];
      const nextBaseInset = Math.min(
        110,
        Math.max(40, (nextSec.bottom - nextSec.top) * 0.22),
      );
      const nextEnterY =
        nextSec.top + nextBaseInset * (0.85 + rand() * 0.3);
      const gap = Math.max(60, nextEnterY - exitY);

      if (nextX === x) {
        const sway = (12 + rand() * 18) * inward;
        const cp1Y = exitY + gap * 0.32;
        const cp2Y = exitY + gap * 0.68;
        d += ` C ${(x + sway).toFixed(2)} ${cp1Y.toFixed(2)}, ${(x + sway * 0.7).toFixed(2)} ${cp2Y.toFixed(2)}, ${x.toFixed(2)} ${nextEnterY.toFixed(2)}`;
      } else {
        const cp1Y = exitY + gap * (0.42 + rand() * 0.08);
        const cp2Y = exitY + gap * (0.58 + rand() * 0.08);
        d += ` C ${x.toFixed(2)} ${cp1Y.toFixed(2)}, ${nextX.toFixed(2)} ${cp2Y.toFixed(2)}, ${nextX.toFixed(2)} ${nextEnterY.toFixed(2)}`;

        weavePoints.push({ y: (exitY + nextEnterY) / 2, t: -1 });
      }
    }
  }

  return { d, weavePoints };
}
