import { Color, Mesh, PlaneGeometry, Raycaster, Vector2, Vector3 } from 'three';
import { Line } from 'line';
import { Target } from 'target';
import { camera, clock, renderer, scene } from 'viewport';
import './main.css';

const { searchParams: params } = new URL(location.href);
const length = parseInt(params.get('length')!, 10) || 10;
const count = parseInt(params.get('count')!, 10) || 100;
const size = length / count;

const line = new Line(Array.from({ length: count + 1 }, (_v, i) => ({
  position: new Vector3(i * size, 0, 0),
  color: (new Color()).setHSL(i / count, 0.5, 0.5),
})));
scene.add(line);

const target = new Target();
target.position.set(length, 0, 0);
scene.add(target);

const plane = new Mesh(new PlaneGeometry(10000, 10000));
const pointer = new Vector2();
const raycaster = new Raycaster();
const worldPointer = target.position.clone();
document.body.addEventListener('pointermove', ({ clientX, clientY }) => {
  raycaster.setFromCamera(pointer.set((clientX / window.innerWidth) * 2 - 1, -(clientY / window.innerHeight) * 2 + 1), camera);
  worldPointer.copy(raycaster.intersectObject(plane)[0].point);
});

renderer.setAnimationLoop(() => {
  const delta = Math.min(clock.getDelta(), 0.2);
  target.position.lerp(worldPointer, 1 - Math.exp(-10 * delta));
  line.solve(target.position);
  renderer.render(scene, camera);
});
