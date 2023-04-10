/////////////////////////////////////////////////////////////////////////////////////////
//  UBC CPSC 314,  January 2023  -- A3 Template
/////////////////////////////////////////////////////////////////////////////////////////

console.log('Hello world -- A3 Jan 2023');

var a=7;  
var b=2.6;
console.log('a=',a,'b=',b);
var myvector = new THREE.Vector3(0,1,2);
console.log('myvector =',myvector);

var animation = true;
var meshesLoaded = false;
var RESOURCES_LOADED = false;
var deg2rad = Math.PI/180;

// give the following global scope (in this file), which is useful for motions and objects
// that are related to animation

var myboxMotion = new Motion(myboxSetMatrices);    
var handMotion = new Motion(handSetMatrices);     
var link1, link2, link3, link4, link5;
var linkFrame1, linkFrame2, linkFrame3, linkFrame4, linkFrame5;
var sphere;    
var mybox;   
var mybox2;  
var meshes = {};  

// SETUP RENDERER & SCENE

var canvas = document.getElementById('canvas');
var camera;
var light;
var ambientLight;
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer({ antialias: false });
renderer.setClearColor(0xd0f0d0);     // set background colour
canvas.appendChild(renderer.domElement);

/// SPACING THINGS OUT TO MAKE IT EASIER TO SEE THE CODE FOR THE CAT



var catWalkMotion = new Motion(catSetMatrices);  
var catJumpMotion = new Motion(catSetMatrices);
var mybox2Motion = new Motion(mybox2SetMatrices);  
var mybox2NoMotion = new Motion(mybox2SetMatrices); 
var boxmotion = mybox2NoMotion; 
var catMotion = catJumpMotion;
var isJumping = false;
var head, neck, 
body1, body2, body3, 
frontl1, frontl2, frontl3, 
frontr1, frontr2, frontr3, 
rearl1, rearl2, rearl3, 
rearr1, rearr2, rearr3, 
tail;
var headlink, necklink, 
bodylink1, bodylink2, bodylink3, 
frontllink1, frontllink2, frontllink3, 
frontrlink1, frontrlink2, frontrlink3,
rearllink1, rearllink2, rearllink3, 
rearrlink1, rearrlink2, rearrlink3, 
taillink;




/// SPACING THINGS OUT TO MAKE IT EASIER TO SEE THE CODE FOR THE CAT

//////////////////////////////////////////////////////////
//  initCamera():   SETUP CAMERA
//////////////////////////////////////////////////////////

function initCamera() {
    // set up M_proj    (internally:  camera.projectionMatrix )
    var cameraFov = 30;     // initial camera vertical field of view, in degrees
      // view angle, aspect ratio, near, far
    camera = new THREE.PerspectiveCamera(cameraFov,1,0.1,1000); 

    var width = 10;  var height = 5;
//    camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 0.1, 1000 );

    // set up M_view:   (internally:  camera.matrixWorldInverse )
    camera.position.set(0,12,20);
    camera.up = new THREE.Vector3(0,1,0);
    camera.lookAt(0,0,0);
    scene.add(camera);

      // SETUP ORBIT CONTROLS OF THE CAMERA
//    const controls = new OrbitControls( camera, renderer.domElement );
    var controls = new THREE.OrbitControls(camera);
    controls.damping = 0.2;
    controls.autoRotate = false;
};

// ADAPT TO WINDOW RESIZE
function resize() {
  renderer.setSize(window.innerWidth,window.innerHeight);
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
}

//SCROLLBAR FUNCTION DISABLE
window.onscroll = function () {
     window.scrollTo(0,0);
}

////////////////////////////////////////////////////////////////////////	
// init():  setup up scene
////////////////////////////////////////////////////////////////////////	

function init() {
    console.log('init called');

    initCamera();
    initMotions();
    initLights();
    initObjects();
    initHand();
    initCat();
    initFileObjects();

    window.addEventListener('resize',resize);
    resize();
};

////////////////////////////////////////////////////////////////////////
// initMotions():  setup Motion instances for each object that we wish to animate
////////////////////////////////////////////////////////////////////////

