import * as THREE from "three";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Vector3 } from "three";
import gui from "./Details.js"


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
const light = new THREE.AmbientLight(0xffffff, .6)

const sun = new THREE.PointLight(0xffffff, 1, 50, 2);
sun.position.set(20, 10, 20);

gui.add(sun, 'intensity', 1, 10, .1)

scene.add(gui);
scene.add(sun);
scene.add(light)

const sphereSize = 1;
const pointLightHelper = new THREE.PointLightHelper(sun, sphereSize);
scene.add(pointLightHelper);

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

let turn_number = 0
let number_players = 2
let id = 1
let moves = 3
let player_units = []

make_group(1, 0x00ff00, 12, 12)
make_group(1, 0x00ff00, 10, 10)
make_group(1, 0x00ff00, 10, 12)
make_group(1, 0x00ff00, 12, 10)

make_group(2, 0xff0000, 0, 0)

generate_board(7, 7)

animate();

take_turn()

function take_turn() {
    console.log(turn_number)
    turn_number += 1
    if (turn_number > number_players) {
        turn_number = 1
    }
    if (turn_number != id) {
        // enemy  ai turn
        setTimeout(take_turn, 10000)
    }
    else {
        // player turn
        for (let elem in player_units) {
            player_units[elem].userData.movable = true
        }
        moves = player_units.length
    }
}

function make_group(player_id, color, x, z) {
    let group = new THREE.Group();
    load("15x15_basic", (e) => {
        e.position.set(0, 2, 0)
        e.geometry.center()
        e.userData.animated = true
        e.castShadow = true
        e.receiveShadow = true
        group.add(e)
    })
    load("15x15_emissive", (e) => {
        e.position.set(0, 2, 0)
        e.geometry.center()
        e.material = new THREE.MeshBasicMaterial({ color: color })
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
        e.userData.animated = true
        e.castShadow = true
        e.receiveShadow = true
        group.add(e)
    })
    let light = new THREE.PointLight(color, 5.0, 8.0)
    light.position.set(0, 2, 0)
    light.castShadow = true
    group.add(light)
    group.position.set(x, 0, z)
    group.userData.health = 100;
    group.userData.movement = 2;
    group.userData.movable = true
    group.userData.player_id = player_id
    if (group.userData.player_id == id) {
        group.userData.draggable = true
        player_units.push(group)
    }
    console.log(group)
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
                e.userData.tile = true
                e.material[0].color.set(0x0f0f0f)
                boardGroup.add(e)
            })
        }
    }
    scene.add(boardGroup)
}

window.addEventListener('mousedown', () => {
    if (id == turn_number) {
        console.log("your turn")
        // console.log(intersection[0].object.parent.userData.movable)
        if (intersection.length > 0) {
            if (intersection[0].object.parent.userData.draggable && intersection[0].object.parent.userData.movable) {
                draggable = intersection[0].object.parent
                console.log(draggable)
                original_location = draggable.position.clone()
                controls.enableRotate = false
                let range = draggable.userData.movement
                for (let i = 0; i < boardGroup.children.length; i++) {
                    if (original_location.distanceTo(boardGroup.children[i].position) <= range * 2) {
                        movableTile.push(boardGroup.children[i])
                    }
                }
                for (var i = 0; i < movableTile.length; i++) {
                    let edgesMesh = new THREE.BoundingBoxHelper(movableTile[i]);
                    edgesMesh.material.color.set(0x00ff00)
                    scene.add(edgesMesh)
                    movableTile[i].userData.temp_mesh = edgesMesh
                    // movableTile[i].userData.original_color = movableTile[i].material[0].color.getHex()
                    // movableTile[i].material[0].color.set(0x002200)
                }
            }
        }
    }
})

window.addEventListener('mouseup', () => {
    let occupied = false
    if (draggable) {
        new_position.set(Math.round(draggable.position.x / 2) * 2, 0.0, Math.round(draggable.position.z / 2) * 2)
        if (original_location.distanceTo(new_position) <= draggable.userData.movement * 2 && original_location.distanceTo(new_position) > 1.0) {
            for (let i = 0; i < scene.children.length; i++) {
                console.log(scene.children[i])
                console.log(scene.children[i].position.distanceTo(new_position))
                if (scene.children[i].position.distanceTo(new_position) <= 0.1 && !scene.children[i].userData.tile) {
                    occupied = true
                    console.log(occupied)
                }
            }
            if (!occupied) {
                draggable.position.set(new_position.x, new_position.y, new_position.z)
                moves -= 1
                draggable.userData.movable = false
                if (moves == 0) {
                    take_turn()
                }
            }
            else {
                draggable.position.set(original_location.x, original_location.y, original_location.z)
            }
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
        console.log(moves)
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
