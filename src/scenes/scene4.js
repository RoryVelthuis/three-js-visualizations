import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';



export function createScene4(renderer) {

    // Create the scene
    const scene = new THREE.Scene();
        
    // Create a camera specific to this scene
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 10;

    // Initialize OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Enable damping (inertia)
    controls.dampingFactor = 0.05; // Damping factor
    controls.screenSpacePanning = false; // Disable panning

    // Create gtfl loader instance
    const gltfLoader = new GLTFLoader();

    // Load the Earth model
    gltfLoader.load(
      'src/models/earth.glb',
      (gltf) => {
        const model = gltf.scene;  // Get the loaded model
        scene.add(model);          // Add model to the scene
        console.log('Earth model loaded:', model);
      },
      undefined,
      (error) => {
        console.error('An error occurred while loading the Earth model:', error);
      }
    );

    // Load the moon model
    gltfLoader.load(
      'src/models/moon.glb',
      (gltf) => {
        const model = gltf.scene;  // Get the loaded model
        model.position.set(5, 0 ,0)
        scene.add(model);          // Add model to the scene
        console.log('Moon model loaded:', model);
      },
      undefined,
      (error) => {
        console.error('An error occurred while loading the Moon model:', error);
      }
    );

    //Load the hdr environment map
    const rgbeLoader = new RGBELoader();
    rgbeLoader.load('textures/skybox/space_2k.hdr', (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.background = texture;
      console.log('HDR environment map loaded and applied to the sphere');
    }, undefined, (error) => {
    console.error('An error occurred while loading the HDR environment map:', error);
    });

  // Add ambient light for softer shadows
  const ambientLight = new THREE.AmbientLight(0x404040, 10);
  scene.add(ambientLight);

  let lastFrameTime = 0;
  const targetFPS = 60;
  function animate(now) {
      const delta = now - lastFrameTime;
      if (delta < 1000 / targetFPS) {
          requestAnimationFrame(animate);
          return;
      }
      lastFrameTime = now;
      sphere.rotation.y += 0.01;
      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
  }


  return { scene, camera, animate: scene.animate };
}