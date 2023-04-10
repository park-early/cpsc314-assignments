/////////////////////////////////////////////////////////////////////////////////////////
//  UBC CPSC 314,  January 2023, Assignment 1 
/////////////////////////////////////////////////////////////////////////////////////////

console.log('CPSC 314 A1 by Parker Lee');
console.log(10/0); // prints Infinity
//console.log(a); // Uncaught ReferenceError: a is not defined
var foo;
console.log(foo); // undefined

a=8;  
b=2.6;
console.log('a=',a,'b=',b);
a=10;
b=3;
function go() {
    var a = 14;
    b = 15;
}
go();
console.log('a=',a,'b=',b); // 10 and 15 because var a is creating a local variable

myvector = new THREE.Vector3(0,1,2);
console.log('myvector =',myvector)

// SETUP RENDERER & SCENE
var canvas = document.getElementById('canvas');
var scene = new THREE.Scene();
// var renderer = new THREE.WebGLRenderer( { antialias: true } );
var renderer = new THREE.WebGLRenderer();
  // set background colour to 0xRRGGBB  where RR,GG,BB are values in [00,ff] in hexadecimal, i.e., [0,255] 
renderer.setClearColor(0x90EE90);
canvas.appendChild(renderer.domElement);

// SETUP CAMERA
var camera = new THREE.PerspectiveCamera(30,1,0.01,1e99); // view angle, aspect ratio, near, far
camera.position.set(0,12,20);
camera.lookAt(0,0,0);
scene.add(camera);

// SETUP ORBIT CONTROLS OF THE CAMERA
var controls = new THREE.OrbitControls(camera);
controls.damping = 0.2;
controls.autoRotate = false;

// ADAPT TO WINDOW RESIZE
function resize() {
  renderer.setSize(window.innerWidth,window.innerHeight);
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
}

// EVENT LISTENER RESIZE
window.addEventListener('resize',resize);
resize();

//SCROLLBAR FUNCTION DISABLE
window.onscroll = function () {
     window.scrollTo(0,0);
   }

/////////////////////////////////////	
// ADD LIGHTS  and define a simple material that uses lighting
/////////////////////////////////////	

light = new THREE.PointLight(0xffffff);
light.position.set(0,4,2);
scene.add(light);
ambientLight = new THREE.AmbientLight(0x606060);
scene.add(ambientLight);

var diffuseMaterial = new THREE.MeshLambertMaterial( {color: 0xffffff} );
var diffuseMaterial2 = new THREE.MeshLambertMaterial( {color: 0xffffff, side: THREE.DoubleSide } );

//
//  DEFINE OBJECTS
//

/////////////////////////////////////	
// WORLD COORDINATE FRAME
/////////////////////////////////////	

var worldFrame = new THREE.AxesHelper(5) ;
scene.add(worldFrame);

///////////////////////////////////////////////////////////////////////
//   box
///////////////////////////////////////////////////////////////////////

bargeGeometry = new THREE.BoxGeometry( 5, 1.5, 2 );    // width, height, depth
bargeMaterial = new THREE.MeshPhysicalMaterial( {
    color: 0x6b0000,
    roughness: 0.262,
    metalness: 0.135,
    reflectivity: 0.01999,
    clearCoat: 0.38,
    clearCoatRoughness: 0.67
} );
barge = new THREE.Mesh( bargeGeometry, bargeMaterial );
barge.position.set(0, 2, 0);

scene.add( barge );

let ridges = [];

for (let i = 0; i < 10; i++) {
  ridgeGeometry = new THREE.BoxGeometry( 0.1, 1.5, 2.2 );    // width, height, depth
  ridges[i] = new THREE.Mesh( ridgeGeometry, bargeMaterial );
  ridges[i].position.set(i * (5/10) - 2.2, 2, 0);

  scene.add(ridges[i]);
}

