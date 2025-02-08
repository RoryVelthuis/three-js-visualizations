import * as THREE from 'three'
import { io } from 'socket.io-client';


export function createScene3(scene, camera, renderer) {
    const socket = io('http://localhost:3000');

    socket.on('confirmation', (message) => {
      console.log(`Recieved: ${message}`);
    });

    function sendMessage(message){
      socket.emit('message', message);
    }
    sendMessage('message from Scene 3');

    camera.position.z = 5;

    scene.background = new THREE.Color(0x1a1a2e); // Dark blueish background
    scene.fog = new THREE.Fog(0x1a1a2e, 10, 50); // Color, near, far

    // Create a group to hold the tetrahedrons
    const group = new THREE.Group();

    // Create array to store tetrahedrons
    const grid = [];
    const gridsize = 5;
    const gridspacing = 0.75;
    const tetrahedronSize = 0.25;

    // offset
    const offset = (gridsize - 1) * gridspacing / 2;

    // Create a tetrahedron geometry and material
    const geometry = new THREE.TetrahedronGeometry(tetrahedronSize);
    const material = new THREE.MeshStandardMaterial({ color: 0x4588bf});

    // Populate array
    for(let i = 0; i < gridsize; i++) {
        grid[i] = [];
        for (let j = 0; j < gridsize; j++) {
            const tetrahedron = new THREE.Mesh(geometry, material);
            tetrahedron.position.set(i * gridspacing - offset, j * gridspacing - offset, 0);
            tetrahedron.castShadow = true;
            group.add(tetrahedron);
            grid[i][j] = tetrahedron;
          }
    }

    // Add the group to the scene
    scene.add(group);

    // Add a directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Configure shadow properties for better quality
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;

    // Add ambient light for softer shadows
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    // Scene animation
    scene.animate = () => {
        // Rotate the group around its center
        group.rotation.x += 0.01;
        group.rotation.y += 0.01;
        group.rotation.z += 0.01;

        // Rotate individual tetrahedrons
        for (let i = 0; i < gridsize; i++) {
          for (let j = 0; j < gridsize; j++) {
            grid[i][j].rotation.x += 0.03;
            grid[i][j].rotation.y += 0.03;
          }
        }
      };

      return { scene, camera, animate: scene.animate };

}