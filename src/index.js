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

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const amb_light = new THREE.AmbientLight(0xffffff, 2.0)
amb_light.position.set(0, 100, 100)
scene.add(amb_light)

let cool_thing, other_cool_thing;

const controls = new OrbitControls(camera, renderer.domElement)

make_group()

function make_group() {
    let group = new THREE.Group();
    load("15x15_basic", (e) => {
        e.position.set(2, 2, 2)
        e.geometry.center()
        e.userData.draggable = true
        e.userData.animated = true
        e.castShadow = true
        e.receiveShadow = true
        group.add(e)
    })
    load("15x15_glass", (e) => {
        e.position.set(2, 2, 2)
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
        group.add(e)
    })
    let light = new THREE.PointLight(0x00ff00, 2.0)
    light.position.set(2, 2, 2)
    light.castShadow = true
    group.add(light)
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

// load("ModularFloor", (e) => {
//     e.position.set(0, 0, 0);
//     scene.add(e)
// })

generate_board(3, 3)

// load("15x15_basic", (e) => {
//     e.position.set(2, 2, 2)
//     e.geometry.center()
//     e.userData.draggable = true
//     e.userData.animated = true
//     e.castShadow = true
//     e.receiveShadow = true
//     scene.add(e)
//     cool_thing = e
// })

// load("15x15_glass", (e) => {
//     e.position.set(2, 2, 2)
//     e.geometry.center()
//     e.material = new THREE.MeshPhysicalMaterial({  
//         roughness: 0.2,  
//         transmission: 1.0,  
//         thickness: 2,
//         clearcoat:0.3,
//     });
//     console.log(e.material)
//     e.userData.draggable = true
//     e.userData.animated = true
//     e.castShadow = true
//     e.receiveShadow = true
//     scene.add(e)
//     other_cool_thing = e
// })

const mouse = new THREE.Vector2(-1, -1)
const raycast = new THREE.Raycaster();
let intersection
let draggable

const floor = new THREE.Plane(new Vector3(0, 1, 0), 0)

window.addEventListener('mousedown', () => {
    // console.log('henlo')
    // console.log(intersection[0])
    if(intersection.length > 0) {
        if(intersection[0].object.userData.draggable) {
            draggable = intersection[0].object
            if(draggable.parent instanceof THREE.Group)
            {
                draggable = draggable.parent
            }
            controls.enableRotate = false
        }
    }
}, false);

window.addEventListener('mouseup', () => {
    if(draggable) {
        console.log(draggable)
        draggable.position.set(Math.round(draggable.position.x / 2) * 2, .3, Math.round(draggable.position.z / 2) * 2)
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
