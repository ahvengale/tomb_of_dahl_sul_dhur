import * as THREE from "three";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { DragControls } from "three/examples/jsm/controls/DragControls.js";
import { CompressedPixelFormat, PCFSoftShadowMap, TetrahedronBufferGeometry, Vector3 } from "three";

//create 3 required objects: scene, camera, and renderer
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#C'),
});

const w = window.innerWidth;
const h = window.innerHeight;
const camera = new THREE.PerspectiveCamera(45, w / h, 1, 1000)
camera.position.set(5, 10, 5)

renderer.setSize(w, h)

const light = new THREE.AmbientLight(0xffffff, 0.1)
scene.add(light)

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

let cool_thing, other_cool_thing;

const controls = new OrbitControls(camera, renderer.domElement)

make_group()

function make_group() {
    let group = new THREE.Group();
    load("15x15_basic", (e) => {
        e.position.set(0, 2, 0)
        e.geometry.center()
        e.userData.draggable = true
        e.userData.animated = true
        e.castShadow = true
        e.receiveShadow = true
        group.add(e)
    })
    load("15x15_emissive", (e) => {
        e.position.set(0, 2, 0)
        e.geometry.center()
        e.material = new THREE.MeshBasicMaterial({color: 0x00ff00})
        e.userData.draggable = true
        e.userData.animated = true
        e.castShadow = false
        e.receiveShadow = false
        group.add(e)
    })
    load("15x15_glass", (e) => {
        e.position.set(0, 2, 0)
        e.geometry.center()
        e.material = new THREE.MeshPhysicalMaterial({  
            roughness: 0.2,  
            transmission: 1.0,  
            thickness: 2,
            clearcoat:0.3,
        });
        // console.log(e.material)
        e.userData.draggable = true
        e.userData.animated = true
        e.castShadow = true
        e.receiveShadow = true
        e.userData.health = 100;
        e.userData.movement = 2;
        group.add(e)
    })
    let light = new THREE.PointLight(0x00ff00, 3.0, 6.0)
    light.position.set(0, 2, 0)
    light.castShadow = true
    group.add(light)
    group.position.set(6, 0, 6)
    console.log(group)
    scene.add(group)
}

function animate() {
    requestAnimationFrame(animate);
    controls.update()

    scene.traverse( function(obj) {
        if (obj.userData.animated) {
            obj.rotation.x += 0.01
            obj.rotation.y += 0.01
            obj.rotation.z += 0.01
        }
    } );
    
    renderer.render(scene, camera);
};

// console.log(scene.children)

function load(filename, fn) {
    const mtlLoader = new MTLLoader()
    mtlLoader.setPath('models/models/obj/')
    mtlLoader.load(filename + ".mtl", function (materials) {
        materials.preload()
        const objLoader = new OBJLoader()
        objLoader.setMaterials(materials)
        objLoader.setPath('models/models/obj/')
        objLoader.load(filename + ".obj", function (object) {
            fn(object.children[0])
        });
    });
}

function generate_board(x, y) {
    for (let i = 0; i < x; i++) {
        for(let j = 0; j < y; j++) {
            load("ModularFloor", (e) => {
                e.position.set(i * 2, 0, j * 2)
                e.castShadow = true
                e.receiveShadow = true
                scene.add(e)
            })
        }
    }
}

generate_board(7, 7)

const mouse = new THREE.Vector2(-1, -1)
const raycast = new THREE.Raycaster();
let intersection
let draggable

let original_location = new THREE.Vector3()
let new_position = new THREE.Vector3()

const floor = new THREE.Plane(new Vector3(0, 1, 0), 0)

window.addEventListener('mousedown', () => {
    // console.log('henlo')
    // console.log(intersection[0])
    if(intersection.length > 0) {
        if(intersection[0].object.userData.draggable) {
            // console.log(original_location)
            draggable = intersection[0].object
            if(draggable.parent instanceof THREE.Group)
            {
                draggable = draggable.parent
                original_location = intersection[0].object.parent.position.clone()
            }
            else {
                original_location = intersection[0].object.position.clone()
            }
            controls.enableRotate = false
            console.log(original_location)
        }
    }
}, false);

window.addEventListener('mouseup', () => {
    if(draggable) {
        // console.log(draggable)
        new_position.set(Math.round(draggable.position.x / 2) * 2, 0.3, Math.round(draggable.position.z / 2) * 2)
        console.log('New: ' + new_position.x)
        console.log('Old: ' + original_location.x)
        console.log('Dist: ' + original_location.distanceTo(new_position))
        if(original_location.distanceTo(new_position) <= 4)
        {
            draggable.position.set(new_position.x, new_position.y, new_position.z)
            // console.log('just right')
            // console.log(draggable.position)
        }
        else {
            draggable.position.set(original_location.x, original_location.y, original_location.z)
            // console.log('too far')
            // console.log(draggable.position)
        }
        draggable = false
        controls.enableRotate = true
    }
}, false);

document.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
    raycast.setFromCamera(mouse, camera);
    intersection = raycast.intersectObjects(scene.children)
    if(intersection.length > 0) {
        if(draggable) {
            let point = new Vector3()
            point = raycast.ray.intersectPlane(floor, point)
            // console.log(point)
            draggable.position.x = point.x
            draggable.position.z = point.z
            draggable.position.y = 0.3
        }
    }
}, false);

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight)

    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix();

});

animate();
