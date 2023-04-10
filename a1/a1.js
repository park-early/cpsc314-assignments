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

boxGeometry = new THREE.BoxGeometry( 2, 2, 2 );    // width, height, depth
boxMaterial = new THREE.MeshLambertMaterial( {color: 0xFFFF00} );
box = new THREE.Mesh( boxGeometry, boxMaterial );
box.position.set(-4, 1, 2);
scene.add( box );

boxMaterial2 = new THREE.MeshLambertMaterial( {color: 0xFF0000} );
box2 = new THREE.Mesh( boxGeometry, boxMaterial2 );
box2.position.set(-4, 3, 2);
box2.rotation.set(0, 2/3*Math.PI, 0);
scene.add( box2 );

boxMaterial3 = new THREE.MeshLambertMaterial( {color: 0x0000FF} );
box3 = new THREE.Mesh( boxGeometry, boxMaterial3 );
box3.position.set(-4, 5, 2);
box3.rotation.set(0, 4/3*Math.PI, 0);
scene.add( box3 );

/////////////////////////////////////////////////////////////////////////
// cylinder
/////////////////////////////////////////////////////////////////////////

// parameters:    
//    radiusAtTop, radiusAtBottom, height, segmentsAroundRadius, segmentsAlongHeight
cylinderGeometry = new THREE.CylinderGeometry( 0.50, 0.50, 2.0, 20, 5 );
cylinderMaterial = new THREE.MeshLambertMaterial( {color: 0xf0f030} );   
cylinder = new THREE.Mesh( cylinderGeometry, cylinderMaterial);
cylinder.position.set(2, 1, 2);
scene.add( cylinder );

/////////////////////////////////////////////////////////////////////////
// cone
/////////////////////////////////////////////////////////////////////////

// parameters:    
//    radiusAtTop, radiusAtBottom, height, segmentsAroundRadius, segmentsAlongHeight
coneGeometry = new THREE.CylinderGeometry( 0.0, 0.50, 3.0, 20, 4 );
coneMaterial = new THREE.MeshLambertMaterial( {color: 0x40f030} );   
cone = new THREE.Mesh( coneGeometry, coneMaterial);
cone.position.set(4, 1.5, 2);
scene.add( cone);

/////////////////////////////////////////////////////////////////////////
// torus
/////////////////////////////////////////////////////////////////////////

// parameters:   radius of torus, diameter of tube, segments around radius, segments around torus
torusGeometry = new THREE.TorusGeometry( 1.2, 0.4, 10, 20 );
torusMaterial = new THREE.MeshLambertMaterial( {color: 0x40f0f0} );
torus = new THREE.Mesh( torusGeometry, torusMaterial);
torus.position.set(6, 1.6, 0);   
torus.rotation.set(0,0,0);     // rotation about x,y,z axes
scene.add( torus );

torus2 = new THREE.Mesh( torusGeometry, torusMaterial);
torus2.position.set(4.5, 1.6, 0);
torus2.rotation.set(Math.PI/2,0,0);     // rotation about x,y,z axes (USES RADIANS)
scene.add( torus2 );

/////////////////////////////////////	
// FLOOR with texture
/////////////////////////////////////	

floorTexture = new THREE.TextureLoader().load('images/floor.jpg');
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(1,1);
floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture, side: THREE.DoubleSide });
floorGeometry = new THREE.PlaneBufferGeometry(15,15);    // x,y size 
floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.y = -0.01;
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

///////////////////////////////////////////////////////////////////////
//   sphere, representing the light source
///////////////////////////////////////////////////////////////////////

lightObjGeometry = new THREE.SphereGeometry(0.3, 32, 32);    // radius, segments, segments
lightObjMaterial = new THREE.MeshBasicMaterial( {color: 0xFFFF00} );
lightObj = new THREE.Mesh(lightObjGeometry, lightObjMaterial);
lightObj.position.set(0,4,2);
lightObj.position.set(light.position.x, light.position.y, light.position.z);
scene.add(lightObj);

