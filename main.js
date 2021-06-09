import 'style.css'

import * as THREE from './node_modules/three/build/three.module.js';
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls';
import { FlyControls } from './node_modules/three/examples/jsm/controls/FlyControls';
import { GLTFLoader } from './node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import { EffectComposer } from './node_modules/three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from './node_modules/three/examples/jsm/postprocessing/RenderPass.js';
import {BloomPass} from './node_modules/three/examples/jsm/postprocessing/BloomPass.js';
import {UnrealBloomPass} from './node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { Material } from './node_modules/three';
import vertexShader from '/EarthVertex.glsl';
import fragmentShader from '/fragment.glsl';




//#region cam
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);


const renderer = new THREE.WebGLRenderer({
   antialias: true, alpha:true, canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio (window.devicePixelRatio);
renderer.setSize (window.innerWidth, window.innerHeight);

camera.position.setZ(100);
camera.position.setY(10);

//#endregion


// Background

//const spaceTexture = new THREE.TextureLoader().load('Images/Space2.0.jpg');
//scene.background = spaceTexture;

//#region saturn rings
//Ring
const RingTexture = new THREE.TextureLoader().load('Images/2k_saturn_ring_alpha.png');
const geometry = new THREE.RingBufferGeometry (3, 7, 64);
var pos = geometry.attributes.position;
var v3 = new THREE.Vector3();

for(let i = 0; i < pos.count; i++){
  v3.fromBufferAttribute(pos, i);
  geometry.attributes.uv.setXY(i,v3.length() < 4 ? 0 : 1,1);
}

const mat = new THREE.MeshStandardMaterial({map: RingTexture, side: THREE.DoubleSide, transparent: true});

const tours = new THREE.Mesh(geometry, mat);

tours.position.set(120,0,0);
tours.scale.set(3,3,3);
tours.rotation.x = Math.PI / 2;
tours.rotation.y =- 180;
tours.rotation.z =- 180;

scene.add(tours);
//#endregion

//#region Lights

const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.set(0,0,0);

//const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
const ambientLight = new THREE.AmbientLight(0x090909);
scene.add(pointLight, ambientLight);

//const lightHelper = new THREE.PointLightHelper(pointLight);
//scene.add(lightHelper);

//#endregion 

//Controls
const controls = new OrbitControls(camera, renderer.domElement);
//const controls = new FlyControls(camera, renderer.domElement);
//controls.movementSpeed = 25;
//controls.rollSpeed = Math.PI / 24;

//#region stars
function addStar(){
    const geometry = new THREE.SphereGeometry(0.15, 24, 24);
    const mat = new THREE.MeshBasicMaterial ({color: 0xffffff});
    const star = new THREE.Mesh(geometry, mat);

    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(400));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

//#endregion

//middle point
var sphere = new THREE.SphereGeometry(1, 1, 1);
        var spherMat = new THREE.MeshLambertMaterial({color: 0x5555ff});
        var sphereMesh = new THREE.Mesh(sphere, spherMat);
        sphereMesh.receiveShadow = true;
        sphereMesh.position.set(0, 0, 0);
        scene.add(sphereMesh);


       
//#region Pivot points
var pivotPoint;
pivotPoint = new THREE.Object3D();
sphereMesh.add(pivotPoint);


// Pivot point2
var pivotPoint2;
pivotPoint2 = new THREE.Object3D();
sphereMesh.add(pivotPoint2);

// Pivot point3
var pivotPoint3;
pivotPoint3 = new THREE.Object3D();
sphereMesh.add(pivotPoint3);

// Pivot point4
var pivotPoint4;
pivotPoint4 = new THREE.Object3D();
sphereMesh.add(pivotPoint4);

// Pivot point5
var pivotPoint5;
pivotPoint5 = new THREE.Object3D();
sphereMesh.add(pivotPoint5);

// Pivot point6
var pivotPoint6;
pivotPoint6 = new THREE.Object3D();
sphereMesh.add(pivotPoint6);

// Pivot point7
var pivotPoint7;
pivotPoint7 = new THREE.Object3D();
sphereMesh.add(pivotPoint7);

// Pivot point8
var pivotPoint8;
pivotPoint8 = new THREE.Object3D();
sphereMesh.add(pivotPoint8);


//ring
pivotPoint6.add(tours);

//#endregion

// Sun 
const sun = new THREE.Mesh(new THREE.SphereGeometry(30,50,50), new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('Textures/Sun/2k_sun.jpg') }));
scene.add(sun);
sun.position.set(0,0,0);