function initMotions() {

      // keyframes for the mybox animated motion:   name, time, [x, y, z, theta]
    myboxMotion.addKeyFrame(new Keyframe('pose A',0.0, [0, 0, -10, 0]));
    myboxMotion.addKeyFrame(new Keyframe('pose B',1.0, [-3, 0, -10, -90]));
    myboxMotion.addKeyFrame(new Keyframe('pose C',2.0, [-3, 10, -10, 0]));
    myboxMotion.addKeyFrame(new Keyframe('pose D',3.0, [0, 10, -10, 0]));
    myboxMotion.addKeyFrame(new Keyframe('pose A',4.0, [0, 0, -10, 0]));

    mybox2Motion.addKeyFrame(new Keyframe('pose A',0.0, [-2, 1, 3, 0]));
    mybox2Motion.addKeyFrame(new Keyframe('pose B',1.0, [12, 1, 3, 0]));
    mybox2Motion.addKeyFrame(new Keyframe('pose C',2.0, [12, 10, 3, 0]));
    mybox2Motion.addKeyFrame(new Keyframe('pose D',3.0, [-2, 10, 3, 0]));
    mybox2Motion.addKeyFrame(new Keyframe('pose A',4.0, [-2, 1, 3, 0]));

    mybox2NoMotion.addKeyFrame(new Keyframe('pose A',0.0, [-2, 1, 3, 0]));
    mybox2NoMotion.addKeyFrame(new Keyframe('pose B',1.0, [-2, 1, 3, 0]));
    mybox2NoMotion.addKeyFrame(new Keyframe('pose C',2.0, [-2, 1, 3, 0]));
    mybox2NoMotion.addKeyFrame(new Keyframe('pose D',3.0, [-2, 1, 3, 0]));
    mybox2NoMotion.addKeyFrame(new Keyframe('pose A',4.0, [-2, 1, 3, 0]));

      // basic interpolation test, just printing interpolation result to the console
    myboxMotion.currTime = 0.1;
    console.log('kf',myboxMotion.currTime,'=',myboxMotion.getAvars());    // interpolate for t=0.1
    myboxMotion.currTime = 2.9;
    console.log('kf',myboxMotion.currTime,'=',myboxMotion.getAvars());    // interpolate for t=2.9

      // keyframes for hand:    name, time, [x, y, theta1, theta2, theta3, theta4, theta5]
    handMotion.addKeyFrame(new Keyframe('straight',         0.0, [0, 3,    0, 0, 0, 0, 0]));
    handMotion.addKeyFrame(new Keyframe('right finger curl',1.0, [0, 3,    90, +150, -90, 0,0]));
    handMotion.addKeyFrame(new Keyframe('straight',         2.0, [0, 3,    0, 0, 0, 0, 0]));
    handMotion.addKeyFrame(new Keyframe('left finger curl', 3.0, [0, 3,    90, 0, 0, -90,-90]));
    handMotion.addKeyFrame(new Keyframe('straight',         4.0, [0, 3,    0, 0, 0, 0, 0]));
    handMotion.addKeyFrame(new Keyframe('both fingers curl',4.5, [0, 3,    90, -150, -90, -90,-90]));
    handMotion.addKeyFrame(new Keyframe('straight',         6.0, [0, 3,    0, 0, 0, 0, 0]));





    // keyframes for cat                                        x   y      n   b1  b2 b3  t  fl1  fl2  fl3 fr1  fr2  fr3 rl1  rl2 rl3  rr1  rr2  rr3  h
    catWalkMotion.addKeyFrame(new Keyframe('rest',       0.0, [0, 3.5,    -20, 7, -7, 2, 13, -45, 90, -45, -45,   0,  0, -40, 90, -25, -65, 90, -80, 15]));
    catWalkMotion.addKeyFrame(new Keyframe('walk1',      0.5, [0, 3.5,    -23, 7, -2, 7, 23, -45, 90, -45, -30,   0,  0, -40, 80, -10, -55, 90, -80, 15]));
    catWalkMotion.addKeyFrame(new Keyframe('walk2',      1.0, [0, 3.5,    -20, 7, -2, 2, 13, -75, 0,    0, -20,   0,  0, -40, 60, -10, -45, 70, -60, 15]));
    catWalkMotion.addKeyFrame(new Keyframe('walk3',      1.5, [0, 3.5,    -20, 7, -7, 2, 23, -50, 40,  -5, -10,   0,  0, -25, 20,  -9, -65, 60, -40, 15]));
    catWalkMotion.addKeyFrame(new Keyframe('walk4',      2.0, [0, 3.5,    -23, 7, -2, 7, 13, -47, 43,  -7,  15,   5,  5, -10,  0,  -5, -70, 15,  -5, 15]));
    catWalkMotion.addKeyFrame(new Keyframe('walk5',      2.5, [0, 3.5,    -20, 7, -2, 2, 23, -45, 45, -10,   5,   0,  0,  10, 50,  10, -45, 60,  35, 15]));
    catWalkMotion.addKeyFrame(new Keyframe('walk6',      3.0, [0, 3.5,    -20, 7, -7, 2, 13, -40, 55, -15, -50, -30, 25, -25, 10,  20,  30,  0,  50, 15]));
    catWalkMotion.addKeyFrame(new Keyframe('walk6',      3.5, [0, 3.5,    -23, 7, -2, 7, 23, -43, 75, -35, -47, -15, 10, -35, 50, -15,   0, 45, -40, 15]));
    catWalkMotion.addKeyFrame(new Keyframe('rest',       4.0, [0, 3.5,    -20, 7, -7, 2, 13, -45, 90, -45, -45,   0,  0, -40, 90, -25, -65, 90, -80, 15]));

    // keyframes for cat                                       x   y       n     b1  b2  b3  t  fl1  fl2  fl3 fr1  fr2  fr3 rl1  rl2 rl3  rr1  rr2    rr3  h
    catJumpMotion.addKeyFrame(new Keyframe('rest',       0.0, [0, 3.5,    -20,   7, -7,  2, 13, -45, 90, -45, -45,   0,   0, -40, 90, -25, -65, 90,  -80, 15]));
    catJumpMotion.addKeyFrame(new Keyframe('jump1',      0.5, [0,15.0,    -45, -27,-13,-12,-30, -55,110,-145, -55, 110,-145,  40, 30,  -5,  40, 30,   35, 15]));
    catJumpMotion.addKeyFrame(new Keyframe('jump2',      1.0, [0,15.0,    -40, -20,  0,  0,-25, -65,110, -65, -65, 110, -65,  40,  0,   0,  40,  0,   65, 15]));
    catJumpMotion.addKeyFrame(new Keyframe('jump3',      1.5, [0,10.0,    -20,  25, 15,  5, 25, -55, 50, -15, -55,  50, -15,  50, 10,  10,  50, 10,   15, 15]));
    catJumpMotion.addKeyFrame(new Keyframe('jump4',      2.0, [0, 7.0,    -10,  10, 25, 12,  0, -45, 10,  -5, -45,  10,  -5,  60, 10,  10,  60, 10,    5, 15]));
    catJumpMotion.addKeyFrame(new Keyframe('jump5',      2.5, [0, 4.0,      0, -20, 15,  6,  0, -35,  0,   0, -35,   0,   0,  40,  0,   0,  40,  0,    0, 15]));
    catJumpMotion.addKeyFrame(new Keyframe('jump6',      3.0, [0, 1.0,     15, -15,  5, -5,  5, -35, 50, -25, -35,  50, -25,   0, 30, -15,   0, 30,  -30, 15]));
    catJumpMotion.addKeyFrame(new Keyframe('jump7',      3.5, [0, 2.0,      0,  -5,-15,-10, 10, -40, 90, -35, -40,  25, -15, -20, 50, -45, -35, 50,  -50, 15]));
    catJumpMotion.addKeyFrame(new Keyframe('rest',       4.0, [0, 3.5,    -20,   7, -7,  2, 13, -45, 90, -45, -45,   0,   0, -40, 90, -25, -65, 90,  -80, 15]));
}

