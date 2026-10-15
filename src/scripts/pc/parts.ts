// src/scripts/pc/parts.ts
// Low-poly PC parts built from three.js primitives.
// Axes: x = side to side (glass side at +x), y = up, z = front (+z) to back. Case is centered on the origin.
import * as THREE from 'three';
import type { PartId } from './buildSequence';
import type { Vec3 } from './timeline';

/** Keep in sync with `accent` in tailwind.config.mjs */
export const ACCENT = 0xff6a00;

export const CASE = { width: 2.1, height: 4.6, depth: 4.4, wall: 0.06 };

const COLORS = {
  case: 0x1c1c1f,
  board: 0x131518,
  chip: 0x2a2c30,
  metal: 0xa3a6ab,
  copper: 0xb87333,
  stick: 0x202125,
  shroud: 0x1e1f22,
  backplate: 0x2c2d31,
  psu: 0x17181a,
  fanFrame: 0x19191b,
  blade: 0x2e2f33,
  glass: 0xb4c0cc,
};

export interface Part {
  group: THREE.Group;
  /** Every material in the part, for fading it in */
  materials: THREE.MeshStandardMaterial[];
  /** Accent materials that light up on boot */
  glows: { material: THREE.MeshStandardMaterial; mesh: THREE.Mesh }[];
  /** Fan rotors, spun around their local z axis */
  rotors: THREE.Object3D[];
}

class PartBuilder implements Part {
  group = new THREE.Group();
  materials: THREE.MeshStandardMaterial[] = [];
  glows: Part['glows'] = [];
  rotors: THREE.Object3D[] = [];

  constructor(position: Vec3) {
    this.group.position.set(...position);
  }

  mat(color: number, opts: THREE.MeshStandardMaterialParameters = {}) {
    const m = new THREE.MeshStandardMaterial({ color, roughness: 0.55, metalness: 0.35, ...opts });
    m.userData.baseOpacity = opts.opacity ?? 1;
    this.materials.push(m);
    return m;
  }

  box(size: Vec3, position: Vec3, material: THREE.Material, parent: THREE.Object3D = this.group) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
    mesh.position.set(...position);
    parent.add(mesh);
    return mesh;
  }

  /** Accent-colored strip that's dark until boot */
  glowBox(size: Vec3, position: Vec3, parent: THREE.Object3D = this.group) {
    const material = this.mat(0x24160c, { emissive: ACCENT, emissiveIntensity: 0, roughness: 0.4, metalness: 0 });
    const mesh = this.box(size, position, material, parent);
    this.glows.push({ material, mesh });
    return mesh;
  }

  /** Square fan facing +z, with an accent ring and a spinning 7-blade rotor */
  fan(size: number, position: Vec3, parent: THREE.Object3D = this.group) {
    const fan = new THREE.Group();
    fan.position.set(...position);
    parent.add(fan);

    const depth = 0.22;
    const bar = size * 0.08;
    const frame = this.mat(COLORS.fanFrame);
    for (const sign of [-1, 1]) {
      this.box([size, bar, depth], [0, sign * (size - bar) / 2, 0], frame, fan);
      this.box([bar, size, depth], [sign * (size - bar) / 2, 0, 0], frame, fan);
    }

    const ringMaterial = this.mat(0x24160c, { emissive: ACCENT, emissiveIntensity: 0, roughness: 0.4, metalness: 0 });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(size * 0.44, size * 0.02, 8, 48), ringMaterial);
    ring.position.z = depth / 2;
    fan.add(ring);
    this.glows.push({ material: ringMaterial, mesh: ring });

    const rotor = new THREE.Group();
    fan.add(rotor);
    const bladeMaterial = this.mat(COLORS.blade, { roughness: 0.7, metalness: 0.1 });
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(size * 0.15, size * 0.15, depth * 0.8, 20), bladeMaterial);
    hub.rotation.x = Math.PI / 2;
    rotor.add(hub);
    const BLADES = 7;
    for (let i = 0; i < BLADES; i++) {
      const arm = new THREE.Group();
      arm.rotation.z = (i / BLADES) * Math.PI * 2;
      rotor.add(arm);
      const blade = this.box([size * 0.27, size * 0.14, 0.015], [size * 0.27, 0, 0], bladeMaterial, arm);
      blade.rotation.x = 0.55;
    }
    this.rotors.push(rotor);
    return fan;
  }
}

function createCase() {
  const p = new PartBuilder([0, 0, 0]);
  const { width: W, height: H, depth: D, wall: T } = CASE;
  const shell = p.mat(COLORS.case, { metalness: 0.5, roughness: 0.45 });

  p.box([T, H, D], [-W / 2 + T / 2, 0, 0], shell); // solid side panel (behind the motherboard)
  p.box([W, T, D], [0, H / 2 - T / 2, 0], shell); // top
  p.box([W, T, D], [0, -H / 2 + T / 2, 0], shell); // bottom
  p.box([W, H, T], [0, 0, -D / 2 + T / 2], shell); // rear
  // Open front bezel so the intake fans show
  p.box([W, 0.28, T], [0, H / 2 - 0.14, D / 2 - T / 2], shell);
  p.box([W, 0.28, T], [0, -H / 2 + 0.14, D / 2 - T / 2], shell);
  for (const sign of [-1, 1]) p.box([0.14, H, T], [sign * (W / 2 - 0.07), 0, D / 2 - T / 2], shell);
  // Rear post on the glass side
  p.box([0.08, H, 0.08], [W / 2 - 0.04, 0, -D / 2 + 0.04], shell);
  // Feet
  for (const x of [-0.65, 0.65]) for (const z of [-1.6, 1.6]) p.box([0.32, 0.08, 0.5], [x, -H / 2 - 0.04, z], shell);
  // Front LED strip on the glass-side edge
  p.glowBox([0.05, H * 0.82, 0.03], [W / 2 - 0.07, 0, D / 2 + 0.005]);
  return p;
}

