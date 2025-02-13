import * as THREE from 'three';
import { ParametricGeometry } from 'three/examples/jsm/geometries/ParametricGeometry.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as CANNON from 'cannon-es';

export function createScene10(scene, camera, renderer) {
    // Clear all objects from the scene
    function clearScene() {
        while (scene.children.length > 0) {
            scene.remove(scene.children[0]);
        }
    }

    // Call clearScene at the beginning to ensure any existing objects are cleared
    clearScene();

    // Set up camera position
    camera.position.set(0, -20, 30); // Initial camera position (below the leaves)
    camera.lookAt(0, 10, 0); // Make the camera look up at the leaves

    // Set scene background to grey
    scene.background = new THREE.Color(0x808080);

    // Create OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update();

    // Create a hyperboloid geometry using a parametric function
    const hyperboloidGeometry = new ParametricGeometry(hyperboloid, 30, 30);
    const hyperboloidMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00, side: THREE.DoubleSide });

    // Create and position the central hyperboloid
    const centralHyperboloid = new THREE.Mesh(hyperboloidGeometry, hyperboloidMaterial);
    scene.add(centralHyperboloid);

    // Create and position additional hyperboloids
    const hyperboloids = [];
    const trails = [];
    const trailLength = 50; // Length of the trail
    const positions = [
        { x: 5, y: 10, z: 0, rotation: Math.PI / 2 },
        { x: -5, y: 10, z: 0, rotation: -Math.PI / 2 },
        { x: 0, y: 10, z: 5, rotation: Math.PI / 2 },
        { x: 0, y: 10, z: -5, rotation: -Math.PI / 2 }
    ];

    positions.forEach(pos => {
        const hyperboloid = new THREE.Mesh(hyperboloidGeometry, hyperboloidMaterial);
        hyperboloid.position.set(pos.x, pos.y, pos.z);
        hyperboloid.rotation.z = pos.rotation;
        scene.add(hyperboloid);
        hyperboloids.push(hyperboloid);

        // Create a trail for each hyperboloid
        const trailGeometry = new THREE.BufferGeometry();
        const trailPositions = new Float32Array(trailLength * 3);
        trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
        const trailMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });
        const trail = new THREE.Points(trailGeometry, trailMaterial);
        scene.add(trail);
        trails.push(trail);
    });

    // Add lighting
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    // Hyperboloid parametric function
    function hyperboloid(u, v, target) {
        const a = 1; // Control the width
        const b = 1; // Control the height
        const c = 1; // Control the depth

        const x = a * Math.cosh(v) * Math.cos(u);
        const y = b * Math.sinh(v);
        const z = a * Math.cosh(v) * Math.sin(u);

        target.set(x, y, z);
    }

    // Set up physics world
    const world = new CANNON.World();
    world.gravity.set(0, -9.82, 0);

    // Create a physics body for the central hyperboloid
    const centralBody = new CANNON.Body({
        mass: 1, // Adjust mass as needed
        shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)), // Simplified shape for physics
        position: new CANNON.Vec3(0, 10, 0) // Start above the ground
    });
    world.addBody(centralBody);

    // Create physics bodies for additional hyperboloids
    const bodies = [];
    positions.forEach(pos => {
        const body = new CANNON.Body({
            mass: 1, // Adjust mass as needed
            shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)), // Simplified shape for physics
            position: new CANNON.Vec3(pos.x, pos.y, pos.z) // Start above the ground
        });
        world.addBody(body);
        bodies.push(body);
    });

    // Create a ground plane
    const groundGeometry = new THREE.PlaneGeometry(50, 50);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa }); // Placeholder material
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = -5; // Adjust the position of the ground
    scene.add(groundMesh);

    // Create a physics body for the ground
    const groundBody = new CANNON.Body({
        mass: 0, // Static ground
        shape: new CANNON.Plane(),
        position: new CANNON.Vec3(0, -5, 0)
    });
    world.addBody(groundBody);

    // Function to map distance to color
    function mapDistanceToColor(distance) {
        const maxDistance = 100000; // Increase the maximum distance for smoother transitions
        const normalizedDistance = Math.min(distance / maxDistance, 1);
        const color = new THREE.Color();
        color.setHSL(normalizedDistance * 0.7, 1, 0.5); // Map distance to a color gradient
        return color;
    }

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        // Update physics world
        world.step(1 / 60);

        // Update Three.js meshes with physics bodies positions
        centralHyperboloid.position.copy(centralBody.position);
        centralHyperboloid.quaternion.copy(centralBody.quaternion);

        let totalDistance = 0;
        let totalPosition = new THREE.Vector3();

        hyperboloids.forEach((hyperboloid, index) => {
            hyperboloid.position.copy(bodies[index].position);
            hyperboloid.quaternion.copy(bodies[index].quaternion);

            // Calculate distance traveled by each hyperboloid
            const distance = hyperboloid.position.length();
            totalDistance += distance;

            // Accumulate positions for averaging
            totalPosition.add(hyperboloid.position);

            // Update the trail positions
            const trail = trails[index];
            const positions = trail.geometry.attributes.position.array;
            for (let i = trailLength - 1; i > 0; i--) {
                positions[i * 3] = positions[(i - 1) * 3];
                positions[i * 3 + 1] = positions[(i - 1) * 3 + 1];
                positions[i * 3 + 2] = positions[(i - 1) * 3 + 2];
            }
            positions[0] = hyperboloid.position.x;
            positions[1] = hyperboloid.position.y;
            positions[2] = hyperboloid.position.z;
            trail.geometry.attributes.position.needsUpdate = true;
        });

        // Calculate average position
        const averagePosition = totalPosition.divideScalar(hyperboloids.length);

        // Update the background color based on the total distance traveled
        const averageDistance = totalDistance / hyperboloids.length;
        const backgroundColor = mapDistanceToColor(averageDistance);
        scene.background = backgroundColor;

        // Make the camera follow the first hyperboloid from below
        if (hyperboloids.length > 0) {
            const targetHyperboloid = hyperboloids[0];
            camera.position.set(targetHyperboloid.position.x, targetHyperboloid.position.y - 15, targetHyperboloid.position.z);
            camera.lookAt(targetHyperboloid.position);
        }

        controls.update(); // Update controls

        renderer.render(scene, camera);
    }

    animate();
}