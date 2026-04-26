export type SectionBounds = { top: number; bottom: number };

const VIEW_W = 1440;
const MARGIN_X = 32;
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

export function buildFlossPath(sections: SectionBounds[]): string {
  if (!sections.length) return "";

  const seed =
    Math.floor((sections[0].top + 1) * 31) ^ (sections.length * 7919);
  const rand = mulberry32(seed);

  const SHORT_H = 240;
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
    const last = sides[i - 1];
    let lastTallSide = last;
    for (let j = i - 1; j >= 0; j--) {
      if (!isShort(j)) {
        lastTallSide = sides[j];
        break;
      }
    }
    const prev = (() => {
      for (let j = i - 2; j >= 0; j--) {
        if (!isShort(j)) return sides[j];
      }
      return lastTallSide;
    })();
    const sameRun = lastTallSide === prev;
    const switchProb = sameRun ? 0.94 : 0.74;
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

  for (let i = 0; i < sections.length; i++) {
    const sec = sections[i];
    const x = sides[i];
    const h = sec.bottom - sec.top;
    const baseInset = Math.min(72, Math.max(22, h * 0.16));
    const enterInset = baseInset * (0.7 + rand() * 0.55);
    const exitInset = baseInset * (0.7 + rand() * 0.55);
    const enterY = sec.top + enterInset;
    const exitY = sec.bottom - exitInset;
    const segLen = Math.max(20, exitY - enterY);
    const inward = inwardOf(x);

    if (i === 0) d = `M ${x.toFixed(2)} ${enterY.toFixed(2)}`;

    if (segLen > 360) {
      const t1 = 0.32 + rand() * 0.12;
      const t2 = 0.62 + rand() * 0.12;
      const y1 = enterY + segLen * t1;
      const y2 = enterY + segLen * t2;
      const w1 = (10 + rand() * 22) * inward;
      const w2 = (8 + rand() * 18) * -inward;
      d += ` Q ${(x + w1).toFixed(2)} ${(enterY + segLen * (t1 * 0.5)).toFixed(2)}, ${x.toFixed(2)} ${y1.toFixed(2)}`;
      d += ` Q ${(x + w2).toFixed(2)} ${((y1 + y2) / 2).toFixed(2)}, ${x.toFixed(2)} ${y2.toFixed(2)}`;
      const w3 = (6 + rand() * 14) * inward;
      d += ` Q ${(x + w3).toFixed(2)} ${((y2 + exitY) / 2).toFixed(2)}, ${x.toFixed(2)} ${exitY.toFixed(2)}`;
    } else if (segLen > 140) {
      const sway = (6 + rand() * 16) * inward * (rand() < 0.5 ? 1 : -1);
      d += ` Q ${(x + sway).toFixed(2)} ${((enterY + exitY) / 2).toFixed(2)}, ${x.toFixed(2)} ${exitY.toFixed(2)}`;
    } else {
      d += ` L ${x.toFixed(2)} ${exitY.toFixed(2)}`;
    }

    if (i < sections.length - 1) {
      const nextX = sides[i + 1];
      const nextSec = sections[i + 1];
      const nextBaseInset = Math.min(
        72,
        Math.max(22, (nextSec.bottom - nextSec.top) * 0.16),
      );
      const nextEnterY =
        nextSec.top + nextBaseInset * (0.7 + rand() * 0.55);
      const gap = Math.max(40, nextEnterY - exitY);

      if (nextX === x) {
        const bulge = (35 + rand() * 50) * inward;
        const cp1Y = exitY + gap * (0.22 + rand() * 0.14);
        const cp2Y = exitY + gap * (0.66 + rand() * 0.14);
        d += ` C ${(x + bulge).toFixed(2)} ${cp1Y.toFixed(2)}, ${(x + bulge * 0.85).toFixed(2)} ${cp2Y.toFixed(2)}, ${x.toFixed(2)} ${nextEnterY.toFixed(2)}`;
      } else {
        const cp1Y = exitY + gap * (0.18 + rand() * 0.22);
        const cp2Y = exitY + gap * (0.58 + rand() * 0.22);
        const overshoot = rand() < 0.45 ? (12 + rand() * 28) * inward : 0;
        d += ` C ${(x + overshoot).toFixed(2)} ${cp1Y.toFixed(2)}, ${nextX.toFixed(2)} ${cp2Y.toFixed(2)}, ${nextX.toFixed(2)} ${nextEnterY.toFixed(2)}`;
      }
    }
  }

  return d;
}
