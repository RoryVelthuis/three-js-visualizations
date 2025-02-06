import * as THREE from 'three';

export function createScene7() {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    scene.background = new THREE.Color(0x000000); // Default background

    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff });

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

    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    scene.animate = () => {
        stars.rotation.x += 0.002;
        stars.rotation.y += 0.002;
    };

    // WebSocket client to receive beat information
    const ws = new WebSocket('ws://localhost:5174/');

    ws.onopen = function() {
        console.log('WebSocket connection established');  // Debug log
    };

    ws.onmessage = function(event) {
        console.log('WebSocket message event:', event);  // Debug log
        const message = JSON.parse(event.data);
        console.log('Parsed WebSocket message:', message);  // Debug log

        if (message.Beat) {
            const randomColor = new THREE.Color(Math.random(), Math.random(), Math.random());
            console.log('Changing background color to:', randomColor);  // Debug log
            document.body.style.backgroundColor = `rgb(${Math.floor(randomColor.r * 255)}, ${Math.floor(randomColor.g * 255)}, ${Math.floor(randomColor.b * 255)})`;
            scene.background = randomColor;
        }
    };

    ws.onerror = function(error) {
        console.error('WebSocket error:', error);  // Debug log
    };

    ws.onclose = function(event) {
        console.log(`WebSocket connection closed. Code: ${event.code}, Reason: ${event.reason}`);  // Debug log
    };

    return { scene, camera, animate: scene.animate };
}

// Ensure the scene is created when loading Scene 7
createScene7();
