import * as THREE from "three";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { DragControls } from "three/examples/jsm/controls/DragControls.js";

//create 3 required objects: scene, camera, and renderer
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#C'),
});

const w = window.innerWidth;
const h = window.innerHeight;
const camera = new THREE.PerspectiveCamera(45, w / h, 1, 1000);
camera.position.set(5, 10, 5);

renderer.setSize(w, h);

const amb_light = new THREE.AmbientLight(0xffffff, 2.0);
amb_light.position.set(0, 100, 100);
scene.add(amb_light)

const dir_light = new THREE.DirectionalLight(0xffffff, 2.0);
dir_light.position.set(0, 100, 50);
scene.add(dir_light)

const controls = new OrbitControls(camera, renderer.domElement)

function animate() {
    requestAnimationFrame(animate);

    controls.update()

    renderer.render(scene, camera);
};

animate();

function load(filename, fn) {
    const mtlLoader = new MTLLoader();
    mtlLoader.setPath('models/models/obj/');
    mtlLoader.load(filename + ".mtl", function (materials) {
        materials.preload();
        const objLoader = new OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath('models/models/obj/');
        objLoader.load(filename + ".obj", function (object) {
            fn(object.children[0]);
        });
    });
}

let obs = []

load("ModularFloor", (e) => {
    e.position.set(0, 0, 0);
    scene.add(e)
})

load("Barrel", (e) => {
    e.position.set(0, 0, 0);
    e.userData.draggable = true
    obs.push(e)
    scene.add(e)
})


let dControls = new DragControls(obs, camera, renderer.domElement);

dControls.addEventListener('dragstart', function (event) {
    controls.enableRotate = false

});

dControls.addEventListener('dragend', function (event) {
    controls.enableRotate = true


});

const mouse = new THREE.Vector2(-1, -1);

window.addEventListener('mousedown', () => {
    const raycast = new THREE.Raycaster();
    raycast.setFromCamera(mouse, camera);
    var intersection = raycast.intersectObjects(scene.children);
    if (intersection.length > 0) {
        // console.log(intersection[0])
        handleClick(intersection[0]);
    }
});

document.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

});

function handleClick(e) {
    if (e.object.userData.draggable) {
        console.log(e)
    }
}