///////////////////////////////////////////////////////////////////////////////////////
// myboxSetMatrices(avars)
///////////////////////////////////////////////////////////////////////////////////////

function myboxSetMatrices(avars) {
    // note:  in the code below, we use the same keyframe information to animation both
    //        the box and the dragon, i.e., avars[], although only the dragon uses avars[3], as a rotation

     // update position of a box
    mybox.matrixAutoUpdate = false;     // tell three.js not to over-write our updates
    mybox.matrix.identity();              
    mybox.matrix.multiply(new THREE.Matrix4().makeTranslation(avars[0], avars[1], avars[2]));
    mybox.matrix.multiply(new THREE.Matrix4().makeRotationX(-Math.PI/2));
    mybox.matrix.multiply(new THREE.Matrix4().makeScale(1.0,1.0,1.0));
    mybox.updateMatrixWorld();  

     // update position of a dragon
    var theta = avars[3]*deg2rad;
    meshes["dragon1"].matrixAutoUpdate = false;
    meshes["dragon1"].matrix.identity();
    meshes["dragon1"].matrix.multiply(new THREE.Matrix4().makeTranslation(avars[0],avars[1],-10));  
    meshes["dragon1"].matrix.multiply(new THREE.Matrix4().makeRotationX(theta));  
    meshes["dragon1"].matrix.multiply(new THREE.Matrix4().makeScale(0.3,0.3,0.3));
    meshes["dragon1"].updateMatrixWorld();  
}

function mybox2SetMatrices(avars) {
mybox2.matrixAutoUpdate = false;     // tell three.js not to over-write our updates
    mybox2.matrix.identity();              
    mybox2.matrix.multiply(new THREE.Matrix4().makeTranslation(avars[0], avars[1], 3));
    mybox2.matrix.multiply(new THREE.Matrix4().makeRotationX(-Math.PI/2));
    mybox2.matrix.multiply(new THREE.Matrix4().makeScale(1.0,1.0,1.0));
    mybox2.updateMatrixWorld(); 

}

///////////////////////////////////////////////////////////////////////////////////////
// handSetMatrices(avars)
///////////////////////////////////////////////////////////////////////////////////////

function handSetMatrices(avars) {
    var xPosition = avars[0];
    var yPosition = avars[1];
    var theta1 = avars[2]*deg2rad;
    var theta2 = avars[3]*deg2rad;
    var theta3 = avars[4]*deg2rad;
    var theta4 = avars[5]*deg2rad;
    var theta5 = avars[6]*deg2rad;
    var M =  new THREE.Matrix4();
    
      ////////////// link1 
    linkFrame1.matrix.identity(); 
    linkFrame1.matrix.multiply(M.makeTranslation(xPosition,yPosition,-10));   
    linkFrame1.matrix.multiply(M.makeRotationX(theta1));    
      // Frame 1 has been established, now setup the extra transformations for the scaled box geometry
    link1.matrix.copy(linkFrame1.matrix);
    link1.matrix.multiply(M.makeTranslation(2,0,0));
    link1.matrix.multiply(M.makeScale(6,1,3));    

      ////////////// link2
    linkFrame2.matrix.copy(linkFrame1.matrix);      // start with parent frame
    linkFrame2.matrix.multiply(M.makeTranslation(5,0,1));
    linkFrame2.matrix.multiply(M.makeRotationZ(theta2));    
      // Frame 2 has been established, now setup the extra transformations for the scaled box geometry
    link2.matrix.copy(linkFrame2.matrix);
    link2.matrix.multiply(M.makeTranslation(2,0,0));   
    link2.matrix.multiply(M.makeScale(4,1,1));    

      ///////////////  link3
    linkFrame3.matrix.copy(linkFrame2.matrix);
    linkFrame3.matrix.multiply(M.makeTranslation(4,0,0));
    linkFrame3.matrix.multiply(M.makeRotationZ(theta3));    
      // Frame 3 has been established, now setup the extra transformations for the scaled box geometry
    link3.matrix.copy(linkFrame3.matrix);
    link3.matrix.multiply(M.makeTranslation(2,0,0));   
    link3.matrix.multiply(M.makeScale(4,1,1));    

      /////////////// link4
    linkFrame4.matrix.copy(linkFrame1.matrix);
    linkFrame4.matrix.multiply(M.makeTranslation(5,0,-1));
    linkFrame4.matrix.multiply(M.makeRotationZ(theta4));    
      // Frame 4 has been established, now setup the extra transformations for the scaled box geometry
    link4.matrix.copy(linkFrame4.matrix);
    link4.matrix.multiply(M.makeTranslation(2,0,0));   
    link4.matrix.multiply(M.makeScale(4,1,1));    

      // link5
    linkFrame5.matrix.copy(linkFrame4.matrix);
    linkFrame5.matrix.multiply(M.makeTranslation(4,0,0));
    linkFrame5.matrix.multiply(M.makeRotationZ(theta5));    
      // Frame 5 has been established, now setup the extra transformations for the scaled box geometry
    link5.matrix.copy(linkFrame5.matrix);
    link5.matrix.multiply(M.makeTranslation(2,0,0));   
    link5.matrix.multiply(M.makeScale(4,1,1));    

    link1.updateMatrixWorld();
    link2.updateMatrixWorld();
    link3.updateMatrixWorld();
    link4.updateMatrixWorld();
    link5.updateMatrixWorld();

    linkFrame1.updateMatrixWorld();
    linkFrame2.updateMatrixWorld();
    linkFrame3.updateMatrixWorld();
    linkFrame4.updateMatrixWorld();
    linkFrame5.updateMatrixWorld();
}






