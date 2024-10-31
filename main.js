import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { ColorGUIHelper  } from './ColorGUIHelper.js';

import floorTexture from './public/checker.png';

// WebGL compatibility check
if ( WebGL.isWebGL2Available() ) {
    const fov = 35;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 0.1;
    const far = 1000

    // scene and camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
    camera.position.set(0, 0, 50);
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
    const loader = new THREE.TextureLoader();
    const texture = loader.load(floorTexture, () => {
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



    // shapes
    { // cube
        const cubeSize = 4;
        const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
        const cubeMat = new THREE.MeshPhongMaterial({color: '#8AC'});
        const mesh = new THREE.Mesh(cubeGeo, cubeMat);
        mesh.position.set(cubeSize + 1, cubeSize / 2, 0);
        scene.add(mesh);
    }
    { // sphere
        const sphereRadius = 3;
        const sphereWidthDivisions = 32;
        const sphereHeightDivisions = 16;
        const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
        const sphereMat = new THREE.MeshPhongMaterial({color: '#CA8'});
        const mesh = new THREE.Mesh(sphereGeo, sphereMat);
        mesh.position.set(-sphereRadius - 1, sphereRadius + 2, 0);
        scene.add(mesh);
    }


    //Ambient lighting
    const colorA = 0xFFFFFF;
    const intensityA = 0.2;
    const lightA = new THREE.AmbientLight(colorA, intensityA);
    lightA.position.set(0, 0, 55);
    scene.add(lightA);

    //lightA gui
    // const gui = new GUI();
    // gui.addColor(new ColorGUIHelper (lightA, 'color'), 'value').name('color');
    // gui.add(lightA, 'intensity', 0, 5, 0.01);


    // HemisphereLight
    const skyColor = 0xB1E1FF;  // light blue
    const groundColor = 0xB97A20;  // brownish orange
    const intensityH = 0.5;
    const lightH = new THREE.HemisphereLight(skyColor, groundColor, intensityH);
    // scene.add(lightH);

    // const gui = new GUI();
    // gui.addColor(new ColorGUIHelper(lightH, 'color'), 'value').name('skyColor');
    // gui.addColor(new ColorGUIHelper(lightH, 'groundColor'), 'value').name('groundColor');
    // gui.add(lightH, 'intensity', 0, 5, 0.01);


    //DirectionalLight
    const colorD = 0xFFFFFF;
    const intensityD = 0.5;
    const lightD = new THREE.DirectionalLight(colorD, intensityD);
    lightD.position.set(0, 10, 0);
    lightD.target.position.set(-5, 0, 0);
    scene.add(lightD);
    scene.add(lightD.target);

    const gui = new GUI();
    gui.addColor(new ColorGUIHelper(lightD, 'color'), 'value').name('color');
    gui.add(lightD, 'intensity', 0, 5, 0.01);
    gui.add(lightD.target.position, 'x', -10, 10);
    gui.add(lightD.target.position, 'z', -10, 10);
    gui.add(lightD.target.position, 'y', 0, 10);


    
    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshBasicMaterial( { color: 0xe28743 } );
    const cube =     new THREE.Mesh( geometry, material );
    scene.add( cube );

    const points = [];
    points.push(new THREE.Vector3(-10, 0, 0));
    points.push(new THREE.Vector3(0, -10, 0));
    points.push(new THREE.Vector3(10, 0, 0));
    points.push(new THREE.Vector3(0, 10, 0));
    points.push(new THREE.Vector3(-10, 0, 0));

    const lineGeometry = new THREE.BufferGeometry().setFromPoints( points );
    const line = new THREE.Line( lineGeometry, material );
    scene.add(line);

    let speedLR = 0.02;
    let speedUD = 0.04;
    let directionLR = -1;
    let directionUD = -1;
    let limitLR = 5;
    let limitUD = 5;

    function animate() {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

        // Move cube Left and Right
        if (cube.position.x >= limitLR) {
            directionLR = -1; // Reverse direction to left
        } else if (cube.position.x <= -limitLR) {
            directionLR = 1; // Reverse direction to right
        }

        // Move cube up and down
        if (cube.position.y >= limitUD){
            directionUD = -1; // Reverse direction down
        } else if (cube.position.y <= -limitUD) {
            directionUD = 1; // Reverse direction up
        }

        cube.position.x += (directionLR * speedLR);
        cube.position.y += (directionUD * speedUD);
        renderer.render( scene, camera );
    }
} else {
    const warning = WebGL.getWebGL2ErrorMessage();
    document.getElementById( 'container' ).appendChild( warning );
}