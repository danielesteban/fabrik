import { CircleGeometry, Mesh, MeshBasicMaterial } from 'three';

class Target extends Mesh {
  private static readonly geometry = (() => {
    const geometry = new CircleGeometry(0.1);
    geometry.translate(0, 0, -0.001);
    return geometry;
  })();
  private static readonly material = new MeshBasicMaterial({ color: 0xFF0000 });

  constructor() {
    super(Target.geometry, Target.material);
  }
}

export { Target };