/// cat set matrices
function catSetMatrices(avars) {
  var xPosition = avars[0];
  var yPosition = avars[1];
  var theta1 = avars[2]*deg2rad;
  var theta2 = avars[3]*deg2rad;
  var theta3 = avars[4]*deg2rad;
  var theta4 = avars[5]*deg2rad;
  var theta5 = avars[6]*deg2rad;
  var theta6 = avars[7]*deg2rad;
  var theta7 = avars[8]*deg2rad;
  var theta8 = avars[9]*deg2rad;
  var theta9 = avars[10]*deg2rad;
  var theta10 = avars[11]*deg2rad;
  var theta11 = avars[12]*deg2rad;
  var theta12 = avars[13]*deg2rad;
  var theta13 = avars[14]*deg2rad;
  var theta14 = avars[15]*deg2rad;
  var theta15 = avars[16]*deg2rad;
  var theta16 = avars[17]*deg2rad;
  var theta17 = avars[18]*deg2rad;
  var theta18 = avars[19]*deg2rad;
  var M =  new THREE.Matrix4();
  
    ////////////// head
  headlink.matrix.identity(); 
  headlink.matrix.multiply(M.makeTranslation(xPosition,yPosition,3));   
  headlink.matrix.multiply(M.makeRotationZ(theta18)); 
  head.matrix.copy(headlink.matrix);
  head.matrix.multiply(M.makeTranslation(0.9,0,0));
  head.matrix.multiply(M.makeScale(1.8,1,1));    

    ////////////// neck
  necklink.matrix.copy(headlink.matrix);
  necklink.matrix.multiply(M.makeTranslation(1.8,0,0));  
  necklink.matrix.multiply(M.makeRotationZ(theta1)); 
  neck.matrix.copy(necklink.matrix);
  neck.matrix.multiply(M.makeTranslation(0,-0.5,0));
  neck.matrix.multiply(M.makeScale(1,-1,1));    

    ////////////// body1
  bodylink1.matrix.copy(necklink.matrix);
  bodylink1.matrix.multiply(M.makeTranslation(0,-1,0));
  bodylink1.matrix.multiply(M.makeRotationZ(theta2));
  body1.matrix.copy(bodylink1.matrix);
  body1.matrix.multiply(M.makeTranslation(1.5,0,0));
  body1.matrix.multiply(M.makeScale(3,1,1));   

  ////////////// body2
  bodylink2.matrix.copy(bodylink1.matrix);
  bodylink2.matrix.multiply(M.makeTranslation(3,0,0));
  bodylink2.matrix.multiply(M.makeRotationZ(theta3));
  body2.matrix.copy(bodylink2.matrix);
  body2.matrix.multiply(M.makeTranslation(0.5,0,0));
  body2.matrix.multiply(M.makeScale(1,1,1));  

  ////////////// body3
  bodylink3.matrix.copy(bodylink2.matrix);
  bodylink3.matrix.multiply(M.makeTranslation(1,0,0));
  bodylink3.matrix.multiply(M.makeRotationZ(theta4));
  body3.matrix.copy(bodylink3.matrix);
  body3.matrix.multiply(M.makeTranslation(1.5,0,0));
  body3.matrix.multiply(M.makeScale(3,1,1));

  ////////////// tail
  taillink.matrix.copy(bodylink3.matrix);
  taillink.matrix.multiply(M.makeTranslation(3,0,0));
  taillink.matrix.multiply(M.makeRotationZ(theta5));
  tail.matrix.copy(taillink.matrix);
  tail.matrix.multiply(M.makeTranslation(2.5,0,0));
  tail.matrix.multiply(M.makeScale(5,0.5,0.5));

  ////////////// frontl1
  frontllink1.matrix.copy(bodylink1.matrix);
  frontllink1.matrix.multiply(M.makeTranslation(1.5,0,1));
  frontllink1.matrix.multiply(M.makeRotationZ(theta6));
  frontl1.matrix.copy(frontllink1.matrix);
  frontl1.matrix.multiply(M.makeTranslation(0,-0.5,0));
  frontl1.matrix.multiply(M.makeScale(1,1.5,1));

  ////////////// frontl2
  frontllink2.matrix.copy(frontllink1.matrix);
  frontllink2.matrix.multiply(M.makeTranslation(0,-1,0));
  frontllink2.matrix.multiply(M.makeRotationZ(theta7));
  frontl2.matrix.copy(frontllink2.matrix);
  frontl2.matrix.multiply(M.makeTranslation(0,-0.5,0));
  frontl2.matrix.multiply(M.makeScale(0.8,1.5,0.8));

  ////////////// frontl3
  frontllink3.matrix.copy(frontllink2.matrix);
  frontllink3.matrix.multiply(M.makeTranslation(0,-1,0));
  frontllink3.matrix.multiply(M.makeRotationZ(theta8));
  frontl3.matrix.copy(frontllink3.matrix);
  frontl3.matrix.multiply(M.makeTranslation(0,-0.8,0));
  frontl3.matrix.multiply(M.makeScale(0.7,1.3,0.7));

  ////////////// frontr1
  frontrlink1.matrix.copy(bodylink1.matrix);
  frontrlink1.matrix.multiply(M.makeTranslation(1.5,0,-1));
  frontrlink1.matrix.multiply(M.makeRotationZ(theta9));
  frontr1.matrix.copy(frontrlink1.matrix);
  frontr1.matrix.multiply(M.makeTranslation(0,-0.5,0));
  frontr1.matrix.multiply(M.makeScale(1,1.5,1));

  ////////////// frontr2
  frontrlink2.matrix.copy(frontrlink1.matrix);
  frontrlink2.matrix.multiply(M.makeTranslation(0,-1,0));
  frontrlink2.matrix.multiply(M.makeRotationZ(theta10));
  frontr2.matrix.copy(frontrlink2.matrix);
  frontr2.matrix.multiply(M.makeTranslation(0,-0.5,0));
  frontr2.matrix.multiply(M.makeScale(0.8,1.5,0.8));

  ////////////// frontr3
  frontrlink3.matrix.copy(frontrlink2.matrix);
  frontrlink3.matrix.multiply(M.makeTranslation(0,-1,0));
  frontrlink3.matrix.multiply(M.makeRotationZ(theta11));
  frontr3.matrix.copy(frontrlink3.matrix);
  frontr3.matrix.multiply(M.makeTranslation(0,-0.8,0));
  frontr3.matrix.multiply(M.makeScale(0.7,1.3,0.7));

  ////////////// rearl1
  rearllink1.matrix.copy(bodylink3.matrix);
  rearllink1.matrix.multiply(M.makeTranslation(1.5,0,1));
  rearllink1.matrix.multiply(M.makeRotationZ(theta12));
  rearl1.matrix.copy(rearllink1.matrix);
  rearl1.matrix.multiply(M.makeTranslation(0,-0.5,0));
  rearl1.matrix.multiply(M.makeScale(1,1.5,1));

  ////////////// rearl2
  rearllink2.matrix.copy(rearllink1.matrix);
  rearllink2.matrix.multiply(M.makeTranslation(0,-1,0));
  rearllink2.matrix.multiply(M.makeRotationZ(theta13));
  rearl2.matrix.copy(rearllink2.matrix);
  rearl2.matrix.multiply(M.makeTranslation(0,-0.5,0));
  rearl2.matrix.multiply(M.makeScale(0.8,1.5,0.8));

  ////////////// rearl3
  rearllink3.matrix.copy(rearllink2.matrix);
  rearllink3.matrix.multiply(M.makeTranslation(0,-1,0));
  rearllink3.matrix.multiply(M.makeRotationZ(theta14));
  rearl3.matrix.copy(rearllink3.matrix);
  rearl3.matrix.multiply(M.makeTranslation(0,-0.8,0));
  rearl3.matrix.multiply(M.makeScale(0.7,1.5,0.7));

  ////////////// rearr1
  rearrlink1.matrix.copy(bodylink3.matrix);
  rearrlink1.matrix.multiply(M.makeTranslation(1.5,0,-1));
  rearrlink1.matrix.multiply(M.makeRotationZ(theta15));
  rearr1.matrix.copy(rearrlink1.matrix);
  rearr1.matrix.multiply(M.makeTranslation(0,-0.5,0));
  rearr1.matrix.multiply(M.makeScale(1,1.5,1));

  ////////////// rearr2
  rearrlink2.matrix.copy(rearrlink1.matrix);
  rearrlink2.matrix.multiply(M.makeTranslation(0,-1,0));
  rearrlink2.matrix.multiply(M.makeRotationZ(theta16));
  rearr2.matrix.copy(rearrlink2.matrix);
  rearr2.matrix.multiply(M.makeTranslation(0,-0.5,0));
  rearr2.matrix.multiply(M.makeScale(0.8,1.5,0.8));

  ////////////// rearr3
  rearrlink3.matrix.copy(rearrlink2.matrix);
  rearrlink3.matrix.multiply(M.makeTranslation(0,-1,0));
  rearrlink3.matrix.multiply(M.makeRotationZ(theta17));
  rearr3.matrix.copy(rearrlink3.matrix);
  rearr3.matrix.multiply(M.makeTranslation(0,-0.8,0));
  rearr3.matrix.multiply(M.makeScale(0.7,1.5,0.7));

  head.updateMatrixWorld();
  neck.updateMatrixWorld();
  body1.updateMatrixWorld();
  body2.updateMatrixWorld();
  body3.updateMatrixWorld();
  tail.updateMatrixWorld();
  frontl1.updateMatrixWorld();
  frontl1.updateMatrixWorld();
  frontl1.updateMatrixWorld();
  frontr1.updateMatrixWorld();
  frontr2.updateMatrixWorld();
  frontr3.updateMatrixWorld();
  rearl1.updateMatrixWorld();
  rearl2.updateMatrixWorld();
  rearl3.updateMatrixWorld();
  rearr1.updateMatrixWorld();
  rearr2.updateMatrixWorld();
  rearr3.updateMatrixWorld();

  headlink.updateMatrixWorld();   
  necklink.updateMatrixWorld(); 
  bodylink1.updateMatrixWorld();  
  bodylink2.updateMatrixWorld();   
  bodylink3.updateMatrixWorld();
  taillink.updateMatrixWorld();
  frontllink1.updateMatrixWorld(); 
  frontllink2.updateMatrixWorld();   
  frontllink3.updateMatrixWorld();
  frontrlink1.updateMatrixWorld();   
  frontrlink2.updateMatrixWorld(); 
  frontrlink3.updateMatrixWorld();
  rearllink1.updateMatrixWorld();  
  rearllink2.updateMatrixWorld();   
  rearllink3.updateMatrixWorld();
  rearrlink1.updateMatrixWorld(); 
  rearrlink2.updateMatrixWorld(); 
  rearrlink3.updateMatrixWorld();
}





