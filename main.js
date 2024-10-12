import "./style.css";
import * as THREE from 'three';
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from "gsap";

// Set up scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#canvas'),
  antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Load HDRI environment map
const loader = new RGBELoader();
loader.load('https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/moonlit_golf_1k.hdr', function(texture) {
  texture.mapping = THREE.EquirectangularReflectionMapping;

  // Update materials to use environment mapping
  spheres.traverse((child) => {
    if (child.isMesh) {
      child.material.envMap = texture;
      child.material.needsUpdate = true;
    }
  });

  // Render the scene to see the changes
  renderer.render(scene, camera);
});

const radius = 1.3;
const segments = 62;
const orbitRadius = 4.5;
const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00];
const textures = ['./csilla/color.png', './earth/map.jpg', './venus/map.jpg', './volcanic/color.png'];
const spheres = new THREE.Group();

// Create a big sphere for the starry background
const starRadius = 50; // Much larger than the other spheres
const starSegments = 64;
const starGeometry = new THREE.SphereGeometry(starRadius, starSegments, starSegments);

// Load the star texture
const starTextureLoader = new THREE.TextureLoader();
const starTexture = starTextureLoader.load('./stars.jpg', () => {
  // Texture loaded successfully
  starMaterial.needsUpdate = true;
  renderer.render(scene, camera);
});
starTexture.colorSpace = THREE.SRGBColorSpace;

// Create a material for the star sphere
const starMaterial = new THREE.MeshStandardMaterial({
  map: starTexture,
  transparent: true,
  opacity: 0.5, // Adjust this value between 0 (fully transparent) and 1 (fully opaque)
  side: THREE.BackSide, // Render the inside of the sphere
  emissive: 0xffffff, // Make the stars emit light
  emissiveMap: starTexture, // Use the same texture for emission
  emissiveIntensity: 1 // Full intensity emission
});

// Create the star sphere mesh
const starSphere = new THREE.Mesh(starGeometry, starMaterial);

// Add the star sphere to the scene
scene.add(starSphere);

const spheresMesh = [];

for (let i = 0; i < 4; i++) {
  // Load texture
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load(textures[i], () => {
    // Texture loaded successfully
    material.map = texture;
    material.needsUpdate = true;
    
    // Render the scene to see the changes
    renderer.render(scene, camera);
  });
  texture.colorSpace = THREE.SRGBColorSpace;

  // Create a sphere geometry
  const geometry = new THREE.SphereGeometry(radius, segments, segments);
  
  // Create a material with the loaded texture
  const material = new THREE.MeshStandardMaterial({ map: texture });
  
  // Create a mesh with the geometry and material
  const sphere = new THREE.Mesh(geometry, material);

  spheresMesh.push(sphere);

  // Adjust texture properties if needed
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 1);

  const angle = (i / 4) * (Math.PI * 2);
  
  sphere.position.x = orbitRadius * Math.cos(angle);
  sphere.position.z = orbitRadius * Math.sin(angle);
    
  // Add the sphere to the group
  spheres.add(sphere);
}

spheres.rotation.x = 0.15;
spheres.position.y = -0.3;
scene.add(spheres);

// Set up orbit controls
// const controls = new OrbitControls(camera, renderer.domElement);

camera.position.z = 9;

let lastWheelTime = 0; // Initialize lastWheelTime
const throttleDelay = 2000;
let scrollCount = 0;

function throttledWheelHandler(event) {
  const currentTime = Date.now();
  if (currentTime - lastWheelTime >= throttleDelay) {
    lastWheelTime = currentTime; // Update lastWheelTime
    const direction = event.deltaY > 0 ? "down" : "up";

    scrollCount = (scrollCount + 1) % 4;
    console.log(scrollCount);

    const headings = document.querySelectorAll(".heading");
    gsap.to(headings, {
      duration: 1,
      y: `-=${100}%`,
      ease: "power2.inOut",
    });

    gsap.to(spheres.rotation, { 
      duration: 1,
      y: `+=${Math.PI / 2}%`,
      ease: "power2.inOut",
    });

    if (scrollCount === 0) {
      gsap.to(headings, {
        duration: 1,
        y: `0`,
        ease: "power2.inOut",
      });
    }
  }
}
window.addEventListener('wheel', throttledWheelHandler);
// // main.js

// let lastWheelTime = 0;
// const throttleDelay = 2000;
// let currentIndex = 0; // Current visible heading index
// const totalHeadings = document.querySelectorAll(".heading").length;

// // Function to set the active heading based on index
// function setActiveHeading(index) {
//   const headings = document.querySelectorAll(".heading");
  
//   // Animate previous heading to fade out
//   gsap.to(headings[currentIndex], {
//     opacity: 0,
//     duration: 0.5,
//     onComplete: () => {
//       // Update the index after the fade out is complete
//       currentIndex = index;
      
//       // Animate new heading to fade in
//       gsap.to(headings[currentIndex], {
//         opacity: 1,
//         duration: 0.5,
//       });
//     }
//   });
// }

// // Throttle function for wheel events
// function throttledWheelHandler(event) {
//   const currentTime = Date.now();
//   if (currentTime - lastWheelTime >= throttleDelay) {
//     lastWheelTime = currentTime;
//     const direction = event.deltaY > 0 ? "down" : "up";

//     // Calculate the new index
//     if (direction === "down") {
//       setActiveHeading((currentIndex + 1) % totalHeadings); // Loop to the next heading
//     } else {
//       setActiveHeading((currentIndex - 1 + totalHeadings) % totalHeadings); // Loop to the previous heading
//     }
//   }
// }

// // Add the throttled wheel event listener
// window.addEventListener('wheel', throttledWheelHandler);

// // Set initial heading
// setActiveHeading(currentIndex);




// // Throttle function
// let lastWheelTime = 0;
// const throttleDelay = 2000;

// function throttledWheelHandler(event) {
//   const currentTime = Date.now();
//   if (currentTime - lastWheelTime >= throttleDelay) {
//     lastWheelTime = currentTime;
//     const direction = event.deltaY > 0 ? "down" : "up";

//     // GSAP animation for headings
//     const headings = document.querySelectorAll(".heading");
//     gsap.to(headings, {
//       duration: 1,
//       y: direction === "down" ? "-=100%" : "+=100%",
//       ease: "power2.inOut",
//     });
//   }
// }

// // Add the throttled wheel event listener
// window.addEventListener('wheel', throttledWheelHandler);

const clock = new THREE.Clock();
// Animation loop
function animate() {
  requestAnimationFrame(animate);
  for (let i = 0; i < spheresMesh.length; i++) {
    const sphere = spheresMesh[i];
    sphere.rotation.y = clock.getElapsedTime() * 0.02;
  }
  // controls.update();
  renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
