type Waypoint = [x: number, t: number];

const waypoints: Waypoint[] = [
  [1320, 0.015],
  [1340, 0.04],
  [1100, 0.06],
  [880, 0.085],
  [1080, 0.115],
  [1300, 0.145],
  [1080, 0.18],
  [780, 0.22],
  [1140, 0.27],
  [1300, 0.31],
  [820, 0.36],
  [320, 0.41],
  [820, 0.46],
  [1180, 0.5],
  [720, 0.55],
  [240, 0.59],
  [720, 0.63],
  [1200, 0.67],
  [820, 0.71],
  [340, 0.755],
  [900, 0.8],
  [1300, 0.84],
  [800, 0.88],
  [320, 0.915],
  [720, 0.96],
  [720, 0.995],
];

export function buildFlossPath(height: number): string {
  const pts = waypoints.map<[number, number]>(([x, t]) => [x, t * height]);
  let d = `M ${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)}`;
  for (let i = 1; i < pts.length; i++) {
    const [px, py] = pts[i - 1];
    const [cx, cy] = pts[i];
    const midY = (py + cy) / 2;
    d += ` C ${px.toFixed(2)} ${midY.toFixed(2)}, ${cx.toFixed(2)} ${midY.toFixed(2)}, ${cx.toFixed(2)} ${cy.toFixed(2)}`;
  }
  return d;
}
