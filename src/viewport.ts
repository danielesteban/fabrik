import {
  Clock,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three';

const viewport = document.createElement('div');
viewport.id = 'viewport';
document.body.appendChild(viewport);

export const camera = new PerspectiveCamera(60, 1, 0.1, 1000);
camera.position.z = 10;
export const clock = new Clock();
export const renderer = new WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio || 1);
viewport.appendChild(renderer.domElement);
export const scene = new Scene();

const resize = () => {
  const { innerWidth: width, innerHeight: height } = window;
  const aspect = width / height;
  renderer.setSize(width, height);
  camera.aspect = aspect;
  camera.updateProjectionMatrix();  
};
resize();

window.addEventListener('resize', resize);
document.addEventListener('visibilitychange', () => (
  document.visibilityState === 'visible' && clock.start()
));

const prevent = (e: Event) => e.preventDefault();
window.addEventListener('contextmenu', prevent);
window.addEventListener('keydown', (e) => (
  e.key === ' '
  && !['input', 'textarea', 'select'].includes((e.target as HTMLElement).tagName.toLowerCase())
  && prevent(e)
));
window.addEventListener('touchstart', prevent, { passive: false });
window.addEventListener('wheel', (e) => e.ctrlKey && prevent(e), { passive: false });
