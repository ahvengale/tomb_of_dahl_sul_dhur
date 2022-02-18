import * as THREE from "/node/three/build/three.module.js";
import Entity from "/static/src/Entity.js"

//create 3 required objects: scene, camera, and renderer
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, .01, 1000)
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#C'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight)

camera.position.setZ(30);

renderer.render(scene, camera)

const geometry = new Entity(["15x15x31_Tower"]);
const material = new THREE.MeshBasicMaterial({ color: 0xF235df, wireframe: true })
const m = new THREE.Mesh(geometry, material)

scene.add(m)

function game_loop() {
    requestAnimationFrame(game_loop);
    renderer.render(scene, camera)

}


game_loop();






/*
window.addEventListener('resize', onWindowResize, false);
document.addEventListener('mousemove', onMouseMove, false);
gameboard = new GameBoard(3);
function onWindowResize() {
    var new_aspect = window.innerWidth / window.innerHeight;
    rendering_engine.camera.left = rendering_engine.view_size * new_aspect / -2;
    rendering_engine.camera.right = rendering_engine.view_size * new_aspect / 2;
    rendering_engine.camera.top = rendering_engine.view_size / 2;
    rendering_engine.camera.bottom = rendering_engine.view_size / -2;
    rendering_engine.camera.updateProjectionMatrix();
    rendering_engine.renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

}

function onMouseOver() {
    var raycaster = new Raycaster();
    raycaster.setFromCamera(mouse, camera);
    var intersection = raycaster.intersectObjects(scene.children);
    const entities_hit = [];
    if (intersection.length > 0) {
        for (var i = 0; i < 1; i++) {
            // console.log(intersection[i].object.uuid);
            for (var j = 0; j < entities.length; j++) {
                // console.log(entities[j].geometries.includes(intersection[i].object));
                if (!entities_hit.includes(entities[j])) {
                    entities_hit.push(entities[j]);
                }

            }
        }
        for (var i = 0; i < entities_hit.length; i++) {
            // entities_hit[i].animate();
        }
    }
}
*/