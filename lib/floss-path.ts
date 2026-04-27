export type SectionBounds = { top: number; bottom: number };

export type AnchorRect = {
  top: number;
  left: number;
  right: number;
  bottom: number;
};

export type WeaveCut = { x: number; y: number; rx: number; ry: number };

export type FlossPathResult = {
  d: string;
  weaveCuts: WeaveCut[];
};

const VIEW_W = 1440;
const MARGIN_X = 64;
const LEFT_X = MARGIN_X;
const RIGHT_X = VIEW_W - MARGIN_X;
const ROW_TOLERANCE = 30;
const WEAVE_RIDE = 26;
const WEAVE_DIP = 18;

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

type Side = "L" | "R";

type AnchorRow = {
  top: number;
  bottom: number;
  cards: AnchorRect[];
};

function groupRows(anchors: AnchorRect[]): AnchorRow[] {
  if (!anchors.length) return [];
  const sorted = [...anchors].sort((a, b) => a.top - b.top);
  const rows: AnchorRow[] = [];
  for (const a of sorted) {
    const last = rows[rows.length - 1];
    if (last && Math.abs(a.top - last.top) <= ROW_TOLERANCE) {
      last.cards.push(a);
      last.bottom = Math.max(last.bottom, a.bottom);
    } else {
      rows.push({ top: a.top, bottom: a.bottom, cards: [a] });
    }
  }
  for (const r of rows) r.cards.sort((a, b) => a.left - b.left);
  return rows;
}

function descendWobble(
  d: string,
  x: number,
  fromY: number,
  toY: number,
  rand: () => number,
): string {
  const segLen = toY - fromY;
  if (segLen <= 8) return d;
  if (segLen > 520) {
    const t1 = 0.30 + rand() * 0.06;
    const t2 = 0.62 + rand() * 0.06;
    const y1 = fromY + segLen * t1;
    const y2 = fromY + segLen * t2;
    const w1 = 4 + rand() * 6;
    const w2 = -(4 + rand() * 5);
    const w3 = 3 + rand() * 4;
    return (
      d +
      ` Q ${(x + w1).toFixed(2)} ${(fromY + segLen * t1 * 0.55).toFixed(2)}, ${x.toFixed(2)} ${y1.toFixed(2)}` +
      ` Q ${(x + w2).toFixed(2)} ${((y1 + y2) / 2).toFixed(2)}, ${x.toFixed(2)} ${y2.toFixed(2)}` +
      ` Q ${(x + w3).toFixed(2)} ${((y2 + toY) / 2).toFixed(2)}, ${x.toFixed(2)} ${toY.toFixed(2)}`
    );
  }
  if (segLen > 200) {
    const sway = (3 + rand() * 5) * (rand() < 0.5 ? 1 : -1);
    return (
      d +
      ` Q ${(x + sway).toFixed(2)} ${(fromY + segLen / 2).toFixed(2)}, ${x.toFixed(2)} ${toY.toFixed(2)}`
    );
  }
  return d + ` L ${x.toFixed(2)} ${toY.toFixed(2)}`;
}

