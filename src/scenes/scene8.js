import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function createScene8(scene, camera, renderer) {

    // Clear all objects from the scene
    function clearScene() {
        while (scene.children.length > 0) {
            scene.remove(scene.children[0]);
        }
    }

    // Clear lasers when the scene is initialized or reloaded
    function clearLasers() {
        lasers.forEach(laser => scene.remove(laser));
        lasers = [];
    }

    // Create lasers
    const laserGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 32);
    const laserMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    let lasers = [];

    // Call clearScene at the beginning to ensure any existing objects are cleared
    clearScene();

    camera.position.z = 10; // Zoom out the camera
    camera.near = 0.1; // Adjust near plane
    camera.far = 1000; // Adjust far plane
    camera.updateProjectionMatrix();

    scene.background = new THREE.Color(0x000000); // Default background

    // Create a shape that looks like the letter "A"
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(1, 2);
    shape.lineTo(2, 0);
    shape.lineTo(1.5, 0);
    shape.lineTo(1, 1);
    shape.lineTo(0.5, 0);
    shape.lineTo(0, 0);

    const extrudeSettings = {
        steps: 2,
        depth: 0.2,
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.1,
        bevelSegments: 1
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    const material = new THREE.MeshStandardMaterial({ color: 0x800080 }); // Purple color
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    scene.add(mesh);

    // Position the shape at the bottom of the screen
    mesh.position.set(-5, -4, 0);

    // Add lighting
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    // Create orbs at the top to represent aliens
    const orbGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const orbMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 }); // Red color
    let orbs = [];

    function createOrbs() {
        orbs.forEach(orb => scene.remove(orb));
        orbs = [];
        for (let i = -4; i <= 4; i += 2) {
            const orb = new THREE.Mesh(orbGeometry, orbMaterial);
            orb.position.set(i, 4, 0);
            orbs.push(orb);
            scene.add(orb);
        }
    }

    createOrbs();

    function shootLaser() {
        const laser = new THREE.Mesh(laserGeometry, laserMaterial);
        laser.position.set(mesh.position.x, mesh.position.y + 1, 0);
        lasers.push(laser);
        scene.add(laser);
    }

    // Create star field
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5, sizeAttenuation: true, transparent: true });

    const starCount = 1000;
    const starPositions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
        const x = THREE.MathUtils.randFloatSpread(200);
        const y = THREE.MathUtils.randFloatSpread(200);
        const z = THREE.MathUtils.randFloatSpread(200);

        starPositions[i * 3] = x;
        starPositions[i * 3 + 1] = y;
        starPositions[i * 3 + 2] = z;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));

    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Add OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Enable damping (inertia)
    controls.dampingFactor = 0.25; // Damping factor
    controls.screenSpacePanning = false; // Disable panning
    controls.maxPolarAngle = Math.PI / 2; // Limit vertical rotation

    // Animation variables
    let direction = 1;
    let speed = 0.05;

    function checkCollision(laser, orb) {
        const laserBox = new THREE.Box3().setFromObject(laser);
        const orbBox = new THREE.Box3().setFromObject(orb);
        return laserBox.intersectsBox(orbBox);
    }

    scene.animate = () => {
        // Move the shape left to right
        mesh.position.x += direction * speed;

        // Randomize up and down movement
        mesh.position.y = -4 + Math.sin(mesh.position.x) * 0.5;

        // Reverse direction if it reaches the edge
        if (mesh.position.x > 5 || mesh.position.x < -5) {
            direction *= -1;
        }

        // Move lasers upward
        lasers.forEach((laser, laserIndex) => {
            laser.position.y += 0.1;
            if (laser.position.y > 5) {
                scene.remove(laser);
                lasers.splice(laserIndex, 1);
            } else {
                // Check for collisions with orbs
                orbs.forEach((orb, orbIndex) => {
                    if (checkCollision(laser, orb)) {
                        scene.remove(laser);
                        lasers.splice(laserIndex, 1);
                        scene.remove(orb);
                        orbs.splice(orbIndex, 1);
                    }
                });
            }
        });

        // Move stars downward to create the illusion of moving upward
        stars.geometry.attributes.position.array.forEach((value, index) => {
            if (index % 3 === 1) { // Only modify the y-coordinate
                stars.geometry.attributes.position.array[index] -= 0.02;
                if (stars.geometry.attributes.position.array[index] < -100) {
                    stars.geometry.attributes.position.array[index] = 100;
                }
            }
        });
        stars.geometry.attributes.position.needsUpdate = true;

        // Update controls
        controls.update();

        // Respawn orbs if all are gone
        if (orbs.length === 0) {
            createOrbs();
        }
    };

    // Shoot lasers at intervals
    setInterval(shootLaser, 500);

    return { scene, camera, animate: scene.animate };
}