/////////////////////////////////////	
// initLights():  SETUP LIGHTS
/////////////////////////////////////	

function initLights() {
    light = new THREE.PointLight(0xffffff);
    light.position.set(-8,4,30);
    scene.add(light);
    ambientLight = new THREE.AmbientLight(0x606060);
    scene.add(ambientLight);
}

/////////////////////////////////////	
// MATERIALS
/////////////////////////////////////	

var diffuseMaterial = new THREE.MeshLambertMaterial( {color: 0xffffff} );
var diffuseMaterial2 = new THREE.MeshLambertMaterial( {color: 0xffffff, side: THREE.DoubleSide } );
var basicMaterial = new THREE.MeshBasicMaterial( {color: 0xff0000} );
var armadilloMaterial = new THREE.MeshBasicMaterial( {color: 0x7fff7f} );

/////////////////////////////////////	
// initObjects():  setup objects in the scene
/////////////////////////////////////	

function initObjects() {
    var worldFrame = new THREE.AxesHelper(5) ;
    scene.add(worldFrame);

    // mybox 
    var myboxGeometry = new THREE.BoxGeometry( 1, 1, 1 );    // width, height, depth
    mybox = new THREE.Mesh( myboxGeometry, diffuseMaterial );
    mybox.position.set(4,4,-10);
    scene.add( mybox );

    var boxTexture = new THREE.TextureLoader().load('images/luckyblock.png');
    var luckyblockMaterial = new THREE.MeshBasicMaterial( {map: boxTexture} );
    mybox2 = new THREE.Mesh( myboxGeometry, luckyblockMaterial );
    mybox2.position.set(-2,1,3);
    scene.add( mybox2 );

    // textured floor
    var floorTexture = new THREE.TextureLoader().load('images/floor.jpg');
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(1, 1);
    var floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture, side: THREE.DoubleSide });
    var floorGeometry = new THREE.PlaneGeometry(15, 15);
    var floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.y = -1.1;
    floor.rotation.x = Math.PI / 2;
    scene.add(floor);

    // sphere, located at light position
    var sphereGeometry = new THREE.SphereGeometry(0.3, 32, 32);    // radius, segments, segments
    sphere = new THREE.Mesh(sphereGeometry, basicMaterial);
    sphere.position.set(0,4,-8);
    sphere.position.set(light.position.x, light.position.y, light.position.z);
    scene.add(sphere);

    // box
    var boxGeometry = new THREE.BoxGeometry( 1, 1, 1 );    // width, height, depth
    var box = new THREE.Mesh( boxGeometry, diffuseMaterial );
    box.position.set(-4, 0, -10);
    scene.add( box );

    // multi-colored cube      [https://stemkoski.github.io/Three.js/HelloWorld.html] 
    var cubeMaterialArray = [];    // order to add materials: x+,x-,y+,y-,z+,z-
    cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0xff3333 } ) );
    cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0xff8800 } ) );
    cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0xffff33 } ) );
    cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0x33ff33 } ) );
    cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0x3333ff } ) );
    cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0x8833ff } ) );
      // Cube parameters: width (x), height (y), depth (z), 
      //        (optional) segments along x, segments along y, segments along z
    var mccGeometry = new THREE.BoxGeometry( 1.5, 1.5, 1.5, 1, 1, 1 );
    var mcc = new THREE.Mesh( mccGeometry, cubeMaterialArray );
    mcc.position.set(0,0,-10);
    scene.add( mcc );	

    // cylinder
    // parameters:  radiusAtTop, radiusAtBottom, height, radialSegments, heightSegments
    var cylinderGeometry = new THREE.CylinderGeometry( 0.30, 0.30, 0.80, 20, 4 );
    var cylinder = new THREE.Mesh( cylinderGeometry, diffuseMaterial);
    cylinder.position.set(2, 0, -10);
    scene.add( cylinder );

    // cone:   parameters --  radiusTop, radiusBot, height, radialSegments, heightSegments
    var coneGeometry = new THREE.CylinderGeometry( 0.0, 0.30, 0.80, 20, 4 );
    var cone = new THREE.Mesh( coneGeometry, diffuseMaterial);
    cone.position.set(4, 0, -10);
    scene.add( cone);

    // torus:   parameters -- radius, diameter, radialSegments, torusSegments
    var torusGeometry = new THREE.TorusGeometry( 1.2, 0.4, 10, 20 );
    var torus = new THREE.Mesh( torusGeometry, diffuseMaterial);

    torus.rotation.set(0,0,-10);     // rotation about x,y,z axes
    torus.scale.set(1,2,3);
    torus.position.set(-6, 0, -10);   // translation

    scene.add( torus );

    /////////////////////////////////////
    //  CUSTOM OBJECT 
    ////////////////////////////////////
    
    var geom = new THREE.Geometry(); 
    var v0 = new THREE.Vector3(0,0,0);
    var v1 = new THREE.Vector3(3,0,0);
    var v2 = new THREE.Vector3(0,3,0);
    var v3 = new THREE.Vector3(3,3,0);
    
    geom.vertices.push(v0);
    geom.vertices.push(v1);
    geom.vertices.push(v2);
    geom.vertices.push(v3);
    
    geom.faces.push( new THREE.Face3( 0, 1, 2 ) );
    geom.faces.push( new THREE.Face3( 1, 3, 2 ) );
    geom.computeFaceNormals();
    
    customObject = new THREE.Mesh( geom, diffuseMaterial );
    customObject.position.set(0, 0, -8);
    scene.add(customObject);
}