function weaveOverRow(
  d: string,
  row: AnchorRow,
  enterSide: Side,
  cursorX: number,
  cursorY: number,
  cuts: WeaveCut[],
  rand: () => number,
): { d: string; exitX: number; exitY: number; exitSide: Side } {
  const cards = enterSide === "L" ? row.cards : [...row.cards].reverse();
  const rideY = row.top - WEAVE_RIDE;
  const dipY = row.top + WEAVE_DIP;
  const tailY = row.bottom + 24;

  const firstCard = cards[0];
  const entryX =
    enterSide === "L" ? firstCard.left + 28 : firstCard.right - 28;

  const approachDx = entryX - cursorX;
  const approachDy = rideY - cursorY;
  if (Math.abs(approachDx) > 4 || Math.abs(approachDy) > 4) {
    const cp1Y = cursorY + approachDy * 0.55;
    const cp2X = entryX - approachDx * 0.25;
    d += ` C ${cursorX.toFixed(2)} ${cp1Y.toFixed(2)}, ${cp2X.toFixed(2)} ${rideY.toFixed(2)}, ${entryX.toFixed(2)} ${rideY.toFixed(2)}`;
  }

  cards.forEach((card, idx) => {
    const cardCenterX = (card.left + card.right) / 2;
    const inX = enterSide === "L" ? card.left + 28 : card.right - 28;
    const outX = enterSide === "L" ? card.right - 28 : card.left + 28;
    const sway = (rand() - 0.5) * 8;

    d += ` C ${(inX + (cardCenterX - inX) * 0.4).toFixed(2)} ${(rideY - 4).toFixed(2)}, ${(cardCenterX - sway).toFixed(2)} ${(dipY + 6).toFixed(2)}, ${cardCenterX.toFixed(2)} ${dipY.toFixed(2)}`;
    cuts.push({
      x: cardCenterX,
      y: dipY,
      rx: (card.right - card.left) * 0.42,
      ry: 22,
    });
    d += ` C ${(cardCenterX + sway).toFixed(2)} ${(dipY + 6).toFixed(2)}, ${(outX - (cardCenterX - inX) * 0.4).toFixed(2)} ${(rideY - 4).toFixed(2)}, ${outX.toFixed(2)} ${rideY.toFixed(2)}`;

    if (idx < cards.length - 1) {
      const nextCard = cards[idx + 1];
      const nextInX =
        enterSide === "L" ? nextCard.left + 28 : nextCard.right - 28;
      const midX = (outX + nextInX) / 2;
      const peakY = rideY - 6;
      d += ` C ${(outX + (midX - outX) * 0.5).toFixed(2)} ${peakY.toFixed(2)}, ${(nextInX - (nextInX - midX) * 0.5).toFixed(2)} ${peakY.toFixed(2)}, ${nextInX.toFixed(2)} ${rideY.toFixed(2)}`;
    }
  });

  const lastCard = cards[cards.length - 1];
  const lastOutX =
    enterSide === "L" ? lastCard.right - 28 : lastCard.left + 28;
  const exitX = enterSide === "L" ? RIGHT_X : LEFT_X;
  const exitDx = exitX - lastOutX;
  d += ` C ${(lastOutX + exitDx * 0.4).toFixed(2)} ${rideY.toFixed(2)}, ${(exitX - exitDx * 0.15).toFixed(2)} ${(rideY + (tailY - rideY) * 0.55).toFixed(2)}, ${exitX.toFixed(2)} ${tailY.toFixed(2)}`;

  return {
    d,
    exitX,
    exitY: tailY,
    exitSide: enterSide === "L" ? "R" : "L",
  };
}

export function buildFlossPath(
  sections: SectionBounds[],
  anchors: AnchorRect[] = [],
): FlossPathResult {
  if (!sections.length) return { d: "", weaveCuts: [] };

  const seed =
    Math.floor((sections[0].top + 1) * 31) ^ (sections.length * 7919);
  const rand = mulberry32(seed);

  const rows = groupRows(anchors);
  const cuts: WeaveCut[] = [];

  const totalBottom = sections[sections.length - 1].bottom;
  let side: Side = rand() < 0.5 ? "L" : "R";
  let cursorX = side === "L" ? LEFT_X : RIGHT_X;
  let cursorY = sections[0].top + 80;

  let d = `M ${cursorX.toFixed(2)} ${cursorY.toFixed(2)}`;

  for (const row of rows) {
    const targetY = row.top - WEAVE_RIDE - 60;
    if (targetY > cursorY + 20) {
      d = descendWobble(d, cursorX, cursorY, targetY, rand);
      cursorY = targetY;
    }

    const woven = weaveOverRow(d, row, side, cursorX, cursorY, cuts, rand);
    d = woven.d;
    cursorX = woven.exitX;
    cursorY = woven.exitY;
    side = woven.exitSide;
  }

  const tailY = totalBottom - 60;
  if (tailY > cursorY + 20) {
    d = descendWobble(d, cursorX, cursorY, tailY, rand);
  }

  return { d, weaveCuts: cuts };
}
