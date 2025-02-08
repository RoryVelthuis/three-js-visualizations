import * as THREE from 'three';

export function createScene1(scene, camera, renderer) {


    console.log('Creating scene 1');
    camera.position.z = 5;

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });

    scene.background = new THREE.Color(0x1a1a2e); // Dark blueish background
    scene.fog = new THREE.Fog(0x1a1a2e, 10, 50); // Color, near, far

    const cube = new THREE.Mesh(geometry, material);
    cube.name = "cube"
    cube.castShadow = true;
    scene.add(cube);
    console.log('Cube created and added to scene1:', cube); // Debugging

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
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
    }

    return { scene, camera, animate: scene.animate };
}