/////////////////////////////////////////////////////////////////////////////////////
//  initHand():  define all geometry associated with the hand
/////////////////////////////////////////////////////////////////////////////////////

function initHand() {
    var handMaterial = new THREE.MeshLambertMaterial( {color: 0xffffff} );
    var boxGeometry = new THREE.BoxGeometry( 1, 1, 1 );    // width, height, depth

    link1 = new THREE.Mesh( boxGeometry, handMaterial );  scene.add( link1 );
    linkFrame1   = new THREE.AxesHelper(1) ;   scene.add(linkFrame1);
    link2 = new THREE.Mesh( boxGeometry, handMaterial );  scene.add( link2 );
    linkFrame2   = new THREE.AxesHelper(1) ;   scene.add(linkFrame2);
    link3 = new THREE.Mesh( boxGeometry, handMaterial );  scene.add( link3 );
    linkFrame3   = new THREE.AxesHelper(1) ;   scene.add(linkFrame3);
    link4 = new THREE.Mesh( boxGeometry, handMaterial );  scene.add( link4 );
    linkFrame4   = new THREE.AxesHelper(1) ;   scene.add(linkFrame4);
    link5 = new THREE.Mesh( boxGeometry, handMaterial );  scene.add( link5 );
    linkFrame5   = new THREE.AxesHelper(1) ;   scene.add(linkFrame5);

    link1.matrixAutoUpdate = false;  
    link2.matrixAutoUpdate = false;  
    link3.matrixAutoUpdate = false;  
    link4.matrixAutoUpdate = false;  
    link5.matrixAutoUpdate = false;
    linkFrame1.matrixAutoUpdate = false;  
    linkFrame2.matrixAutoUpdate = false;  
    linkFrame3.matrixAutoUpdate = false;  
    linkFrame4.matrixAutoUpdate = false;  
    linkFrame5.matrixAutoUpdate = false;
}





/// INIT CAT

