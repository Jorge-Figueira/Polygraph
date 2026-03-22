import * as THREE from "three";

export function createAxes(size = 10): THREE.Group {
  const group = new THREE.Group();
  const material = (color: number) => new THREE.LineBasicMaterial({ color });

  const xGeom = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-size, 0, 0), new THREE.Vector3(size, 0, 0)]);
  const yGeom = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, -size, 0), new THREE.Vector3(0, size, 0)]);
  const zGeom = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, -size), new THREE.Vector3(0, 0, size)]);

  group.add(new THREE.Line(xGeom, material(0xff0000)));
  group.add(new THREE.Line(yGeom, material(0x00ff00)));
  group.add(new THREE.Line(zGeom, material(0x0000ff)));

  return group;
}

export function createGridPlane(size = 20, divisions = 20, color = 0x888888, opacity = 0.3): THREE.GridHelper {
  const grid = new THREE.GridHelper(size, divisions, color, color);
  (grid.material as THREE.LineBasicMaterial).opacity = opacity;
  (grid.material as THREE.LineBasicMaterial).transparent = true;
  return grid;
}

export function createObject(
  type: "box" | "sphere" | "plane",
  params: Record<string, number> = {},
  options: { color?: number; opacity?: number } = {}
): THREE.Mesh {
  let geometry: THREE.BufferGeometry;
  const opacity = options.opacity ?? 1;
  const material = new THREE.MeshStandardMaterial({
    color: options.color ?? 0xffffff,
    side: THREE.DoubleSide,
    transparent: opacity < 1,
    depthWrite: false,
    opacity
  });

  switch (type) {
    case "box":
      // material.wireframe = true
      geometry = new THREE.BoxGeometry(params.width ?? 1, params.height ?? 1, params.depth ?? 1);
      break;
    case "sphere":
      geometry = new THREE.SphereGeometry(params.radius ?? 1, params.widthSegments ?? 32, params.heightSegments ?? 32);
      break;
    case "plane":
      material.depthWrite = false
      material.transparent = true
      geometry = new THREE.PlaneGeometry(params.width ?? 1, params.height ?? 1,);
      break;
    default:
      throw new Error(`Unknown type: ${type}`);
  }

  return new THREE.Mesh(geometry, material);
}

export function createTranslucentPlane(
  width = 1,
  height = 1,
  color = 0xffffff,
  opacity = 0.5
): THREE.Mesh {
  return createObject("plane", { width, height }, { color, opacity });
}

export function createAxesPlanes(
  size = 10,
  opacity = 0.15
): THREE.Group {
  const group = new THREE.Group();

  const xyPlane = createTranslucentPlane(size, size, 0xff0000, opacity);
  xyPlane.rotation.x = -Math.PI / 2;
  group.add(xyPlane);

  const xzPlane = createTranslucentPlane(size, size, 0x00ff00, opacity);
  group.add(xzPlane);

  const yzPlane = createTranslucentPlane(size, size, 0x0000ff, opacity);
  yzPlane.rotation.y = Math.PI / 2;
  group.add(yzPlane);

  return group;
}
