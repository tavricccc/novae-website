import {
  BufferAttribute,
  BufferGeometry,
  Group,
  IcosahedronGeometry,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  OctahedronGeometry,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  TorusGeometry,
  WebGLRenderer
} from 'three';

const NODE_COUNT = 52;
const MOBILE_NODE_COUNT = 34;
const CONNECTION_STEP = 7;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

function seededNoise(index, salt) {
  const value = Math.sin(index * 91.345 + salt * 17.271) * 47453.5453;
  return value - Math.floor(value);
}

function createConstellation(count) {
  const positions = new Float32Array(count * 3);
  for (let index = 0; index < count; index += 1) {
    const normalized = count === 1 ? 0 : index / (count - 1);
    const y = 1 - normalized * 2;
    const radius = Math.sqrt(1 - y * y);
    const theta = GOLDEN_ANGLE * index;
    positions[index * 3] = Math.cos(theta) * radius * 2.25;
    positions[index * 3 + 1] = y * 2.55;
    positions[index * 3 + 2] = Math.sin(theta) * radius * 1.55;
  }
  return positions;
}

function createConnections(points) {
  const count = points.length / 3;
  const positions = [];
  const addPoint = (index) => {
    positions.push(points[index * 3], points[index * 3 + 1], points[index * 3 + 2]);
  };
  for (let index = 0; index < count; index += 1) {
    addPoint(index);
    addPoint((index + CONNECTION_STEP) % count);
  }
  return new Float32Array(positions);
}

function createDepthField(count) {
  const positions = new Float32Array(count * 3);
  for (let index = 0; index < count; index += 1) {
    positions[index * 3] = (seededNoise(index, 1) - 0.5) * 10;
    positions[index * 3 + 1] = (seededNoise(index, 2) - 0.5) * 7;
    positions[index * 3 + 2] = -1.5 - seededNoise(index, 3) * 5;
  }
  return positions;
}

function disposeScene(renderer, geometries, materials, resizeObserver) {
  renderer.setAnimationLoop(null);
  resizeObserver.disconnect();
  geometries.forEach((geometry) => geometry.dispose());
  materials.forEach((material) => material.dispose());
  renderer.dispose();
  renderer.domElement.remove();
}

