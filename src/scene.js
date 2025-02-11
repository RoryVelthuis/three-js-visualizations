import * as THREE from 'three';

class Scene {
    constructor(name, createSceneFunction) {
        this.name = name,
        //this.renderer = renderer,
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.create = typeof createSceneFunction === 'function' ? createSceneFunction : null;

        if (!this.create) {
          console.warn("The createSceneFunction provided is not a function.");
        }

        console.log(`Scene '${name}' class created`);
    }

    load(renderer) {
        if(this.create) {
            console.log(`Loading ${this.name}`, this.scene, this.camera, this.renderer )
            this.create(this.scene, this.camera, renderer);
        }
    }

    cleanup() {
        console.log('Clearing scene');
        if (!this.scene) {
            console.warn("Warning: Scene is undefined, skipping cleanup.");
            return;
        }
        //Clear scene
        this.scene.clear();
        // Dispose of scene objects to free resources
        this.scene.traverse((object) => {
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(mat => mat.dispose());
                } else {
                    object.material.dispose();
                }
            }
            if (object.texture) object.texture.dispose();  // If any object has a texture
        });
      }
    }

export default Scene;