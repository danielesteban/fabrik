import { Color, Vector2, Vector3 } from 'three';
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry.js';

class Line extends LineSegments2 {
  static readonly material = new LineMaterial({
    alphaToCoverage: true,
    linewidth: 0.1,
    resolution: new Vector2(window.innerWidth, window.innerHeight),
    vertexColors: true,
    worldUnits: true,
  });

  private readonly colors: Float32Array;
  private readonly positions: Float32Array;
  private readonly points: { position: Vector3; color: Color; length: number; }[];

  constructor(points: { position: Vector3; color: Color }[]) {
    super(new LineSegmentsGeometry(), Line.material);
    this.colors = new Float32Array((points.length - 1) * 3 * 2);
    this.positions = new Float32Array((points.length - 1) * 3 * 2);
    this.points = points.map((point, i) => ({
      position: point.position,
      color: point.color,
      length: i === (points.length - 1) ? 0 : point.position.distanceTo(points[i + 1].position),
    }));
    this.updateColors();
    this.updatePositions();
  }

  solve(target: Vector3) {
    const { points } = this;
    points[points.length - 1].position.copy(target);
    for (let i = points.length - 1; i > 1; i--) {
      points[i - 1].position.sub(points[i].position).normalize().multiplyScalar(points[i - 1].length).add(points[i].position);
    }
    for (let i = 0, l = points.length - 1; i < l; i++) {
      points[i + 1].position.sub(points[i].position).normalize().multiplyScalar(points[i].length).add(points[i].position);
    }
    this.updatePositions();
  }

  private updateColors() {
    const { colors, geometry, points } = this;
    for (let i = 0, l = points.length - 1; i < l; i++) {
      const start = points[i];
      colors[2 * i * 3] = colors[2 * i * 3 + 3] = start.color.r;
      colors[2 * i * 3 + 1] = colors[2 * i * 3 + 4]  = start.color.g;
      colors[2 * i * 3 + 2] = colors[2 * i * 3 + 5]  = start.color.b;
    }
    geometry.setColors(colors);
  }

  private updatePositions() {
    const { geometry, points, positions } = this;
    for (let i = 0, l = points.length - 1; i < l; i++) {
      const start = points[i];
      const end = points[i + 1];
      positions[2 * i * 3] = start.position.x;
      positions[2 * i * 3 + 1] = start.position.y;
      positions[2 * i * 3 + 2] = start.position.z;
      positions[2 * i * 3 + 3] = end.position.x;
      positions[2 * i * 3 + 4] = end.position.y;
      positions[2 * i * 3 + 5] = end.position.z;
    }
    geometry.setPositions(positions);
  }
}

window.addEventListener('resize', () => (
  Line.material.resolution.set(window.innerWidth, window.innerHeight)
));

export { Line };
