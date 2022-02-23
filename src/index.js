import * as THREE from "three";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Vector3 } from "three";


//create 3 required objects: scene, camera, and renderer
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#C'),
});

// create camera, set size, camera control
const w = window.innerWidth;
const h = window.innerHeight;
const camera = new THREE.PerspectiveCamera(45, w / h, 1, 1000)
camera.position.set(5, 10, 5)
renderer.setSize(w, h)
const controls = new OrbitControls(camera, renderer.domElement)

// enable shadows
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

// make light
const light = new THREE.AmbientLight(0xffffff, 0.0)
scene.add(light)

// mouse defined for mousemove event
const mouse = new THREE.Vector2(-1, -1)


let boardGroup = new THREE.Group()

// variables for raycasting and drag positions
const raycast = new THREE.Raycaster()
const floor = new THREE.Plane(new Vector3(0, 1, 0), 0)
let intersection
let draggable = new THREE.Object3D()
let original_location = new THREE.Vector3()
let new_position = new THREE.Vector3()
let movableTile = []

make_group()
generate_board(7, 7)
animate();

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
        e.material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
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
            clearcoat: 0.3,
        });
        // console.log(e.material)
        e.userData.draggable = true
        e.userData.animated = true
        e.castShadow = true
        e.receiveShadow = true

        group.add(e)
    })
    let light = new THREE.PointLight(0x00ff00, 5.0, 8.0)
    light.position.set(0, 2, 0)
    light.castShadow = true
    group.add(light)
    group.position.set(6, 0, 6)
    group.userData.health = 100;
    group.userData.movement = 2;
    scene.add(group)
}

function animate() {
    requestAnimationFrame(animate)
    controls.update()

    scene.traverse(function (obj) {
        if (obj.userData.animated) {
            obj.rotation.x += 0.01
            obj.rotation.y += 0.01
            obj.rotation.z += 0.01
        }
    })

    renderer.render(scene, camera)
}

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
        for (let j = 0; j < y; j++) {
            load("ModularFloor", (e) => {
                e.position.set(i * 2, 0, j * 2)
                e.castShadow = true
                e.receiveShadow = true
                e.material[0].color.set(0x0f0f0f)
                boardGroup.add(e)
            })
        }
    }
    scene.add(boardGroup)
}

window.addEventListener('mousedown', () => {
    if (intersection.length > 0) {
        if (intersection[0].object.userData.draggable) {
            draggable = intersection[0].object
            if (draggable.parent instanceof THREE.Group) {
                draggable = draggable.parent
                original_location = intersection[0].object.parent.position.clone()
            }
            else {
                original_location = intersection[0].object.position.clone()
            }
            controls.enableRotate = false
            let range = draggable.userData.movement
            for (let i = 0; i < boardGroup.children.length; i++) {
                if (original_location.distanceTo(boardGroup.children[i].position) <= range * 2) {
                    movableTile.push(boardGroup.children[i])
                }
            }
            for (var i = 0; i < movableTile.length; i++) {
                let edgesMesh = new THREE.LineSegments(movableTile[i].geometry, new THREE.LineBasicMaterial({ color: 0x00ff00 }));
                edgesMesh.position.set(movableTile[i].position.x, movableTile[i].position.y, movableTile[i].position.z)
                scene.add(edgesMesh)
                movableTile[i].userData.temp_mesh = edgesMesh
                // movableTile[i].userData.original_color = movableTile[i].material[0].color.getHex()
                // movableTile[i].material[0].color.set(0x002200)
            }
        }
    }
})

window.addEventListener('mouseup', () => {
    if (draggable) {
        new_position.set(Math.round(draggable.position.x / 2) * 2, 0.0, Math.round(draggable.position.z / 2) * 2)
        if (original_location.distanceTo(new_position) <= draggable.userData.movement * 2) {
            draggable.position.set(new_position.x, new_position.y, new_position.z)
        }
        else {
            draggable.position.set(original_location.x, original_location.y, original_location.z)
        }
        draggable = false
        controls.enableRotate = true
        for (var i = 0; i < movableTile.length; i++) {
            // movableTile[i].material[0].color.set(movableTile[i].userData.original_color)
            scene.remove(movableTile[i].userData.temp_mesh)
        }
        movableTile = []
    }
})

window.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
    raycast.setFromCamera(mouse, camera);
    intersection = raycast.intersectObjects(scene.children)
    if (intersection.length > 0) {
        if (draggable) {
            let point = new Vector3()
            point = raycast.ray.intersectPlane(floor, point)
            draggable.position.x = point.x
            draggable.position.z = point.z
            draggable.position.y = 0.3
        }
    }
})

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight)

    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix();

})
