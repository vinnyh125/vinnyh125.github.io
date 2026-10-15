// src/scripts/pc/scene.ts
// Renders the self-assembling PC into a container. Loaded lazily from Hero.astro.
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { BOOT_DURATION, BOOT_SPREAD, BOOT_START, SEQUENCE_END, buildSequence } from './buildSequence';
import { ACCENT, CASE, createParts, type Part } from './parts';
import { bootLevel, poseAt } from './timeline';
import { createRotationState, dragBy, endDrag, startDrag, stepRotation, yawOf } from './rotation';

export interface MountOptions {
  /** Called once, when the PC powers on */
  onBoot: () => void;
  /** Skip the build and idle sway; show the finished, booted PC */
  reducedMotion: boolean;
  /** Dev only: freeze the build at this many seconds (for screenshots) */
  freezeAt?: number;
}

const GLOW_INTENSITY = 1.7;
const INTERIOR_LIGHT_INTENSITY = 4;
const FAN_SPEED = 9; // radians per second at idle
const BASE_YAW = 0; // resting angle; the camera already sits at a three-quarter view
const FOV = 30;

export function mountPcScene(container: HTMLElement, { onBoot, reducedMotion, freezeAt }: MountOptions): () => void {
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  // No tone mapping, so the background renders exactly as the page color (#0a0a0a)
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.domElement.style.cssText = 'display:block;width:100%;height:100%';
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0a0a);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTexture;
  scene.environmentIntensity = 0.25;

  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);
  const cameraDirection = new THREE.Vector3(0.62, 0.32, 0.72).normalize();
  const lookAt = new THREE.Vector3(0, -0.1, 0);
  const cameraRight = new THREE.Vector3().crossVectors(cameraDirection.clone().negate(), new THREE.Vector3(0, 1, 0)).normalize();

  // Lights: dim ambient, cool key from the camera's upper left, faint rim from behind
  scene.add(new THREE.AmbientLight(0xffffff, 0.35));
  const key = new THREE.DirectionalLight(0xf2f5ff, 1.3);
  key.position.set(3.7, 9.9, 13.1);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x9fb4ff, 0.6);
  rim.position.set(-6, 5, -8);
  scene.add(rim);

  // PC root: rotated by drag/sway; parts animate inside it
  const pc = new THREE.Group();
  scene.add(pc);
  const interiorLight = new THREE.PointLight(ACCENT, 0, 7, 2);
  interiorLight.position.set(0.3, 0.2, 0.6);
  pc.add(interiorLight);

  const parts = createParts();
  const animated = buildSequence.map((track) => {
    const part: Part = parts[track.id];
    pc.add(part.group);
    return {
      track,
      part,
      restPosition: part.group.position.clone(),
      restRotation: part.group.rotation.clone(),
    };
  });

  // Glows light up front to back, so delay each one by how far back it sits
  pc.updateMatrixWorld(true);
  const worldPos = new THREE.Vector3();
  const glows = animated.flatMap(({ part }) =>
    part.glows.map(({ material, mesh }) => {
      const z = mesh.getWorldPosition(worldPos).z;
      return { material, delay: BOOT_SPREAD * THREE.MathUtils.clamp((CASE.depth / 2 - z) / CASE.depth, 0, 1) };
    }),
  );
  const rotors = animated.flatMap(({ part }) => part.rotors);

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.7, 0.25, 0.5);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  function resize() {
    const width = Math.max(1, container.clientWidth);
    const height = Math.max(1, container.clientHeight);
    renderer.setSize(width, height, false);
    composer.setPixelRatio(renderer.getPixelRatio());
    composer.setSize(width, height);
    camera.aspect = width / height;
    // Fit the case's bounding sphere in both directions
    const radius = Math.hypot(CASE.width, CASE.height, CASE.depth) / 2;
    const vHalf = THREE.MathUtils.degToRad(FOV / 2);
    const hHalf = Math.atan(Math.tan(vHalf) * camera.aspect);
    const distance = (radius / Math.sin(Math.min(vHalf, hHalf))) * 1.02;
    camera.position.copy(lookAt).addScaledVector(cameraDirection, distance);
    camera.lookAt(lookAt);
    camera.updateProjectionMatrix();
  }

  // --- Interaction ---
  let rotation = createRotationState();
  let pointer: { x: number; y: number } | null = null;
  let lastDrag = { x: 0, y: 0, time: 0 };
  const canvas = renderer.domElement;
  canvas.style.cursor = 'grab';
  canvas.style.touchAction = 'pan-y';

  function onPointerDown(e: PointerEvent) {
    canvas.setPointerCapture(e.pointerId);
    canvas.style.cursor = 'grabbing';
    rotation = startDrag(rotation);
    lastDrag = { x: e.clientX, y: e.clientY, time: e.timeStamp };
  }
  function onPointerMove(e: PointerEvent) {
    const rect = canvas.getBoundingClientRect();
    if (e.pointerType === 'mouse') {
      pointer = {
        x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
        y: ((e.clientY - rect.top) / rect.height) * 2 - 1,
      };
    }
    if (!rotation.dragging) return;
    const dt = (e.timeStamp - lastDrag.time) / 1000;
    // Touch only rotates horizontally so vertical swipes can still scroll the page
    const dy = e.pointerType === 'touch' ? 0 : e.clientY - lastDrag.y;
    rotation = dragBy(rotation, e.clientX - lastDrag.x, dy, dt);
    lastDrag = { x: e.clientX, y: e.clientY, time: e.timeStamp };
  }
  function onPointerUp(e: PointerEvent) {
    if (!rotation.dragging) return;
    canvas.style.cursor = 'grab';
    // Releasing after holding still shouldn't fling it
    if (e.timeStamp - lastDrag.time > 80) rotation = { ...rotation, yawVelocity: 0 };
    rotation = endDrag(rotation);
  }
  function onPointerLeave() {
    pointer = null;
  }
  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('pointercancel', onPointerUp);
  canvas.addEventListener('pointerleave', onPointerLeave);

  // --- Frame loop ---
  let elapsed = freezeAt ?? (reducedMotion ? SEQUENCE_END : 0);
  let booted = false;
  let settled = false;
  let rafId = 0;
  let lastFrame = 0;
  const yawAxis = new THREE.Vector3(0, 1, 0);
  const yawQuat = new THREE.Quaternion();
  const pitchQuat = new THREE.Quaternion();

  function applyBuild() {
    for (const { track, part, restPosition, restRotation } of animated) {
      const pose = poseAt(track, elapsed);
      part.group.visible = pose.visible;
      part.group.position.set(
        restPosition.x + pose.offset[0],
        restPosition.y + pose.offset[1],
        restPosition.z + pose.offset[2],
      );
      part.group.rotation.set(
        restRotation.x + pose.rotation[0],
        restRotation.y + pose.rotation[1],
        restRotation.z + pose.rotation[2],
      );
      for (const m of part.materials) {
        const base = m.userData.baseOpacity as number;
        m.opacity = base * pose.opacity;
        m.transparent = base < 1 || pose.opacity < 1;
      }
    }
    for (const { material, delay } of glows) {
      material.emissiveIntensity = GLOW_INTENSITY * bootLevel(elapsed, BOOT_START, BOOT_DURATION, delay);
    }
    interiorLight.intensity = INTERIOR_LIGHT_INTENSITY * bootLevel(elapsed, BOOT_START, BOOT_DURATION + BOOT_SPREAD);
    settled = elapsed >= SEQUENCE_END;
  }

  function frame(now: number) {
    rafId = requestAnimationFrame(frame);
    // Clamp so a long stall doesn't skip the build
    const dt = lastFrame ? Math.min((now - lastFrame) / 1000, 0.1) : 0;
    lastFrame = now;
    if (freezeAt === undefined) elapsed += dt;

    if (!settled) applyBuild();
    if (!booted && elapsed >= BOOT_START) {
      booted = true;
      onBoot();
    }

    if (!reducedMotion) {
      const fanSpeed = FAN_SPEED * bootLevel(elapsed, BOOT_START, BOOT_DURATION * 1.5);
      for (const rotor of rotors) rotor.rotation.z += fanSpeed * dt;
    }

    rotation = stepRotation(rotation, dt, pointer, !reducedMotion && booted);
    yawQuat.setFromAxisAngle(yawAxis, BASE_YAW + yawOf(rotation) + rotation.tiltY);
    pitchQuat.setFromAxisAngle(cameraRight, rotation.pitch + rotation.tiltX);
    pc.quaternion.multiplyQuaternions(pitchQuat, yawQuat);

    composer.render(dt);
  }

  // Only render while the hero is on screen and the tab is visible
  let onScreen = true;
  function updateRunning() {
    const shouldRun = onScreen && document.visibilityState === 'visible';
    if (shouldRun && !rafId) {
      lastFrame = 0;
      rafId = requestAnimationFrame(frame);
    } else if (!shouldRun && rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
  }
  const intersection = new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    updateRunning();
  });
  intersection.observe(container);
  document.addEventListener('visibilitychange', updateRunning);
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);

  resize();
  applyBuild();
  updateRunning();

  return function dispose() {
    cancelAnimationFrame(rafId);
    intersection.disconnect();
    resizeObserver.disconnect();
    document.removeEventListener('visibilitychange', updateRunning);
    scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) obj.geometry.dispose();
    });
    for (const { part } of animated) for (const m of part.materials) m.dispose();
    bloom.dispose();
    composer.dispose();
    envTexture.dispose();
    pmrem.dispose();
    renderer.dispose();
    canvas.remove();
  };
}