/////////////////////////////////////
//  CUSTOM SQUARE: mySquare
////////////////////////////////////

mySquareGeom = new THREE.Geometry(); 
mySquareMaterial = new THREE.MeshBasicMaterial( {color: 0x8b4513} );

var v0 = new THREE.Vector3(0,0,0);
var v1 = new THREE.Vector3(4,0,0);
var v2 = new THREE.Vector3(0,1,0);
var v3 = new THREE.Vector3(4,1,0);

mySquareGeom.vertices.push(v0);
mySquareGeom.vertices.push(v1);
mySquareGeom.vertices.push(v2);
mySquareGeom.vertices.push(v3);

mySquareGeom.faces.push( new THREE.Face3( 0, 1, 2 ) );
mySquareGeom.faces.push( new THREE.Face3( 1, 3, 2 ) );
mySquareGeom.computeFaceNormals();

cs = new THREE.Mesh( mySquareGeom, mySquareMaterial );
cs.position.set(3, 3, -3);
scene.add(cs);


mySquareGeom2 = new THREE.Geometry();

mySquareGeom2.vertices.push(v0);
mySquareGeom2.vertices.push(v1);
mySquareGeom2.vertices.push(v2);
mySquareGeom2.vertices.push(v3);

mySquareGeom2.faces.push( new THREE.Face3( 0, 1, 2 ) );
mySquareGeom2.faces.push( new THREE.Face3( 1, 3, 2 ) );
mySquareGeom2.computeFaceNormals();

cs2 = new THREE.Mesh( mySquareGeom, mySquareMaterial );
cs2.position.set(2.7, 2.3, -3);
cs2.rotation.set(0,0,Math.PI/4);
scene.add(cs2);



mySquareGeom3 = new THREE.Geometry();

mySquareGeom3.vertices.push(v0);
mySquareGeom3.vertices.push(v1);
mySquareGeom3.vertices.push(v2);
mySquareGeom3.vertices.push(v3);

mySquareGeom3.faces.push( new THREE.Face3( 0, 1, 2 ) );
mySquareGeom3.faces.push( new THREE.Face3( 1, 3, 2 ) );
mySquareGeom3.computeFaceNormals();

cs3 = new THREE.Mesh( mySquareGeom, mySquareMaterial );
cs3.position.set(4.4, 5, -3);
cs3.rotation.set(0,0,-Math.PI/4);
scene.add(cs3);


/////////////////////////////////////////////////////////////////////////////////////
//  create a teapot material that uses the vertex & fragment shaders, as defined in a1.html
/////////////////////////////////////////////////////////////////////////////////////

var teapotMaterial = new THREE.ShaderMaterial( {
	vertexShader: document.getElementById( 'teapotVertexShader' ).textContent,
	fragmentShader: document.getElementById( 'teapotFragmentShader' ).textContent
} );

var ctx = renderer.context;
ctx.getShaderInfoLog = function () { return '' };   // stops shader warnings, seen in some browsers

/////////////////////////////////////////////////////////////////////////////////////
//  Teapot Object loaded from OBJ file, rendered using teapotMaterial
/////////////////////////////////////////////////////////////////////////////////////

var manager = new THREE.LoadingManager();
        manager.onProgress = function ( item, loaded, total ) {
	console.log( item, loaded, total );
};

var onProgress = function ( xhr ) {
	if ( xhr.lengthComputable ) {
		var percentComplete = xhr.loaded / xhr.total * 100;
		console.log( Math.round(percentComplete, 2) + '% downloaded' );
	}
};
var onError = function ( xhr ) {
};
var loader = new THREE.OBJLoader( manager );
loader.load( 'obj/teapot.obj', function ( object ) {
	object.traverse( function ( child ) {
		if ( child instanceof THREE.Mesh ) {
		    child.material = teapotMaterial;
		}
	} );
	scene.add( object );
}, onProgress, onError );

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
  requestAnimationFrame(update);      // requests the next update call;  this creates a loop
  renderer.render(scene, camera);
}

update();

