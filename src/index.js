import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Vector3 } from "three";
import gui from "./Details.js"
import Player from "./Player.js";
import MapMaker from "./MapMaker.js";

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
const light = new THREE.AmbientLight(0xffffff, 3.0)

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

// variables for raycasting and drag positions
const raycast = new THREE.Raycaster()
const floor = new THREE.Plane(new Vector3(0, 1, 0), 0)
let intersection
let draggable = new THREE.Object3D()
let original_location = new THREE.Vector3()
let new_position = new THREE.Vector3()
let movableTile = []
let turn_number = 0
let id = 1;
let players = []
let moves = 3

let p1 = new Player(1, 0x00ff00, 12, 12)
scene.add(p1.createPlayer())

// let p2 = new Player(2, 0xff0000, 0, 0)
// scene.add(p2.createPlayer())

players.push(p1)

const MAP = new MapMaker()
let tiles = await MAP.generate("map1")
scene.add(tiles)


animate();

take_turn()

function take_turn() {
    turn_number++
    if (turn_number > players.length) {
        turn_number = 1
    }
    let currentPlayer = players[turn_number - 1]
    console.log(currentPlayer == players[0] ? "your Turn" : "AI")

    let units = currentPlayer.getPlayerUnits().length;

    //UI showing current player and number of units active
    document.getElementById("Player").innerText = turn_number
    document.getElementById("Units").innerText = units


    if (currentPlayer == players[1]) {
        // enemy  ai turn
        console.log("AI")
        setTimeout(() => { take_turn() }, 5000)
    }
    else {
        // player turn
        console.log("Your Turn")
        currentPlayer.getPlayerUnits().forEach(elem => {
            console.log(elem)
            elem.userData.movable = true
        })
        moves = units

    }
}

const addBtn = document.getElementById("AddUnit")
addBtn.addEventListener("click", () => {
    scene.add(p1.createPlayer())
    take_turn()
})

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

window.addEventListener('mousedown', () => {
    console.log(players[0].getPlayerId() + " = " + turn_number)
    if (turn_number == players[0].getPlayerId()) {
        // console.log(intersection[0].object.parent.userData.movable)
        if (intersection.length > 0) {
            if (intersection[0].object.parent.userData.draggable && intersection[0].object.parent.userData.movable) {
                draggable = intersection[0].object.parent
                console.log(draggable)
                original_location = draggable.position.clone()
                controls.enableRotate = false
                let range = draggable.userData.movement
                for (let i = 0; i < tiles.children.length; i++) {
                    if (original_location.distanceTo(tiles.children[i].position) <= range * 2) {
                        movableTile.push(tiles.children[i])
                    }
                }
                for (var i = 0; i < movableTile.length; i++) {
                    let edgesMesh = new THREE.BoxHelper(movableTile[i]);
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
