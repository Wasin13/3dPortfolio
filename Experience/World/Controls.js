import * as THREE from "three";
import Experience from "../Experience.js";

export default class Controls {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.camera = this.experience.camera;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.addClickListener();
  }

  addClickListener() {
    document.addEventListener("click", this.onClick.bind(this));
  }

  onClick(event) {
    // Calculate normalized device coordinates (NDC) of the mouse click
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update the picking ray with the camera and mouse position
    this.raycaster.setFromCamera(this.mouse, this.camera.perspectiveCamera);

    // Perform the raycasting
    const intersects = this.raycaster.intersectObjects(
      this.scene.children,
      true
    );

    // Check if there are any intersections
    if (intersects.length > 0) {
      // Iterate through the intersected objects
      for (const intersect of intersects) {
        // Check if the intersected object is the painting
        if (intersect.object.name === "Painting") {
          // Perform the action when the painting is clicked
          this.openGame();
          break;
        }
      }
    }
  }

  openGame() {
    // Perform the action to open the Game.html file
    window.open("./public/Games.html", "_blank");
  }

  resize() {}

  update() {}
}