// Mercury 
const Mercury = new THREE.Mesh(new THREE.SphereGeometry(1,50,50), new THREE.MeshLambertMaterial({map: new THREE.TextureLoader().load('Textures/Mercury/2k_mercury.jpg') }));
scene.add(Mercury);
Mercury.position.set(50,0,0);
pivotPoint.add(Mercury);

//Mring
const Mring = new THREE.Mesh(new THREE.RingBufferGeometry (49.9, 50.1, 128), new THREE.MeshBasicMaterial({color: 0X575757, side: THREE.DoubleSide}));
Mring.rotation.x = Math.PI / 2;
scene.add(Mring);

// Venus 
const Venus = new THREE.Mesh(new THREE.SphereGeometry(1.3,50,50), new THREE.MeshLambertMaterial({map: new THREE.TextureLoader().load('Textures/Venus/2k_venus_surface.jpg') }));
scene.add(Venus);
Venus.position.set(55,0,0);
pivotPoint2.add(Venus);

//Vring
const Vring = new THREE.Mesh(new THREE.RingBufferGeometry (54.9, 55.1, 128), new THREE.MeshBasicMaterial({color: 0X575757, side: THREE.DoubleSide}));
Vring.rotation.x = Math.PI / 2;
scene.add(Vring);


//Earth
const earthSphere = new THREE.Mesh(new THREE.SphereGeometry(1.5,50,50), new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms:{globeTexture: {value: new THREE.TextureLoader().load('Textures/Earth/2k_earth_daymap.jpg')}}}));
scene.add(earthSphere);
earthSphere.position.set(60,0,0);
earthSphere.receiveShadow = true;
pivotPoint3.add(earthSphere);

//Ering
const Ering = new THREE.Mesh(new THREE.RingBufferGeometry (59.9, 60.1, 128), new THREE.MeshBasicMaterial({color: 0X575757, side: THREE.DoubleSide}));
Ering.rotation.x = Math.PI / 2;
scene.add(Ering);

// Mars 
const Mars = new THREE.Mesh(new THREE.SphereGeometry(1,50,50), new THREE.MeshLambertMaterial({map: new THREE.TextureLoader().load('Textures/Mars/2k_mars.jpg') }));
scene.add(Mars);
Mars.position.set(65,0,0);
pivotPoint4.add(Mars);

//Marsring
const Marsring = new THREE.Mesh(new THREE.RingBufferGeometry (64.9, 65.1, 128), new THREE.MeshBasicMaterial({color: 0X575757, side: THREE.DoubleSide}));
Marsring.rotation.x = Math.PI / 2;
scene.add(Marsring);

// Jupiter 
const Jupiter = new THREE.Mesh(new THREE.SphereGeometry(10,50,50), new THREE.MeshLambertMaterial({map: new THREE.TextureLoader().load('Textures/Jupiter/2k_jupiter.jpg') }));
scene.add(Jupiter);
Jupiter.position.set(100,0,0);
pivotPoint5.add(Jupiter);

//Jring
const Jring = new THREE.Mesh(new THREE.RingBufferGeometry (99.9, 100.1, 128), new THREE.MeshBasicMaterial({color: 0X575757, side: THREE.DoubleSide}));
Jring.rotation.x = Math.PI / 2;
scene.add(Jring);

// Saturn 
const Saturn = new THREE.Mesh(new THREE.SphereGeometry(8,50,50), new THREE.MeshLambertMaterial({map: new THREE.TextureLoader().load('Textures/Saturn/2k_saturn.jpg') }));
scene.add(Saturn);
Saturn.position.set(120,0,0);
pivotPoint6.add(Saturn);

//Sring
const Sring = new THREE.Mesh(new THREE.RingBufferGeometry (119.9, 120.1, 128), new THREE.MeshBasicMaterial({color: 0X575757, side: THREE.DoubleSide}));
Sring.rotation.x = Math.PI / 2;
scene.add(Sring);

// Uranus 
const Uranus = new THREE.Mesh(new THREE.SphereGeometry(3,50,50), new THREE.MeshLambertMaterial({map: new THREE.TextureLoader().load('Textures/Uranus/2k_uranus.jpg') }));
scene.add(Uranus);
Uranus.position.set(135,0,0);
pivotPoint7.add(Uranus);

