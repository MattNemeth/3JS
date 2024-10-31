import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';

if ( WebGL.isWebGL2Available() ) {
    const scene =    new THREE.Scene();
    const camera =   new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    const renderer = new THREE.WebGLRenderer();

    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setAnimationLoop( animate );
    document.body.appendChild( renderer.domElement );

    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshBasicMaterial( { color: 0xe28743 } );
    const cube =     new THREE.Mesh( geometry, material );

    camera.position.z = 5;
    scene.add( cube );

    let speedLR = 0.01;
    let speedUD = 0.02;
    let directionLR = -1;
    let directionUD = -1;
    let limitLR = 2;
    let limitUD = 2;

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