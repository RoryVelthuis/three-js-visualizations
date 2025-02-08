import * as THREE from 'three';

export function createScene2(scene, camera, renderer) {

    camera.position.z = 5;

    const geometry = new THREE.SphereGeometry();
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });   
    
    
    scene.background = new THREE.Color(0x1a1a2e); // Dark blueish background
    scene.fog = new THREE.Fog(0x1a1a2e, 10, 50); // Color, near, far
    

    const sphere = new THREE.Mesh(geometry, material);
    sphere.castShadow = true;
    scene.add(sphere);

    // Create a smaller sphere to be parented to the main sphere
    const smallSphereGeometry1 = new THREE.SphereGeometry(0.2);
    const smallSphereMaterial1 = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const smallSphere1 = new THREE.Mesh(smallSphereGeometry1, smallSphereMaterial1);
    smallSphere1.position.set(2, 1, 1); // Position the small sphere relative to the main sphere
    smallSphere1.castShadow = true;
    // Parent the small sphere to the main sphere
    sphere.add(smallSphere1);

    // Create a smaller sphere to be parented to the main sphere
    const smallSphereGeometry2 = new THREE.SphereGeometry(0.2);
    const smallSphereMaterial2 = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const smallSphere2 = new THREE.Mesh(smallSphereGeometry2, smallSphereMaterial2);
    smallSphere2.position.set(-2, -1, -1); // Position the small sphere relative to the main sphere
    smallSphere2.castShadow = true;
    // Parent the small sphere to the main sphere
    sphere.add(smallSphere2);

    // Add a directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    directionalLight.castShadow = true; // Enable casting shadows
    scene.add(directionalLight);

    // Configure shadow properties for better quality
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;

    // Add ambient light for softer shadows
    const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
    scene.add(ambientLight);

    scene.animate =  () => {
        sphere.rotation.x += 0.01;
        sphere.rotation.y += 0.01;
    }

    return { scene, camera, animate: scene.animate };
  }
  