import * as THREE from 'three';

class SceneManager {
  constructor(renderer) {
    this.scenes = {};
    this.currentScene = null;
    this.renderer = renderer
  }

  addScene(scene) {
    if (scene && scene.name) {
      this.scenes[scene.name] = scene;
      console.log(`Scene '${scene.name}' added to SceneManager`);
    } else {
      console.error('Invalid scene or scene name');
    }
  }

  loadScene(name) {
    // Check if scene exists in scenes object
    if (name in this.scenes) {
      if (this.currentScene && this.currentScene.name === name) {
        // Don't change scene
        console.log(`Scene ${name} already active`);
      } else {
        // Unload current scene if it exists
        if (this.currentScene && this.currentScene.cleanup) {
          console.log(`Cleaning up current scene: ${this.currentScene.name}`);
          this.currentScene.cleanup();
        }
        // Update and load new current scene
        console.log(`Scene ${name} exists. Loading.`);
        this.currentScene = this.scenes[name];
        this.scenes[name].load(this.renderer);
      }
    } else {
      console.log(`Scene ${name} not found`);
    }
  }

  getCurrentScene() {
    return this.currentScene;
  }

  setRenderer(renderer){
    this.renderer = renderer;
  }
}

export default SceneManager;