import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { createAxes, createAxesPlanes, createGridPlane, createObject } from "./geometry";

export type ViewPlane = "xy" | "xz" | "yz";

export interface SceneSetup {
  scene: THREE.Scene;
  camera: THREE.Camera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls;
}

export function createScene(canvas: HTMLCanvasElement): SceneSetup {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });

  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.position.set(10, 10, 10);
  camera.lookAt(0, 0, 0);

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;

  return { scene, camera, renderer, controls };
}

const canvas = document.querySelector("canvas")!;
const { scene, renderer, controls, camera } = createScene(canvas);

scene.add(createAxes(10));
scene.add(createGridPlane(20, 20, 0x888888, 0.3));

const box = createObject("box", { width: 1, height: 1, depth: 1 }, {
  color: 0xffff00,
  edgeColor: 0xffff00,
  opacity: 0.3,
});
box.position.set(2, 0.5, 0);
scene.add(box);

const box_two = createObject("box", { width: 1, height: 1, depth: 1 }, {
  color: 0x00ffff,
  edgeColor: 0x00ffff,
  opacity: 0.3,
});
box_two.position.set(1.5, 0.5, 0);
scene.add(box_two);

scene.add(createAxesPlanes(10, 0.30));

const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
scene.add(ambientLight);

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