for (let i = 0; i < 5; i++) {
  ridgeGeometry2 = new THREE.BoxGeometry( 0.1, 1.5, 5.2 );    // width, height, depth
  ridges[i] = new THREE.Mesh( ridgeGeometry2, bargeMaterial );
  ridges[i].position.set(0, 2, -0.8 + (0.4 * i));
  ridges[i].rotation.set(0, Math.PI/2, 0);

  scene.add(ridges[i]);
}

/////////////////////////////////////
// CYLINDAR
/////////////////////////////////////

const concrete = new THREE.TextureLoader().load('images/concrete.jpg');

const baseGeometry = new THREE.CylinderGeometry( 5, 2, 4, 4 );
const baseMaterial = new THREE.MeshBasicMaterial( {map: concrete} );
const base = new THREE.Mesh( baseGeometry, baseMaterial );
base.rotation.set(0, Math.PI/4, 0);
base.scale.set(0.7, 0.25, 0.7);
base.position.set(0,0.765,0);
scene.add( base );


/////////////////////////////////////
// TORUS KNOT
/////////////////////////////////////

const torusGeometry = new THREE.TorusKnotGeometry( 0.5, 2, 52, 14, 20, 1 );
const torusMaterial = new THREE.MeshToonMaterial( { color: 0xffff00 } );
const torusKnot = new THREE.Mesh( torusGeometry, torusMaterial );
scene.add( torusKnot );

torusKnot.position.set(0,9,-8);


/////////////////////////////////////	
// FLOOR with texture
/////////////////////////////////////	

floorTexture = new THREE.TextureLoader().load('images/water.jpg');
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(1,1);
floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture, side: THREE.DoubleSide });
floorGeometry = new THREE.PlaneBufferGeometry(20,20,100);    // width, length, width segments (ie. # of waves)
floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.y = -0.01;
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

floor.position.set(0,0.8,0);

const count = floorGeometry.attributes.position.count;

///////////////////////////////////////////////////////////////////////
//   sphere, representing the light source
///////////////////////////////////////////////////////////////////////

lightObjGeometry = new THREE.SphereGeometry(0.3, 32, 32);    // radius, segments, segments
lightObjMaterial = new THREE.MeshBasicMaterial( {color: 0xFFFF00} );
lightObj = new THREE.Mesh(lightObjGeometry, lightObjMaterial);
lightObj.position.set(0,4,2);
lightObj.position.set(light.position.x, light.position.y, light.position.z);
scene.add(lightObj);

///////////////////////////////////////////////////////////////////////////////////////
// LISTEN TO KEYBOARD
///////////////////////////////////////////////////////////////////////////////////////

var keyboard = new THREEx.KeyboardState();
function checkKeyboard() {
  if (keyboard.pressed("W") && light.position.y < 5) {
    console.log('W pressed');
    light.position.y += 0.1;
  } else if (keyboard.pressed("S") && light.position.y > -5)
    light.position.y -= 0.1;
  if (keyboard.pressed("A") && light.position.x > -5)
    light.position.x -= 0.1;
  else if (keyboard.pressed("D") && light.position.x < 5)
    light.position.x += 0.1;
  lightObj.position.set(light.position.x, light.position.y, light.position.z);
}

///////////////////////////////////////////////////////////////////////////////////////
// UPDATE CALLBACK
///////////////////////////////////////////////////////////////////////////////////////

function update() {
  checkKeyboard();
  const now = Date.now() / 1000; // higher denominator = larger period of waves

  for (let i = 0; i < count; i++) {
    const x = floorGeometry.attributes.position.getX(i);
    const xSin = Math.sin(x + now);
    floorGeometry.attributes.position.setZ(i, xSin / 5); // higher denominator, lower amplitude of waves
  }

  floorGeometry.attributes.position.needsUpdate = true;
  
  requestAnimationFrame(update);      // requests the next update call;  this creates a loop
  renderer.render(scene, camera);
}

update();

