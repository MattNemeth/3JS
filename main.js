import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
// import { ColorGUIHelper  } from './ColorGUIHelper.js';
import floorTexture from './public/checker.png';
import objFile from './public/block_MN.glb';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { modelDirection } from 'three/webgpu';


// WebGL compatibility check
if ( WebGL.isWebGL2Available() ) {

    const fov = 35;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 0.1;
    const far = 1000

    // scene and camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
    camera.position.set(0, 10, 50);
    camera.lookAt(0, 0, 0);

    // renderer
    const renderer = new THREE.WebGLRenderer();
    const domElement = renderer.domElement;
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setAnimationLoop( animate );
    document.body.appendChild( domElement );

    // orbital camera
    const controls = new OrbitControls(camera, domElement);
    controls.target.set(0, 5, 0);
    controls.update();


    const planeSize = 40;

    // floor texture
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(floorTexture, () => {
        //callback when texture loads?
    });
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    texture.colorSpace = THREE.SRGBColorSpace;
    const repeats = planeSize / 2;
    texture.repeat.set(repeats, repeats);

    // floor plane
    const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
    const planeMat = new THREE.MeshPhongMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.rotation.x = Math.PI * -.5;
    scene.add(mesh);



    // load MN object
    const loader = new GLTFLoader(); 
    loader.load( objFile, function ( gltf ) {
        const model = gltf.scene;

        model.position.set(0, 6, 0);
        model.rotation.y = -(Math.PI/2);
        model.scale.set(10, 10, 10);
        model.userData.name = 'block_MN';
        scene.add( model );

        console.log('model', model);
        // animate(model);

    }, undefined, function ( error ) { 
        console.error( error ); 
    });



    //Ambient lighting
    const colorA = 0xFFFFFF;
    const intensityA = 0.5;
    const lightA = new THREE.AmbientLight(colorA, intensityA);
    lightA.position.set(0, 0, 55);
    scene.add(lightA);


    //DirectionalLight
    const colorD = 0xFFFFFF;
    const intensityD = 0.75;
    const lightD = new THREE.DirectionalLight(colorD, intensityD);
    lightD.position.set(0, 10, 5);
    lightD.target.position.set(-5, 0, 0);
    scene.add(lightD);
    scene.add(lightD.target);


    function animate() {
        scene.children.forEach(child => {
            if (child instanceof THREE.Object3D && child.userData.name == "block_MN") {
                child.rotation.y += 0.0005;
            }
        });
        renderer.render( scene, camera );
    }
} else {
    const warning = WebGL.getWebGL2ErrorMessage();
    document.getElementById( 'container' ).appendChild( warning );
}