function initCat() {
  var catMaterial = new THREE.MeshLambertMaterial( {color: 0xe75480} );
  var boxGeometry = new THREE.BoxGeometry( 1, 1, 1 );    // width, height, depth

  head = new THREE.Mesh( boxGeometry, catMaterial );  scene.add( head );
  neck = new THREE.Mesh( boxGeometry, catMaterial );  scene.add( neck );
  body1 = new THREE.Mesh( boxGeometry, catMaterial );  scene.add( body1 );
  body2 = new THREE.Mesh( boxGeometry, catMaterial );  scene.add( body2 );
  body3 = new THREE.Mesh( boxGeometry, catMaterial );  scene.add( body3 );
  tail = new THREE.Mesh( boxGeometry, catMaterial );  scene.add( tail );
  frontl1 = new THREE.Mesh( boxGeometry, catMaterial );  scene.add( frontl1 );
  frontl2 = new THREE.Mesh( boxGeometry, catMaterial );  scene.add( frontl2 );
  frontl3 = new THREE.Mesh( boxGeometry, catMaterial );  scene.add( frontl3 );
  frontr1 = new THREE.Mesh( boxGeometry, catMaterial );  scene.add( frontr1 );
  frontr2 = new THREE.Mesh( boxGeometry, catMaterial );  scene.add( frontr2 );
  frontr3 = new THREE.Mesh( boxGeometry, catMaterial );  scene.add( frontr3 );
  rearl1 = new THREE.Mesh( boxGeometry, catMaterial );  scene.add( rearl1 );
  rearl2 = new THREE.Mesh( boxGeometry, catMaterial );  scene.add( rearl2 );
  rearl3 = new THREE.Mesh( boxGeometry, catMaterial );  scene.add( rearl3 );
  rearr1 = new THREE.Mesh( boxGeometry, catMaterial );  scene.add( rearr1 );
  rearr2 = new THREE.Mesh( boxGeometry, catMaterial );  scene.add( rearr2 );
  rearr3 = new THREE.Mesh( boxGeometry, catMaterial );  scene.add( rearr3 );

  headlink   = new THREE.AxesHelper(1) ;   scene.add(headlink);
  necklink   = new THREE.AxesHelper(1) ;   scene.add(necklink);
  bodylink1   = new THREE.AxesHelper(1) ;   scene.add(bodylink1);
  bodylink2   = new THREE.AxesHelper(1) ;   scene.add(bodylink2);
  bodylink3   = new THREE.AxesHelper(1) ;   scene.add(bodylink3);
  taillink   = new THREE.AxesHelper(1) ;   scene.add(taillink);
  frontllink1   = new THREE.AxesHelper(1) ;   scene.add(frontllink1);
  frontllink2   = new THREE.AxesHelper(1) ;   scene.add(frontllink2);
  frontllink3   = new THREE.AxesHelper(1) ;   scene.add(frontllink3);
  frontrlink1   = new THREE.AxesHelper(1) ;   scene.add(frontrlink1);
  frontrlink2   = new THREE.AxesHelper(1) ;   scene.add(frontrlink2);
  frontrlink3   = new THREE.AxesHelper(1) ;   scene.add(frontrlink3);
  rearllink1   = new THREE.AxesHelper(1) ;   scene.add(rearllink1);
  rearllink2   = new THREE.AxesHelper(1) ;   scene.add(rearllink2);
  rearllink3   = new THREE.AxesHelper(1) ;   scene.add(rearllink3);
  rearrlink1   = new THREE.AxesHelper(1) ;   scene.add(rearrlink1);
  rearrlink2   = new THREE.AxesHelper(1) ;   scene.add(rearrlink2);
  rearrlink3   = new THREE.AxesHelper(1) ;   scene.add(rearrlink3);

  head.matrixAutoUpdate = false;  
  neck.matrixAutoUpdate = false;  
  body1.matrixAutoUpdate = false;  
  body2.matrixAutoUpdate = false;  
  body3.matrixAutoUpdate = false;
  tail.matrixAutoUpdate = false;
  frontl1.matrixAutoUpdate = false;  
  frontl2.matrixAutoUpdate = false;  
  frontl3.matrixAutoUpdate = false;
  frontr1.matrixAutoUpdate = false;  
  frontr2.matrixAutoUpdate = false;  
  frontr3.matrixAutoUpdate = false;
  rearl1.matrixAutoUpdate = false;  
  rearl2.matrixAutoUpdate = false;  
  rearl3.matrixAutoUpdate = false;
  rearr1.matrixAutoUpdate = false;  
  rearr2.matrixAutoUpdate = false;  
  rearr3.matrixAutoUpdate = false;

  headlink.matrixAutoUpdate = false;  
  necklink.matrixAutoUpdate = false;  
  bodylink1.matrixAutoUpdate = false;  
  bodylink2.matrixAutoUpdate = false;  
  bodylink3.matrixAutoUpdate = false;
  taillink.matrixAutoUpdate = false;
  frontllink1.matrixAutoUpdate = false;  
  frontllink2.matrixAutoUpdate = false;  
  frontllink3.matrixAutoUpdate = false;
  frontrlink1.matrixAutoUpdate = false;  
  frontrlink2.matrixAutoUpdate = false;  
  frontrlink3.matrixAutoUpdate = false;
  rearllink1.matrixAutoUpdate = false;  
  rearllink2.matrixAutoUpdate = false;  
  rearllink3.matrixAutoUpdate = false;
  rearrlink1.matrixAutoUpdate = false;  
  rearrlink2.matrixAutoUpdate = false;  
  rearrlink3.matrixAutoUpdate = false;
}





/////////////////////////////////////////////////////////////////////////////////////
//  create customShader material
/////////////////////////////////////////////////////////////////////////////////////

var customShaderMaterial = new THREE.ShaderMaterial( {
//        uniforms: { textureSampler: {type: 't', value: floorTexture}},
	vertexShader: document.getElementById( 'customVertexShader' ).textContent,
	fragmentShader: document.getElementById( 'customFragmentShader' ).textContent
} );

// var ctx = renderer.context;
// ctx.getShaderInfoLog = function () { return '' };   // stops shader warnings, seen in some browsers

////////////////////////////////////////////////////////////////////////	
// initFileObjects():    read object data from OBJ files;  see onResourcesLoaded() for instances
////////////////////////////////////////////////////////////////////////	

