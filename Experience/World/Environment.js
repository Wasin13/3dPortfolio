import * as THREE from "three";
import Experience from "../Experience.js";

export default class Environment {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;

        this.setSunLight();
    }

    setSunLight() {
        this.sunLight = new THREE.DirectionalLight("#FFFFFF", 3);
        this.sunLight.castShadow = true;
        this.sunLight.shadow.camera.far = 20;
        this.sunLight.shadow.mapSize.set(2048, 2048);
        this.sunLight.shadow.normalBias = 0.05;
        this.sunLight.shadow.bias = -0.001; // Adjust the shadow bias value as needed
        this.sunLight.shadow.camera.near = 0.5; // Adjust the near value as needed
        this.sunLight.shadow.camera.far = 50; // Adjust the far value as needed
        this.sunLight.position.set(-1.5, 7, 3);
        this.scene.add(this.sunLight);

        this.ambientLight = new THREE.AmbientLight("#FBFCFA", 1);
        this.scene.add(this.ambientLight);
    }

    resize() {}
    update() {}
}