export function mountHeroSpace(host) {
  if (!host || host.dataset.heroSpaceMounted === 'true') return;

  const compact = window.matchMedia('(max-width: 760px)').matches;
  const canvas = document.createElement('canvas');
  const pixelRatio = Math.min(window.devicePixelRatio || 1, compact ? 1.2 : 1.5);
  const contextOptions = {
    alpha: true,
    antialias: pixelRatio <= 1.25,
    failIfMajorPerformanceCaveat: true,
    powerPreference: 'low-power'
  };
  const context = canvas.getContext('webgl2', contextOptions)
    || canvas.getContext('webgl', contextOptions);
  if (!context) {
    host.dataset.heroSpaceUnavailable = 'true';
    return;
  }

  let renderer;
  try {
    renderer = new WebGLRenderer({
      canvas,
      context,
      alpha: true,
      antialias: pixelRatio <= 1.25,
      powerPreference: 'low-power'
    });
  } catch {
    host.dataset.heroSpaceUnavailable = 'true';
    return;
  }

  host.dataset.heroSpaceMounted = 'true';
  canvas.className = 'hero-space__canvas';
  host.append(canvas);
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(pixelRatio);

  const scene = new Scene();
  const camera = new PerspectiveCamera(38, 1, 0.1, 30);
  camera.position.set(0, 0, 7.4);

  const group = new Group();
  group.rotation.set(-0.12, -0.3, 0.08);
  scene.add(group);

  const positions = createConstellation(compact ? MOBILE_NODE_COUNT : NODE_COUNT);
  const pointGeometry = new BufferGeometry();
  pointGeometry.setAttribute('position', new BufferAttribute(positions, 3));
  const pointMaterial = new PointsMaterial({
    color: 0x8b7c9f,
    opacity: 0.68,
    size: compact ? 0.07 : 0.075,
    sizeAttenuation: true,
    transparent: true
  });
  group.add(new Points(pointGeometry, pointMaterial));

  const lineGeometry = new BufferGeometry();
  lineGeometry.setAttribute(
    'position',
    new BufferAttribute(createConnections(positions), 3)
  );
  const lineMaterial = new LineBasicMaterial({
    color: 0x7b8fa2,
    opacity: 0.12,
    transparent: true
  });
  group.add(new LineSegments(lineGeometry, lineMaterial));

  const shellGeometry = new IcosahedronGeometry(2.65, 1);
  const shellMaterial = new MeshBasicMaterial({
    color: 0xa9b6c1,
    opacity: 0.055,
    transparent: true,
    wireframe: true
  });
  group.add(new Mesh(shellGeometry, shellMaterial));

  const depthGeometry = new BufferGeometry();
  depthGeometry.setAttribute(
    'position',
    new BufferAttribute(createDepthField(compact ? 38 : 72), 3)
  );
  const depthMaterial = new PointsMaterial({
    color: 0x748b78,
    opacity: 0.24,
    size: compact ? 0.035 : 0.045,
    sizeAttenuation: true,
    transparent: true
  });
  const depthField = new Points(depthGeometry, depthMaterial);
  scene.add(depthField);

  const novaGroup = new Group();
  novaGroup.position.set(1.55, -1.05, 0.35);
  novaGroup.rotation.set(0.72, -0.35, 0.2);
  group.add(novaGroup);

  const novaGeometry = new OctahedronGeometry(compact ? 0.25 : 0.31, 0);
  const novaMaterial = new MeshBasicMaterial({
    color: 0x8b7c9f,
    opacity: 0.18,
    transparent: true,
    wireframe: true
  });
  const nova = new Mesh(novaGeometry, novaMaterial);
  novaGroup.add(nova);

  const orbitGeometry = new TorusGeometry(compact ? 0.48 : 0.58, 0.008, 4, 72);
  const orbitMaterial = new MeshBasicMaterial({
    color: 0x7b8fa2,
    opacity: 0.18,
    transparent: true
  });
  const orbit = new Mesh(orbitGeometry, orbitMaterial);
  novaGroup.add(orbit);

  const target = { x: 0, y: 0 };
  let active = true;
  let elapsed = 0;
  let previousTime = 0;

  const resize = () => {
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);
  resize();

  const render = (time) => {
    const delta = previousTime ? Math.min((time - previousTime) / 1000, 0.05) : 0;
    previousTime = time;
    elapsed += delta;
    group.rotation.y += (target.x * 0.18 + elapsed * 0.018 - group.rotation.y) * 0.025;
    group.rotation.x += (-0.12 + target.y * 0.12 - group.rotation.x) * 0.035;
    depthField.rotation.z = elapsed * -0.004;
    depthField.position.x += (target.x * -0.22 - depthField.position.x) * 0.018;
    nova.rotation.x = elapsed * 0.34;
    nova.rotation.y = elapsed * 0.46;
    orbit.rotation.x = Math.sin(elapsed * 0.32) * 0.2;
    orbit.rotation.z = elapsed * -0.11;
    renderer.render(scene, camera);
  };

  const updateLoop = () => {
    const shouldRun = active && !document.hidden;
    previousTime = 0;
    renderer.setAnimationLoop(shouldRun ? render : null);
  };

  const observer = new IntersectionObserver(
    ([entry]) => {
      active = entry.isIntersecting;
      updateLoop();
    },
    { rootMargin: '120px' }
  );
  observer.observe(host);
  document.addEventListener('visibilitychange', updateLoop);

  const interactionSurface = host.parentElement;
  const handlePointerMove = (event) => {
    if (event.pointerType === 'touch') return;
    const rect = host.getBoundingClientRect();
    target.x = (event.clientX - rect.left) / rect.width - 0.5;
    target.y = (event.clientY - rect.top) / rect.height - 0.5;
  };
  const handlePointerLeave = () => {
    target.x = 0;
    target.y = 0;
  };
  if (!compact && interactionSurface) {
    interactionSurface.addEventListener('pointermove', handlePointerMove, { passive: true });
    interactionSurface.addEventListener('pointerleave', handlePointerLeave);
  }

  updateLoop();

  window.addEventListener('pagehide', (event) => {
    if (event.persisted) return;
    observer.disconnect();
    document.removeEventListener('visibilitychange', updateLoop);
    interactionSurface?.removeEventListener('pointermove', handlePointerMove);
    interactionSurface?.removeEventListener('pointerleave', handlePointerLeave);
    disposeScene(
      renderer,
      [pointGeometry, lineGeometry, shellGeometry, depthGeometry, novaGeometry, orbitGeometry],
      [pointMaterial, lineMaterial, shellMaterial, depthMaterial, novaMaterial, orbitMaterial],
      resizeObserver
    );
  }, { once: true });
}