var models;

function initFileObjects() {
        // list of OBJ files that we want to load, and their material
    models = {     
      teapot:    {obj:"obj/teapot.obj", mtl: customShaderMaterial, mesh: null	},
      armadillo: {obj:"obj/armadillo.obj", mtl: customShaderMaterial, mesh: null },
      dragon:    {obj:"obj/dragon.obj", mtl: customShaderMaterial, mesh: null }
    };

    var manager = new THREE.LoadingManager();
    manager.onLoad = function () {
      console.log("loaded all resources");
      RESOURCES_LOADED = true;
      onResourcesLoaded();
    }
    var onProgress = function ( xhr ) {
      if ( xhr.lengthComputable ) {
          var percentComplete = xhr.loaded / xhr.total * 100;
          console.log( Math.round(percentComplete, 2) + '% downloaded' );
      }
    };
    var onError = function ( xhr ) {
    };

    // Load models;  asynchronous in JS, so wrap code in a fn and pass it the index
    for( var _key in models ){
      console.log('Key:', _key);
      (function(key){
          var objLoader = new THREE.OBJLoader( manager );
          objLoader.load( models[key].obj, function ( object ) {
            object.traverse( function ( child ) {
                if ( child instanceof THREE.Mesh ) {
                  child.material = models[key].mtl;
                  child.material.shading = THREE.SmoothShading;
                }	} );
            models[key].mesh = object;
          }, onProgress, onError );
      })(_key);
    }
}

/////////////////////////////////////////////////////////////////////////////////////
// onResourcesLoaded():  once all OBJ files are loaded, this gets called.
//                       Object instancing is done here
/////////////////////////////////////////////////////////////////////////////////////

function onResourcesLoaded(){
	
 // Clone models into meshes;   [Michiel:  AFAIK this makes a "shallow" copy of the model,
 //                             i.e., creates references to the geometry, and not full copies ]
    meshes["armadillo1"] = models.armadillo.mesh.clone();
    meshes["armadillo2"] = models.armadillo.mesh.clone();
    meshes["dragon1"] = models.dragon.mesh.clone();
    meshes["teapot1"] = models.teapot.mesh.clone();
    meshes["teapot2"] = models.teapot.mesh.clone();
    
    // position the object instances and parent them to the scene, i.e., WCS
    // For static objects in your scene, it is ok to use the default postion / rotation / scale
    // to build the object-to-world transformation matrix. This is what we do below.
    //
    // Three.js builds the transformation matrix according to:  M = T*R*S,
    // where T = translation, according to position.set()
    //       R = rotation, according to rotation.set(), and which implements the following "Euler angle" rotations:
    //            R = Rx * Ry * Rz
    //       S = scale, according to scale.set()
    
    meshes["armadillo1"].position.set(-6, 1.5, -8);
    meshes["armadillo1"].rotation.set(0,-Math.PI/2,0);
    meshes["armadillo1"].scale.set(1,1,1);
    scene.add(meshes["armadillo1"]);

    meshes["armadillo2"].position.set(-3, 1.5, -12);
    meshes["armadillo2"].rotation.set(0,-Math.PI/2,0);
    meshes["armadillo2"].scale.set(1,1,1);
    scene.add(meshes["armadillo2"]);

      // note:  the local transformations described by the following position, rotation, and scale
      // are overwritten by the animation loop for this particular object, which directly builds the
      // dragon1-to-world transformation matrix
    meshes["dragon1"].position.set(-5, 0.2, -6);
    meshes["dragon1"].rotation.set(0, Math.PI, 0);
    meshes["dragon1"].scale.set(0.3,0.3,0.3);
    scene.add(meshes["dragon1"]);

    meshes["teapot1"].position.set(3, 0, -5);
    meshes["teapot1"].scale.set(0.5, 0.5, 0.5);
    scene.add(meshes["teapot1"]);

    meshes["teapot2"].position.set(3, 0, -4);
    meshes["teapot2"].scale.set(0.25, 0.25, 0.25);
    scene.add(meshes["teapot2"]);

    meshesLoaded = true;
}


///////////////////////////////////////////////////////////////////////////////////////
// LISTEN TO KEYBOARD
///////////////////////////////////////////////////////////////////////////////////////

// movement
document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    var keyCode = event.which;
    // up
    if (keyCode == "W".charCodeAt()) {          // W = up
        light.position.y += 0.11;
        // down
    } else if (keyCode == "S".charCodeAt()) {   // S = down
        light.position.y -= 0.11;
        // left
    } else if (keyCode == "A".charCodeAt()) {   // A = left
	light.position.x -= 0.1;
        // right
    } else if (keyCode == "D".charCodeAt()) {   // D = right
        light.position.x += 0.11;
    } else if (keyCode == " ".charCodeAt()) {   // space
	animation = !animation;
    } else if (keyCode == "J".charCodeAt()) {   // J = change animation
      isJumping = true;
    }
    else if (keyCode == "K".charCodeAt()) {   // K = change animation
      isJumping = false;
    }
};


///////////////////////////////////////////////////////////////////////////////////////
// UPDATE CALLBACK:    This is the main animation loop
///////////////////////////////////////////////////////////////////////////////////////

function update() {
//    console.log('update()');
    var dt=0.02;
    if (animation && meshesLoaded) {
	// advance the motion of all the animated objects
	myboxMotion.timestep(dt);
   	handMotion.timestep(dt);
    if (catMotion.currTime + dt > catMotion.maxTime) {
      if (isJumping) {
        catMotion = catJumpMotion;
        boxmotion = mybox2Motion
      } else {
        catMotion = catWalkMotion;
        boxmotion = mybox2NoMotion
      }
    }
    boxmotion.timestep(dt);
    catMotion.timestep(dt);
    }
    if (meshesLoaded) {
	sphere.position.set(light.position.x, light.position.y, light.position.z);
	renderer.render(scene, camera);
    }
    requestAnimationFrame(update);      // requests the next update call;  this creates a loop
}

init();
update();

