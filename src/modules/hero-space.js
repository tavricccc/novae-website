import {
  BufferAttribute,
  BufferGeometry,
  Group,
  IcosahedronGeometry,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  WebGLRenderer
} from 'three';

const NODE_COUNT = 52;
const MOBILE_NODE_COUNT = 34;
const CONNECTION_STEP = 7;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

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
  const context = canvas.getContext('webgl2', {
    alpha: true,
    antialias: pixelRatio <= 1.25,
    failIfMajorPerformanceCaveat: true,
    powerPreference: 'low-power'
  });
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
  if (!compact && interactionSurface) {
    interactionSurface.addEventListener('pointermove', (event) => {
      if (event.pointerType === 'touch') return;
      const rect = host.getBoundingClientRect();
      target.x = (event.clientX - rect.left) / rect.width - 0.5;
      target.y = (event.clientY - rect.top) / rect.height - 0.5;
    });
    interactionSurface.addEventListener('pointerleave', () => {
      target.x = 0;
      target.y = 0;
    });
  }

  updateLoop();

  window.addEventListener('pagehide', (event) => {
    if (event.persisted) return;
    observer.disconnect();
    document.removeEventListener('visibilitychange', updateLoop);
    disposeScene(
      renderer,
      [pointGeometry, lineGeometry, shellGeometry],
      [pointMaterial, lineMaterial, shellMaterial],
      resizeObserver
    );
  }, { once: true });
}
