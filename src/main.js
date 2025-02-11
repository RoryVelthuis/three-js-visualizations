import * as THREE from 'three';
import SceneManager from './scene-manager.js';
import Scene from './scene.js';

import { createScene1 } from './scenes/scene1.js';
import { createScene2 } from './scenes/scene2.js';
import { createScene3 } from './scenes/scene3.js';
import { createScene4 } from './scenes/scene4.js';
import { createScene5 } from './scenes/scene5.js';
import { createScene6 } from './scenes/scene6.js';
import { createScene7 } from './scenes/scene7.js';

const sceneManager = new SceneManager();

// function findObjectByName(scene, name) {
//   return scene.children.find(child => child.name === name);
// }

function init() {

  // Create camera, renderer, append to document
  //const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true; // Enable shadow mapping
  document.body.appendChild(renderer.domElement);


  sceneManager.addScene(new Scene('Cube', renderer, createScene1));
  sceneManager.addScene(new Scene('Orbs', renderer, createScene2));
  sceneManager.addScene(new Scene('Tetrahedrons', renderer, createScene3));
  sceneManager.addScene(new Scene('Earth', renderer, createScene4));
  sceneManager.addScene(new Scene('Scene 5', renderer, createScene5));
  sceneManager.addScene(new Scene('Scene 6', renderer, createScene6));
  sceneManager.addScene(new Scene('Scene 7', renderer, createScene7));

  sceneManager.loadScene('Scene 7');

  
  function animate() {
    requestAnimationFrame(animate);
    const currentScene = sceneManager.getCurrentScene();
    if (currentScene) {
      const currentCamera = currentScene.camera;
      if (currentCamera) {
        if (typeof currentScene.scene.animate === 'function') {
          currentScene.scene.animate();
        }
        renderer.render(currentScene.scene, currentCamera);
      }
    }
  }

  // Run animation
  animate();

  // Handle window resize
  window.addEventListener('resize', () => {
    const currentScene = sceneManager.getCurrentScene();
    if (currentScene) {
      const currentCamera = currentScene.camera;
      if (currentCamera) {
        currentCamera.aspect = window.innerWidth / window.innerHeight;
        currentCamera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
    }
  });
}

// Global function to load scene frome scene manager
window.loadScene = (sceneName) => {
  sceneManager.loadScene(sceneName);
};

// Initalize
init();