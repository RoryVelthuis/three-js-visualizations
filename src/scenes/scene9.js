import * as THREE from 'three';

export function createScene9(scene, camera, renderer) {
    // Clear all objects from the scene
    function clearScene() {
        while (scene.children.length > 0) {
            scene.remove(scene.children[0]);
        }
    }

    // Call clearScene at the beginning to ensure any existing objects are cleared
    clearScene();

    // Set up camera position
    camera.position.z = 5;

    // Create a hyperboloid geometry using a parametric function
    const hyperboloidGeometry = new THREE.ParametricGeometry(hyperboloid, 30, 30);
    const hyperboloidMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
    const hyperboloidMesh = new THREE.Mesh(hyperboloidGeometry, hyperboloidMaterial);
    
    // Add the hyperboloid to the scene
    scene.add(hyperboloidMesh);

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

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        hyperboloidMesh.rotation.y += 0.01; // Rotate the hyperboloid
        renderer.render(scene, camera);
    }

    animate();
}