function createMotherboard() {
  const p = new PartBuilder([-0.98, 0.3, -0.55]);
  const board = p.mat(COLORS.board, { roughness: 0.75, metalness: 0.15 });
  const chip = p.mat(COLORS.chip, { metalness: 0.6, roughness: 0.4 });

  p.box([0.05, 3.3, 2.9], [0, 0, 0], board);
  p.box([0.03, 0.6, 0.6], [0.04, 0.9, -0.35], chip); // CPU socket
  p.box([0.15, 0.22, 1.1], [0.1, 1.45, -0.45], chip); // VRM heatsinks
  p.box([0.15, 1.0, 0.22], [0.1, 0.85, -1.15], chip);
  p.box([0.25, 0.8, 0.3], [0.14, 1.1, -1.3], chip); // rear I/O shroud
  for (const z of [0.3, 0.45]) p.box([0.04, 1.4, 0.05], [0.04, 0.95, z], chip); // RAM slots
  p.box([0.06, 0.4, 0.4], [0.05, -1.25, 1.0], chip); // chipset
  p.box([0.04, 0.06, 2.0], [0.04, -1.55, -0.3], chip); // spare PCIe slot
  return p;
}

function createCpu() {
  const p = new PartBuilder([-0.92, 1.2, -0.9]);
  p.box([0.06, 0.42, 0.42], [0, 0, 0], p.mat(COLORS.metal, { metalness: 0.85, roughness: 0.3 }));
  return p;
}

function createCooler() {
  const p = new PartBuilder([-0.2, 1.2, -0.9]);
  const metal = p.mat(COLORS.metal, { metalness: 0.85, roughness: 0.32 });
  const copper = p.mat(COLORS.copper, { metalness: 0.9, roughness: 0.3 });

  p.box([0.12, 0.4, 0.4], [-0.66, 0, 0], metal); // cold plate
  for (const [y, z] of [[-0.12, -0.12], [0.12, -0.12], [-0.12, 0.12], [0.12, 0.12]]) {
    const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.35, 10), copper);
    pipe.rotation.z = Math.PI / 2;
    pipe.position.set(0.015, y, z);
    p.group.add(pipe);
  }
  const FINS = 14;
  for (let i = 0; i < FINS; i++) p.box([0.02, 1.2, 0.5], [-0.5 + (i * 1.1) / (FINS - 1), 0, 0], metal);
  p.box([0.04, 1.22, 0.52], [0.62, 0, 0], p.mat(COLORS.case, { metalness: 0.5, roughness: 0.45 })); // top cap
  p.fan(1.2, [0.05, 0, 0.36]);
  return p;
}

function createRam(z: number) {
  const p = new PartBuilder([-0.77, 1.25, z]);
  p.box([0.32, 1.35, 0.06], [0, 0, 0], p.mat(COLORS.stick, { metalness: 0.6, roughness: 0.4 }));
  p.glowBox([0.06, 1.35, 0.065], [0.19, 0, 0]);
  return p;
}

function createGpu() {
  const p = new PartBuilder([-0.2, -0.3, -0.3]);
  p.box([1.4, 0.45, 3.2], [0, 0, 0], p.mat(COLORS.shroud, { metalness: 0.45, roughness: 0.5 }));
  p.box([1.4, 0.03, 3.2], [0, 0.24, 0], p.mat(COLORS.backplate, { metalness: 0.5, roughness: 0.6 }));
  p.glowBox([0.02, 0.06, 2.4], [0.71, 0.08, -0.2]);
  for (const z of [-0.85, 0.45]) {
    const fan = p.fan(1.05, [0, -0.13, z]);
    fan.rotation.x = Math.PI / 2; // face down
  }
  return p;
}

function createPsu() {
  const p = new PartBuilder([-0.15, -1.87, -1.3]);
  p.box([1.6, 0.72, 1.6], [0, 0, 0], p.mat(COLORS.psu, { metalness: 0.5, roughness: 0.5 }));
  p.box([0.01, 0.3, 0.8], [0.805, 0, 0], p.mat(COLORS.backplate, { metalness: 0.5, roughness: 0.6 }));
  return p;
}

function createCaseFan(position: Vec3, size: number) {
  const p = new PartBuilder(position);
  p.fan(size, [0, 0, 0]);
  return p;
}

function createGlass() {
  // Group origin is the front hinge so rotating around y swings it like a door
  const p = new PartBuilder([CASE.width / 2 + 0.02, 0, CASE.depth / 2]);
  const glass = p.mat(COLORS.glass, {
    transparent: true,
    opacity: 0.1,
    metalness: 0.9,
    roughness: 0.05,
    depthWrite: false,
  });
  p.box([0.02, CASE.height - 0.04, CASE.depth - 0.04], [0, 0, -CASE.depth / 2], glass);
  return p;
}

export function createParts(): Record<PartId, Part> {
  return {
    case: createCase(),
    motherboard: createMotherboard(),
    cpu: createCpu(),
    cooler: createCooler(),
    ramA: createRam(-0.25),
    ramB: createRam(-0.1),
    gpu: createGpu(),
    psu: createPsu(),
    fanFrontTop: createCaseFan([0, 1.42, 1.92], 1.36),
    fanFrontMid: createCaseFan([0, 0, 1.92], 1.36),
    fanFrontBottom: createCaseFan([0, -1.42, 1.92], 1.36),
    fanRear: createCaseFan([0, 1.25, -1.98], 1.2),
    glass: createGlass(),
  };
}