//Uring
const Uring = new THREE.Mesh(new THREE.RingBufferGeometry (134.9, 135.1, 128), new THREE.MeshBasicMaterial({color: 0X575757, side: THREE.DoubleSide}));
Uring.rotation.x = Math.PI / 2;
scene.add(Uring);

// Neptun 
const Neptun = new THREE.Mesh(new THREE.SphereGeometry(3,50,50), new THREE.MeshLambertMaterial({map: new THREE.TextureLoader().load('Textures/Neptune/2k_neptune.jpg') }));
scene.add(Neptun);
Neptun.position.set(155,0,0);
pivotPoint8.add(Neptun);

//Nring
const Nring = new THREE.Mesh(new THREE.RingBufferGeometry (154.9, 155.1, 128), new THREE.MeshBasicMaterial({color: 0X575757, side: THREE.DoubleSide}));
Nring.rotation.x = Math.PI / 2;
scene.add(Nring);

//Asteroid 
const numberOfAsteroids = 70;
const radius = 80;
const radian_interval = (2.0 * Math.PI) / numberOfAsteroids;
const center_of_wheel = { x: 0, y: 0, z: 0};

const asteroidGroup = new THREE.Group();
let material = null;
let circle = null;
let mesh = null;

for (let i = 0; i < numberOfAsteroids; i++) {
  material = new THREE.MeshLambertMaterial({color: 0x997C55});
  circle = new THREE.IcosahedronGeometry(Math.random(), 0);
  mesh = new THREE.Mesh(circle, material);

  mesh.position.set(
    center_of_wheel.x + (Math.cos(radian_interval * i) * radius + Math.random() * 10),
    center_of_wheel.y + (Math.sin(radian_interval * i) * radius),
    0);

    asteroidGroup.add(mesh);
}

scene.add(asteroidGroup);
asteroidGroup.rotation.x = Math.PI / 2;
pivotPoint8.add(asteroidGroup);

// rocket
var rocket = new THREE.Object3D();
const rocketloader = new GLTFLoader();

rocketloader.load( 'Models/rocket.glb', function ( gltf ) {

  rocket = gltf.scene;
	scene.add( rocket );
  //pivotPoint8.add(rocket);
  rocket.position.set(0,8,95);
  rocket.scale.set(1,1,1);
  rocket.castShadow = true;
  rocket.receiveShadow = true;

    
}, undefined, function ( error ) {

	console.error( error );

} );



//movement
var clock = new THREE.Clock();



//camera.Translate(0,0,-1);
//camera.position.set(0,2,5);
//camera.position.setZ(100);
//camera.position.setY(10);

function moveCamera() {
  var relativeCameraOffset = new THREE.Vector3(0,5,10);
  var cameraOffset = relativeCameraOffset.applyMatrix4(rocket.matrixWorld);
  camera.position.x = cameraOffset.x;
  camera.position.y = cameraOffset.y;
  camera.position.z = cameraOffset.z;
  
  camera.lookAt(rocket.position);
}



//post processing
const composer = new EffectComposer( renderer );
var renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);
//renderPass.renderToScreen = true;

const unrealBloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1, 1, 0.85 );
composer.addPass(unrealBloomPass);
unrealBloomPass.renderToScreen = true;

//renderer.gammaOutput = true




function animate(){
  setTimeout(function(){
    requestAnimationFrame(animate);}, 1000 / 30);
    var delta = clock.getDelta();
  
  sun.rotation.y += 0.003;
  tours.rotation.z += 0.01;
  Mercury.rotation.y += 0.01;
  Venus.rotation.y += 0.01;
  earthSphere.rotation.y += 0.01;
  Mars.rotation.y += 0.01;
  Jupiter.rotation.y += 0.01;
  Saturn.rotation.y += 0.01;
  Uranus.rotation.y += 0.01;
  Neptun.rotation.y += 0.01;
  
  pivotPoint.rotation.y += 0.01;
  pivotPoint2.rotation.y += 0.02;
  pivotPoint3.rotation.y += 0.015;
  pivotPoint4.rotation.y += 0.007;
  pivotPoint5.rotation.y += 0.006;
  pivotPoint6.rotation.y += 0.004;
  pivotPoint7.rotation.y += 0.003;
  pivotPoint8.rotation.y += 0.001;
  
  
  
  controls.update(delta);

  //moveCamera();
  

  composer.render();
  
}

animate();
