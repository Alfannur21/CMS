import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

export const Hero3DCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x140c09, 0.035);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 8;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffebd8, 0.8);
    scene.add(ambientLight);

    const goldPointLight1 = new THREE.PointLight(0xd4af37, 3, 20);
    goldPointLight1.position.set(4, 4, 4);
    scene.add(goldPointLight1);

    const warmPointLight2 = new THREE.PointLight(0xb4861c, 2, 20);
    warmPointLight2.position.set(-4, -3, 2);
    scene.add(warmPointLight2);

    const spotLight = new THREE.SpotLight(0xfff3d1, 2);
    spotLight.position.set(0, 10, 5);
    spotLight.angle = Math.PI / 4;
    spotLight.penumbra = 0.8;
    scene.add(spotLight);

    // 3D Objects: Golden Interlocking Wedding Rings
    const ringGroup = new THREE.Group();

    const ringGeometry = new THREE.TorusGeometry(1.6, 0.12, 32, 100);
    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.9,
      roughness: 0.15,
      envMapIntensity: 1.5,
    });

    const ring1 = new THREE.Mesh(ringGeometry, goldMaterial);
    ring1.rotation.x = Math.PI / 3;
    ring1.rotation.y = Math.PI / 6;
    ringGroup.add(ring1);

    const ring2 = new THREE.Mesh(ringGeometry, goldMaterial);
    ring2.position.x = 0.8;
    ring2.rotation.x = Math.PI / 2.5;
    ring2.rotation.y = -Math.PI / 5;
    ringGroup.add(ring2);

    ringGroup.position.set(0, 0.3, 0);
    scene.add(ringGroup);

    // Floating Gold Dust & Particles
    const particleCount = 180;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 16;
      positions[i + 1] = (Math.random() - 0.5) * 16;
      positions[i + 2] = (Math.random() - 0.5) * 10;
      scales[i / 3] = Math.random() * 0.12 + 0.04;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xf5be38,
      size: 0.12,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Interactive mouse / touch response
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
      mouseY = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth camera motion
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      ringGroup.rotation.y = elapsedTime * 0.35 + targetX * 0.8;
      ringGroup.rotation.x = Math.sin(elapsedTime * 0.2) * 0.15 + targetY * 0.5;
      ringGroup.position.y = Math.sin(elapsedTime * 0.8) * 0.15 + 0.2;

      // Particle floating loop
      const positionsArr = particleGeometry.attributes.position.array as Float32Array;
      for (let i = 1; i < particleCount * 3; i += 3) {
        positionsArr[i] += Math.sin(elapsedTime + i) * 0.003;
        if (positionsArr[i] > 8) positionsArr[i] = -8;
      }
      particleGeometry.attributes.position.needsUpdate = true;

      goldPointLight1.position.x = Math.sin(elapsedTime * 0.7) * 5;
      goldPointLight1.position.z = Math.cos(elapsedTime * 0.7) * 5;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 z-0 pointer-events-none w-full h-full opacity-90 overflow-hidden"
    />
  );
};
