import * as THREE from "three";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";
import atmosVertexShader from "./shaders/atmosVertex.glsl";
import atmosFragmentShader from "./shaders/atmosFragment.glsl";
import gsap from "gsap";

const canvas = document.querySelector("#three-canvas");
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
});
const canvasContainer = document.querySelector("#canvasContainer");

renderer.setSize(canvasContainer.offsetWidth, canvasContainer.offsetHeight);
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  canvasContainer.offsetWidth / canvasContainer.offsetHeight,
  0.1,
  1000
);
camera.position.y = 1;
camera.position.z = 18;
scene.add(camera);

// Mesh
const geometry = new THREE.SphereGeometry(5, 50, 50);
const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    globeTexture: {
      value: new THREE.TextureLoader().load("./images/map.jpeg"),
    },
  },
});

const mesh = new THREE.Mesh(geometry, material);

const atmosMaterial = new THREE.ShaderMaterial({
  vertexShader: atmosVertexShader,
  fragmentShader: atmosFragmentShader,
  blending: THREE.AdditiveBlending,
  side: THREE.BackSide,
});

const atmos = new THREE.Mesh(geometry, atmosMaterial);
atmos.scale.set(1.1, 1.1, 1.1);
scene.add(atmos);

const group = new THREE.Group();
group.add(mesh);
scene.add(group);

const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({
  color: "#fff",
});
const starVertices = [];
for (let i = 0; i < 10000; i++) {
  const x = (Math.random() - 0.5) * 2000;
  const y = (Math.random() - 0.5) * 2000;
  const z = -Math.random() * 3000;
  starVertices.push(x, y, z);
}
starGeometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(starVertices, 3)
);

const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

const mouse = {
  x: undefined,
  y: undefined,
};

// 그리기
function draw() {
  renderer.render(scene, camera);
  mesh.rotation.y += 0.001;
  renderer.setAnimationLoop(draw);
  gsap.to(group.rotation, {
    x: -mouse.y * 0.3,
    y: mouse.x * 0.5,
    duration: 2,
  });
}

function setSize() {
  camera.aspect = canvasContainer.offsetWidth / canvasContainer.offsetHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
}

// 이벤트
window.addEventListener("resize", setSize);
window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / innerHeight) * 2 + 1;
});
draw();
