import * as THREE from 'three';

export function createScene5() {
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

    // Add a directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // Add ambient light for softer shadows
    const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
    scene.add(ambientLight);

    // Animate the stars in random motion
    scene.animate = () => {
        stars.rotation.x += 0.002;
        stars.rotation.y += 0.002;
    };

    return { scene, camera, animate: scene.animate };
}
