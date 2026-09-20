const container = document.getElementById('three-canvas');

if (container) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const ambient = new THREE.AmbientLight(0xb9d8ff, 1.1);
  scene.add(ambient);

  const pointLight = new THREE.PointLight(0x7ef7d5, 2.2, 200);
  pointLight.position.set(0, 18, 18);
  scene.add(pointLight);

  const coreGroup = new THREE.Group();
  scene.add(coreGroup);

  const blueMaterial = new THREE.MeshStandardMaterial({
    color: 0x8ec8ff,
    emissive: 0x1a2f4e,
    metalness: 0.72,
    roughness: 0.28
  });

  const mintMaterial = new THREE.MeshStandardMaterial({
    color: 0x7ef7d5,
    emissive: 0x10302d,
    metalness: 0.7,
    roughness: 0.3
  });

  const particles = [];

  for (let i = 0; i < 18; i++) {
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.5 + Math.random() * 0.7, 20, 20),
      i % 2 === 0 ? blueMaterial : mintMaterial
    );

    const angle = (i / 18) * Math.PI * 2;
    const radius = 2.8 + ((i % 4) * 0.7);

    sphere.position.set(
      Math.cos(angle) * radius,
      Math.sin(angle * 2.1) * 1.5,
      Math.sin(angle) * radius
    );

    coreGroup.add(sphere);
    particles.push(sphere);
  }

  const ringOne = new THREE.Mesh(
    new THREE.TorusGeometry(3.5, 0.04, 16, 160),
    new THREE.MeshBasicMaterial({ color: 0x8ec8ff, transparent: true, opacity: 0.8 })
  );
  ringOne.rotation.x = Math.PI / 2.5;
  coreGroup.add(ringOne);

  const ringTwo = new THREE.Mesh(
    new THREE.TorusGeometry(4.6, 0.03, 16, 160),
    new THREE.MeshBasicMaterial({ color: 0x7ef7d5, transparent: true, opacity: 0.7 })
  );
  ringTwo.rotation.y = Math.PI / 2;
  coreGroup.add(ringTwo);

  camera.position.z = 10;

  let pointerX = 0;
  let pointerY = 0;

  window.addEventListener('pointermove', (event) => {
    pointerX = (event.clientX / window.innerWidth) * 2 - 1;
    pointerY = -(event.clientY / window.innerHeight) * 2 + 1;
  });

  function animate() {
    requestAnimationFrame(animate);

    coreGroup.rotation.y += 0.004;
    coreGroup.rotation.x = pointerY * 0.5;
    coreGroup.rotation.z = pointerX * 0.35;

    particles.forEach((particle, index) => {
      particle.position.y += Math.sin((performance.now() * 0.002) + index) * 0.0025;
    });

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    if (!container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}
