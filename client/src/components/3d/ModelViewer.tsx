"use client";

import React, { useEffect, useRef, Suspense } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface ModelViewerProps {
  modelPath: string;
  autoRotate?: boolean;
  wireframe?: boolean;
  showGrid?: boolean;
  cameraPosition?: [number, number, number];
  setControlsRef?: (ref: any) => void;
}

const ModelViewer: React.FC<ModelViewerProps> = ({
  modelPath,
  autoRotate = true,
  wireframe = false,
  showGrid = false,
  cameraPosition = [5, 5, 5],
  setControlsRef
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const gridRef = useRef<THREE.GridHelper | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // SCENE
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // CAMERA
    const camera = new THREE.PerspectiveCamera(
      45,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(...cameraPosition);

    // RENDERER
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // PRODUCTION RENDERING SETTINGS
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // LIGHTS
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0x00d2ff, 0x0a192f, 0.7);
    scene.add(hemiLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);

    const rimLight = new THREE.PointLight(0x00d2ff, 2);
    rimLight.position.set(-5, 5, -5);
    scene.add(rimLight);

    // HDR ENVIRONMENT
    const rgbeLoader = new RGBELoader();
    // Using a public placeholder HDRI for reflections
    rgbeLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/equirectangular/venice_sunset_1k.hdr', (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = texture;
      scene.environmentIntensity = 1.5;
    });

    // GRID
    const grid = new THREE.GridHelper(20, 20, 0x00d2ff, 0x112240);
    grid.visible = showGrid;
    scene.add(grid);
    gridRef.current = grid;

    // CONTROLS
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controlsRef.current = controls;
    if (setControlsRef) setControlsRef(controls);

    // MODEL LOADING (GLB)
    const loader = new GLTFLoader();
    loader.load(
      modelPath,
      (gltf) => {
        const model = gltf.scene;

        // Traverse meshes for materials and shadows
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            if (mesh.material instanceof THREE.MeshStandardMaterial) {
              mesh.material.wireframe = wireframe;
            }
          }
        });

        // Center and scale
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 3.5 / maxDim; // Adjust scale for visibility
        model.scale.set(scale, scale, scale);

        model.position.sub(center.multiplyScalar(scale));

        const group = new THREE.Group();
        group.add(model);
        scene.add(group);
        modelRef.current = group;
      },
      undefined,
      (error) => console.error('Error loading GLB:', error)
    );

    // ANIMATION LOOP
    let frameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);

      if (modelRef.current) {
        const time = clock.getElapsedTime();

        if (autoRotate) {
          modelRef.current.rotation.y += 0.005;
        }

        // Floating animation
        modelRef.current.position.y = Math.sin(time * 0.5) * 0.15;

        // Slight tilt oscillation
        modelRef.current.rotation.z = Math.sin(time * 0.3) * 0.03;
        modelRef.current.rotation.x = Math.cos(time * 0.2) * 0.02;
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current || !camera || !renderer) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);

      // DISPOSE RESOURCES
      if (modelRef.current) {
        modelRef.current.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.geometry.dispose();
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach(m => m.dispose());
            } else {
              mesh.material.dispose();
            }
          }
        });
      }

      renderer.dispose();
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, [modelPath]);

  // REACTIVE UPDATES
  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (mesh.material instanceof THREE.MeshStandardMaterial) {
            mesh.material.wireframe = wireframe;
          }
        }
      });
    }
  }, [wireframe]);

  useEffect(() => {
    if (gridRef.current) {
      gridRef.current.visible = showGrid;
    }
  }, [showGrid]);

  return <div ref={mountRef} className="w-full h-full min-h-[400px]" />;
};

const ModelViewerWrapper = (props: ModelViewerProps) => (
  <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-cyan-400 font-mono animate-pulse">Initializing Virtual Module...</div>}>
    <ModelViewer {...props} />
  </Suspense>
);

export default ModelViewerWrapper;
