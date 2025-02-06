import * as THREE from 'three';

export function createScene6() {
    const scene = new THREE.Scene();

    // Create a camera specific to this scene
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Set the background color and fog
    scene.background = new THREE.Color(0x000000); // Black background
    scene.fog = new THREE.Fog(0x000000, 10, 50); // Color, near, far

    // Create stars geometry and material
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff });

    // Create star positions
    const starCount = 1000;
    const starPositions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
        const x = THREE.MathUtils.randFloatSpread(100);
        const y = THREE.MathUtils.randFloatSpread(100);
        const z = THREE.MathUtils.randFloatSpread(100);

        starPositions[i * 3] = x;
        starPositions[i * 3 + 1] = y;
        starPositions[i * 3 + 2] = z;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));

    // Create the points object
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Create a sphere geometry and material for the ball
    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 }); // Red color

    // Create the sphere mesh
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(0, 0, 0);
    sphere.castShadow = true; // Enable casting shadows
    scene.add(sphere);

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

    // Animate the stars and the sphere (ball) in random motion
    scene.animate = () => {
        stars.rotation.x += 0.002;
        stars.rotation.y += 0.002;

        sphere.rotation.x += 0.01;
        sphere.rotation.y += 0.01;
    };

    return { scene, camera, animate: scene.animate };
}
