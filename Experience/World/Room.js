import * as THREE from "three";
import Experience from "../Experience.js";
import GSAP from "gsap";

export default class Room {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.room = this.resources.items.room;
    this.actualRoom = this.room.scene;

    this.lerp = {
      current: 0,
      target: 0,
      ease: 0.1,
    };

    this.setModel();
    this.onMouseMove();
    this.addClickListener();
  }

  setModel() {
    // Set up model
    this.actualRoom.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        if (child.name === "glass") {
          child.material = new THREE.MeshPhysicalMaterial();
          child.material.roughness = 0;
          child.material.color.set(0xffffff);
          child.material.ior = 3;
          child.material.transmission = 1;
          child.material.opacity = 1;
        }

        if (child.name === "Screen") {
          child.material = new THREE.MeshBasicMaterial({
            map: this.resources.items.screen,
          });

          // Wait for the texture to finish loading
          child.material.map.addEventListener("load", () => {
            // Generate mipmaps for level 0
            child.material.map.generateMipmaps();
            child.material.map.minFilter = THREE.LinearMipmapLinearFilter;
          });
        }

        if (child.name === "Painting") {
          child.material = new THREE.MeshStandardMaterial({
          color: 0x000000,
          roughness: 1,
          metalness: 0,
          transparent: true,
          opacity: 1,
          side: THREE.DoubleSide,
        });
  
          child.scale.set(5, 5, 5);
          child.position.set(-6, 0, 5);
  
          // Disable shadows for the painting object
          child.castShadow = false;
          child.receiveShadow = false;
        }

        // Make the child object recursive
        child.traverse((nestedChild) => {
          // Additional setup for nested child objects if needed
        });
      }
    });

    this.scene.add(this.actualRoom);
    this.actualRoom.scale.set(0.4, 0.4, 0.4);
  }

  onMouseMove() {
    window.addEventListener("mousemove", (e) => {
      this.rotation = ((e.clientX - window.innerWidth / 2) * 2) / window.innerWidth;
      this.lerp.target = this.rotation*0.2;
    });
  }

  addClickListener() {
    document.addEventListener("click", this.onClick.bind(this));
  }

  onClick(event) {
    // Convert mouse coordinates to normalized device coordinates
    const mouse = new THREE.Vector2(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );
  
    // Raycasting
    const raycaster = new THREE.Raycaster();
    raycaster.ray.origin.set(0,0,0);
    console.log('Raycaster Position:', raycaster.ray.origin);
    raycaster.near = 0.01;
    raycaster.far = 100;
    raycaster.setFromCamera(mouse, this.experience.camera.perspectiveCamera);
  
    // Find the "Painting" objects in the scene
    const paintings = this.actualRoom.children.filter((child) => child.name === "Painting");
  
    let intersects = [];
  
    // Check for intersections with each "Painting" object
    for (const painting of paintings) {
      const paintingIntersects = raycaster.intersectObject(painting);
      intersects = intersects.concat(paintingIntersects);
    }
    console.log(intersects);
    // Sort the intersects array based on distance
    intersects.sort((a, b) => a.distance - b.distance);
  
    if (intersects.length > 0 && intersects[0].faceIndex === 5) {
      if (!this.gameOpened) {
        this.gameOpened = true;
        window.open("Game.html", "_blank");
      }
  
      // Create a visual marker for the closest intersection point
      const markerGeometry = new THREE.CircleGeometry(0.2, 32); // Adjust the size of the marker as needed
      const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      const markerMesh = new THREE.Mesh(markerGeometry, markerMaterial);
      markerMesh.position.copy(intersects[0].point); // Use the closest intersection point
      this.scene.add(markerMesh);
  
      // Set a timeout to remove the marker after a certain duration
      setTimeout(() => {
        this.scene.remove(markerMesh);
      }, 1000); // Adjust the duration as needed
    }
  }
  
  
  
  
  

  resize() {}

  update() {
    this.lerp.current = GSAP.utils.interpolate(this.lerp.current, this.lerp.target, this.lerp.ease);
    this.actualRoom.rotation.y = this.lerp.current;
  }
}
